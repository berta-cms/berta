import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ActionStatus, Actions, Store } from '@ngxs/store';
import { Subject } from 'rxjs';

import { EditorSyncService, editorSyncInterceptor } from './editor-sync';
import { PopupService } from '../popup/popup.service';
import {
  UserLoginAction,
  UserLogoutAction,
  UserTokenRenewedAction,
} from '../user/user.actions';

describe('editorSyncInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;
  let sync: EditorSyncService;
  let popupService: PopupService;
  let store: jasmine.SpyObj<Store>;
  let actions$: Subject<{ action: unknown; status: ActionStatus }>;

  /** Answers a request with the latest change, as the API's EditorSync middleware does. */
  function answer(
    url: string,
    change: { token: string; writer?: string; source?: string },
    status = 200,
  ) {
    backend.expectOne(url).flush(
      {},
      {
        status,
        statusText: status === 200 ? 'OK' : 'Conflict',
        headers: {
          'X-Berta-Change': change.token,
          'X-Berta-Change-Writer': change.writer ?? '',
          'X-Berta-Change-Source': change.source ?? '',
        },
      },
    );
  }

  beforeEach(() => {
    popupService = new PopupService();
    spyOn(popupService, 'showPopup').and.callThrough();
    store = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    actions$ = new Subject();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([editorSyncInterceptor])),
        provideHttpClientTesting(),
        { provide: PopupService, useValue: popupService },
        { provide: Store, useValue: store },
        { provide: Actions, useValue: actions$ },
      ],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
    sync = TestBed.inject(EditorSyncService);
  });

  afterEach(() => backend.verify());

  it('sends the window and the latest change it has seen to the editor API', () => {
    http.get('/_api/v1/state').subscribe();
    answer('/_api/v1/state', { token: 'change-1', source: 'agent' });

    http.patch('/_api/v1/sites/settings', {}).subscribe();
    const save = backend.expectOne('/_api/v1/sites/settings');

    expect(save.request.headers.get('X-Berta-Editor')).toBe(sync.editorId);
    expect(save.request.headers.get('X-Berta-Change')).toBe('change-1');
    save.flush({});
  });

  it('sends no change before the window has seen one', () => {
    http.get('/_api/v1/state').subscribe();
    const request = backend.expectOne('/_api/v1/state');

    expect(request.request.headers.get('X-Berta-Editor')).toBe(sync.editorId);
    expect(request.request.headers.has('X-Berta-Change')).toBeFalse();
    request.flush({});
  });

  it('starts over after logout, since the login loads all data fresh', () => {
    http.get('/_api/v1/state').subscribe();
    answer('/_api/v1/state', { token: 'change-1', source: 'agent' });

    actions$.next({
      action: new UserLogoutAction(),
      status: ActionStatus.Dispatched,
    });
    http.get('/_api/v1/state').subscribe();
    answer('/_api/v1/state', { token: 'change-2', source: 'agent' });

    expect(sync.seenChange).toBe('change-2');
    expect(popupService.showPopup).not.toHaveBeenCalled();
  });

  it('ignores an answer still on its way at logout once logged in again', () => {
    http.get('/_api/v1/state').subscribe();
    answer('/_api/v1/state', { token: 'change-1', source: 'agent' });
    http.get('/_api/v1/sites/render-menu').subscribe();

    actions$.next({
      action: new UserLogoutAction(),
      status: ActionStatus.Dispatched,
    });
    answer('/_api/v1/sites/render-menu', {
      token: 'change-1',
      source: 'agent',
    });
    actions$.next({
      action: new UserLoginAction({ token: 'new-token' }),
      status: ActionStatus.Dispatched,
    });
    // The login reloads the data, with a change made while logged out.
    http.get('/_api/v1/state').subscribe();
    answer('/_api/v1/state', { token: 'change-2', source: 'agent' });

    expect(sync.seenChange).toBe('change-2');
    expect(popupService.showPopup).not.toHaveBeenCalled();
  });

  it('shows nothing after an update, before any change is marked', () => {
    http.get('/_api/v1/state').subscribe();
    answer('/_api/v1/state', { token: '' });

    http.patch('/_api/v1/sites/settings', {}).subscribe();
    answer('/_api/v1/sites/settings', {
      token: 'change-1',
      writer: sync.editorId,
      source: 'editor',
    });

    expect(sync.seenChange).toBe('change-1');
    expect(popupService.showPopup).not.toHaveBeenCalled();
  });

  it('shows nothing when the answer has no sync headers', () => {
    // An expired session (401) answers before the API's sync check; a proxy may drop empty headers.
    http.get('/_api/v1/state').subscribe({ error: () => {} });
    backend
      .expectOne('/_api/v1/state')
      .flush({}, { status: 401, statusText: 'Unauthorized' });
    http.get('/_api/v1/sites/render-menu').subscribe();
    backend.expectOne('/_api/v1/sites/render-menu').flush({});

    http.patch('/_api/v1/sites/settings', {}).subscribe();
    const save = backend.expectOne('/_api/v1/sites/settings');

    expect(save.request.headers.has('X-Berta-Change')).toBeFalse();
    expect(popupService.showPopup).not.toHaveBeenCalled();
    save.flush({});
  });

  it('leaves requests to other sites alone', () => {
    http.get('https://example.com/data').subscribe();
    const request = backend.expectOne('https://example.com/data');

    expect(request.request.headers.has('X-Berta-Editor')).toBeFalse();
    request.flush({});
  });

  it("follows the window's own changes, also when answers come out of order", () => {
    http.get('/_api/v1/state').subscribe();
    answer('/_api/v1/state', { token: 'change-1', source: 'agent' });

    http.get('/_api/v1/sites/render-menu').subscribe();
    http.patch('/_api/v1/sites/settings', {}).subscribe();
    answer('/_api/v1/sites/settings', {
      token: 'change-2',
      writer: sync.editorId,
      source: 'editor',
    });
    answer('/_api/v1/sites/render-menu', {
      token: 'change-1',
      source: 'agent',
    });

    expect(sync.seenChange).toBe('change-2');
    expect(popupService.showPopup).not.toHaveBeenCalled();
  });

  it('asks once to reload when someone else changed the website', () => {
    http.get('/_api/v1/state').subscribe();
    answer('/_api/v1/state', {
      token: 'change-1',
      source: 'editor',
      writer: 'other',
    });

    // The API refuses the stale save.
    http.patch('/_api/v1/sites/settings', {}).subscribe({ error: () => {} });
    answer(
      '/_api/v1/sites/settings',
      { token: 'change-2', source: 'agent' },
      409,
    );
    http.get('/_api/v1/sites/render-menu').subscribe();
    answer('/_api/v1/sites/render-menu', {
      token: 'change-2',
      source: 'agent',
    });

    expect(popupService.showPopup).toHaveBeenCalledTimes(1);
    expect(
      (popupService.showPopup as jasmine.Spy).calls.mostRecent().args[0],
    ).toEqual(
      jasmine.objectContaining({
        type: 'warn',
        content:
          'This website was changed by an AI agent. Reload to see the changes.',
        isModal: true,
      }),
    );
    expect(sync.seenChange).toBe('change-1');
  });

  it('ignores an empty change after a real one, e.g. after the cache was cleared', () => {
    http.get('/_api/v1/state').subscribe();
    answer('/_api/v1/state', { token: 'change-1', source: 'agent' });

    http.get('/_api/v1/sites/render-menu').subscribe();
    answer('/_api/v1/sites/render-menu', { token: '' });

    expect(sync.seenChange).toBe('change-1');
    expect(popupService.showPopup).not.toHaveBeenCalled();
  });

  /** Makes the API answer with a change by an AI agent, which asks to reload. */
  function changeByAgent() {
    http.get('/_api/v1/state').subscribe();
    answer('/_api/v1/state', { token: 'change-1', source: 'agent' });
    http.get('/_api/v1/sites/render-menu').subscribe();
    answer('/_api/v1/sites/render-menu', {
      token: 'change-2',
      source: 'agent',
    });
  }

  it('asks to reload again after another popup replaced the request and closed', async () => {
    changeByAgent();
    const reloadPopup = popupService.popupState$.value;
    expect(reloadPopup).not.toBeNull();

    // An error message replaces it for a moment.
    popupService.showPopup({
      type: 'error',
      content: 'Oops unexpected error!',
    });
    popupService.closePopup();
    await Promise.resolve();

    expect(popupService.popupState$.value).toBe(reloadPopup);
  });

  it('closes the request to reload on login, which loads all data fresh', async () => {
    changeByAgent();

    actions$.next({
      action: new UserLoginAction({ token: 'new-token' }),
      status: ActionStatus.Dispatched,
    });
    await Promise.resolve();

    expect(popupService.popupState$.value).toBeNull();
  });

  it('stores a renewed session token', () => {
    http.get('/_api/v1/state').subscribe();
    backend
      .expectOne('/_api/v1/state')
      .flush({}, { headers: { 'X-Berta-Token': 'renewed-token' } });

    expect(store.dispatch).toHaveBeenCalledWith(
      new UserTokenRenewedAction('renewed-token'),
    );
  });
});
