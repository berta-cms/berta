import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, Injector, inject } from '@angular/core';
import { Actions, Store, ofActionDispatched } from '@ngxs/store';
import { filter, take, tap } from 'rxjs/operators';

import { PopupState } from '../popup/popup.interface';
import { PopupService } from '../popup/popup.service';
import {
  UserLoginAction,
  UserLogoutAction,
  UserTokenRenewedAction,
} from '../user/user.actions';

/** How often coming back to the editor tab checks for changes made elsewhere, at most. */
const FOCUS_CHECK_INTERVAL_MS = 10 * 1000;

/**
 * Keeps this editor window in step with changes made elsewhere: in another editor window (tab,
 * browser or device) or by an AI agent. The API marks every change (EditorSync middleware) and
 * sends the latest one with every response. When this window sees a change it didn't make, it asks
 * the user to reload, because its values are stale; the API also refuses its saves until then, so
 * it can't overwrite that change. The request to reload stays until the window reloads, since
 * other popups (e.g. error messages) may replace it for a moment. Checks again whenever the tab
 * comes back into view. Logout and login start over, since the login loads all data fresh: answers
 * to requests still on their way at logout must not count as news afterwards.
 */
@Injectable({ providedIn: 'root' })
export class EditorSyncService {
  /** This window's id, so the API can tell its own changes from others'. */
  readonly editorId = randomId();

  /** The latest change this window has seen; null until the first API response after loading or login. */
  seenChange: string | null = null;

  private knownChanges = new Set<string>();
  /** The request to reload, while one is pending. */
  private reloadPopup: PopupState | null = null;
  private lastFocusCheck = 0;

  constructor(
    private injector: Injector,
    private popupService: PopupService,
    private store: Store,
    actions$: Actions,
  ) {
    actions$
      .pipe(ofActionDispatched(UserLogoutAction, UserLoginAction))
      .subscribe(() => this.startOver());

    // Another popup replaced the request to reload and has closed: show it again. Deferred, so the
    // popup's other subscribers have seen it close first.
    popupService.popupState$
      .pipe(filter((state) => state === null && this.reloadPopup !== null))
      .subscribe(() =>
        queueMicrotask(() => {
          if (this.reloadPopup && !this.popupService.popupState$.value) {
            this.popupService.showPopup(this.reloadPopup);
          }
        }),
      );

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.checkForChanges();
      }
    });
  }

  /** Reads the latest change and a renewed session token from an API response. */
  readResponse(headers: HttpHeaders) {
    const renewedToken = headers.get('X-Berta-Token');
    if (renewedToken) {
      this.store.dispatch(new UserTokenRenewedAction(renewedToken));
    }

    // Responses can arrive out of order, so an older change this window already knows is no news.
    // Neither is an empty one once the window has seen a change: the API has no marker then (e.g. its
    // cache was cleared), which says nothing about changes.
    const change = headers.get('X-Berta-Change');
    if (
      change === null ||
      this.knownChanges.has(change) ||
      (change === '' && this.seenChange !== null)
    ) {
      return;
    }

    if (
      this.seenChange === null ||
      headers.get('X-Berta-Change-Writer') === this.editorId
    ) {
      this.seenChange = change;
      this.knownChanges.add(change);
      return;
    }

    this.showChangedElsewhere(headers.get('X-Berta-Change-Source'));
  }

  private checkForChanges() {
    const now = Date.now();
    if (now - this.lastFocusCheck < FOCUS_CHECK_INTERVAL_MS) {
      return;
    }
    this.lastFocusCheck = now;

    this.store
      .select((state) => [state.app.urls?.changeMarker, state.user.token])
      .pipe(
        take(1),
        filter(([url, token]) => !!url && !!token),
      )
      .subscribe(([url, token]) => {
        // The interceptor reads the answer; a failed check simply waits for the next one.
        this.injector
          .get(HttpClient)
          .get(url, { headers: { 'X-Authorization': 'Bearer ' + token } })
          .subscribe({ error: () => {} });
      });
  }

  private startOver() {
    this.seenChange = null;
    this.knownChanges.clear();

    const reloadPopup = this.reloadPopup;
    this.reloadPopup = null;
    if (reloadPopup && this.popupService.popupState$.value === reloadPopup) {
      this.popupService.closePopup();
    }
  }

  private showChangedElsewhere(source: string | null) {
    if (this.reloadPopup) {
      return;
    }

    this.reloadPopup = {
      type: 'warn',
      content:
        source === 'agent'
          ? 'This website was changed by an AI agent. Reload to see the changes.'
          : 'This website was changed in another editor window. Reload to see the changes.',
      showOverlay: true,
      isModal: true,
      actions: [
        {
          label: 'Reload',
          type: 'primary',
          callback: () => window.location.reload(),
        },
      ],
    };
    this.popupService.showPopup(this.reloadPopup);
  }
}

/**
 * Sends this window's id and the latest change it has seen with every request to the editor's own
 * API, and reads the answer's sync headers, also of failed requests (a refused save says what
 * changed).
 */
export const editorSyncInterceptor: HttpInterceptorFn = (request, next) => {
  if (
    new URL(request.url, window.location.href).origin !== window.location.origin
  ) {
    return next(request);
  }

  const sync = inject(EditorSyncService);

  // Until the window has seen a change, the API leaves its saves unchecked: e.g. a save retried
  // right after login, before the fresh data has arrived.
  const headers: Record<string, string> = { 'X-Berta-Editor': sync.editorId };
  if (sync.seenChange !== null) {
    headers['X-Berta-Change'] = sync.seenChange;
  }

  return next(request.clone({ setHeaders: headers })).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          sync.readResponse(event.headers);
        }
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse) {
          sync.readResponse(error.headers);
        }
      },
    }),
  );
};

function randomId(): string {
  // crypto.randomUUID() needs HTTPS; local Berta sites run on plain HTTP.
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}
