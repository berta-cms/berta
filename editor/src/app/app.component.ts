import { Component, OnInit, OnDestroy, NgZone, isDevMode } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Subscription, Observable } from 'rxjs';
import { take, switchMap, mergeMap, filter, map, tap } from 'rxjs/operators';
import { Store, Select, Actions, ofActionSuccessful } from '@ngxs/store';

import { AppHideOverlay, AppShowOverlay } from './app-state/app.actions';
import { AppState } from './app-state/app.state';
import {
  UserLoginAction,
  UserLogoutAction,
  SetUserNextUrlAction,
} from './user/user.actions';
import { UserState } from './user/user.state';
import { UserStateModel } from './user/user.state.model';
import { AppStateService } from './app-state/app-state.service';

@Component({
    selector: 'berta-root',
    template: `
    <!--The content below is only a placeholder and can be replaced.-->
    <berta-header></berta-header>
    <main>
      <aside
        [class.fullscreen]="isSidebarFullscreen"
        [class.fullwidth]="isSidebarFullWidth"
        [style.display]="routeIsRoot ? 'none' : ''"
      >
        <!-- the sidebar -->
        <div class="scroll-wrap"><router-outlet></router-outlet></div>
        <a href="#" (click)="closeSidebar($event)" class="close"
          ><svg
            height="16"
            viewBox="0 0 16 16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m16 12.8754q0 .5387-.377104.9158l-1.83165 1.8317q-.377105.3771-.915825.3771-.538721 0-.915825-.3771l-3.959596-3.9596-3.959596 3.9596q-.3771043.3771-.9158249.3771-.5387205 0-.9158249-.3771l-1.83164982-1.8317q-.37710438-.3771-.37710438-.9158 0-.5387.37710438-.9158l3.95959592-3.9596-3.95959592-3.9596q-.37710438-.3771-.37710438-.9158 0-.5387.37710438-.9158l1.83164982-1.8317q.3771044-.3771.9158249-.3771.5387206 0 .9158249.3771l3.959596 3.9596 3.959596-3.9596q.377104-.3771.915825-.3771.53872 0 .915825.3771l1.83165 1.8317q.377104.3771.377104.9158 0 .5387-.377104.9158l-3.959596 3.9596 3.959596 3.9596q.377104.3771.377104.9158z"
              stroke-width=".013468"
            /></svg
        ></a>
      </aside>
      <section>
        <berta-preview></berta-preview>
      </section>
    </main>
    <div
      [style.display]="(showOverlay$ | async) ? '' : 'none'"
      class="overlay"
      (click)="hideOverlay()"
    ></div>
    <berta-popup></berta-popup>
  `,
    styles: [
        `
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      main {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
      }

      berta-header {
        display: block;
        position: relative;
        z-index: 3;
      }

      aside {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        height: 100%;
        width: 384px;
        z-index: 2;
        box-sizing: border-box;
      }

      aside.fullscreen {
        width: auto;
        height: auto;
        top: 5.05em;
        right: 1.3em;
        bottom: 1.3em;
        left: 1.3em;
        padding: 1.3em;
      }

      aside.fullwidth {
        right: 0;
        width: 100%;
        border: 0;
      }

      section {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
      }

      iframe {
        flex-grow: 1;
        width: 100%;
        height: 100%;
      }

      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
      }

      .scroll-wrap {
        display: block;
        overflow-x: hidden;
        height: 100%;
      }

      @media (min-width: 968px) {
        aside.fullscreen {
          left: 50%;
          right: auto;
          transform: translateX(-50%);
          width: 768px;
        }
      }
    `,
    ],
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'berta';
  routeIsRoot = true;
  isSidebarFullscreen = false;
  isSidebarFullWidth = false;
  sidebarFullscreenRoutes = ['/themes'];
  sidebarFullWidthRoutes = ['/media', '/background-gallery'];

  @Select(UserState) user$: Observable<UserStateModel>;
  @Select(AppState.getShowOverlay) showOverlay$;
  @Select(AppState.getInputFocus) inputFocus$: Observable<boolean>;
  @Select(UserState.isLoggedIn) isLoggedIn$;
  @Select(AppState.isSetup) isSetup$: Observable<boolean>;

  private loginSub: Subscription;
  private logoutSub: Subscription;
  private currentRouteUrl: string;
  private previousRouteUrl: string;

  constructor(
    private router: Router,
    private store: Store,
    private _ngZone: NgZone,
    private stateService: AppStateService,
    private actions$: Actions
  ) {}

  ngOnInit() {
    this.currentRouteUrl = this.router.url;
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event: NavigationEnd) => event.url.split('?')[0]),
        tap((url) => {
          this.previousRouteUrl = this.currentRouteUrl;
          this.currentRouteUrl = url;
          this.isSidebarFullscreen =
            this.sidebarFullscreenRoutes.indexOf(url) > -1;
          this.isSidebarFullWidth = this.sidebarFullWidthRoutes.some(
            (route) => url.indexOf(route) === 0
          );
          return (this.routeIsRoot = url === '/');
        }),
        mergeMap((url) =>
          this.store
            .select((state) => state.app)
            .pipe(
              map((state) => [url, state]),
              take(1)
            )
        ),
        filter(([, state]) => {
          return this.routeIsRoot === state.showOverlay;
        })
      )
      .subscribe(([url]) => {
        if (url !== '/') {
          this.showOverlay();
        } else {
          this.store.dispatch(new AppHideOverlay());
        }
      });

    // After login, navigate to users last location or the root
    this.loginSub = this.actions$
      .pipe(
        ofActionSuccessful(UserLoginAction),
        switchMap(() => this.store.select((state) => state.user).pipe(take(1)))
      )
      .subscribe((user: UserStateModel) => {
        if (user.nextUrl) {
          this.router.navigateByUrl(user.nextUrl);
          this.store.dispatch(new SetUserNextUrlAction(''));
        } else {
          this.router.navigate(['/']);
        }
      });

    // After logout navigate to login url
    this.logoutSub = this.actions$
      .pipe(ofActionSuccessful(UserLogoutAction))
      .subscribe(() => {
        this.router.navigate(['/login']);
      });

    this.isLoggedIn$.subscribe((isLoggedIn) => {
      let url = location.protocol + '//' + location.hostname;

      if (isLoggedIn) {
        url += '/engine/editor/';
      }
    });

    // Navigate to root if setup mode
    this.isSetup$.pipe(filter((isSetup) => isSetup)).subscribe(() => {
      this.router.navigate(['/'], { queryParamsHandling: 'preserve' });
    });

    this.user$.subscribe((user) => {
      if (user.helpcrunch) {
        window['helpcrunchSettings'] = {
          organization: user.helpcrunch.organization,
          appId: user.helpcrunch.appId,
          user: {
            user_id: user.helpcrunch.user_id,
            security_hash: user.helpcrunch.security_hash,
            email: user.helpcrunch.email,
            custom_data: {
              app: 'berta',
              user_id: user.helpcrunch.user_id,
            },
          },
        };

        if (window['HelpCrunch'] === undefined) {
          let helpcrunchScript = document.createElement('script');
          helpcrunchScript.type = 'text/javascript';
          helpcrunchScript.src = '/engine/js/helpcrunch.js';
          document.body.appendChild(helpcrunchScript);
        }
      }
    });

    if (isDevMode()) {
      /* add debugging helpers on `window.bt` while in dev mode */
      this.setDevUpHelper();
    }
  }

  hideOverlay() {
    this.inputFocus$
      .pipe(
        take(1),
        filter((isInputFocused) => !isInputFocused)
      )
      .subscribe(() => {
        this.store.dispatch(new AppHideOverlay());
        this.router.navigate(['/'], { queryParamsHandling: 'preserve' });
      });
  }

  closeSidebar(event) {
    event.preventDefault();
    const routeUrl = this.previousRouteUrl || '/';
    this.router.navigate([routeUrl], { queryParamsHandling: 'preserve' });
  }

  showOverlay() {
    this.store.dispatch(new AppShowOverlay());
  }

  ngOnDestroy() {
    this.loginSub.unsubscribe();
    this.logoutSub.unsubscribe();
  }

  setDevUpHelper() {
    window['bt'] = {
      sync: (url, data, method) => {
        return Observable.create((observer) => {
          this._ngZone.run(() => {
            this.stateService.sync(url, data, method).subscribe((res) => {
              observer.next(res);
              observer.complete();
            });
          });
        });
      },
    };
  }
}
