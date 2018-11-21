import { Component, OnInit, OnDestroy, NgZone, isDevMode } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Subscription, Observable } from 'rxjs';
import { take, switchMap, mergeMap, filter, map, tap } from 'rxjs/operators';
import { Store, Select, Actions, ofActionSuccessful } from '@ngxs/store';

import { AppHideOverlay, AppShowOverlay } from './app-state/app.actions';
import { AppState } from './app-state/app.state';
import { UserLoginAction, UserLogoutAction, SetUserNextUrlAction } from './user/user.actions';
import { UserState } from './user/user.state';
import { UserStateModel } from './user/user.state.model';
import { AppStateService } from './app-state/app-state.service';


@Component({
  selector: 'berta-root',
  template: `
    <!--The content below is only a placeholder and can be replaced.-->
    <berta-header></berta-header>
    <main>
      <aside [style.display]="(routeIsRoot ? 'none' : '')"><!-- the sidebar -->
        <div class="scroll-wrap"><router-outlet></router-outlet></div></aside>
      <section>
        <berta-preview></berta-preview>
      </section>
    </main>
    <div [style.display]="((showOverlay$ | async) ? '' : 'none')" class="overlay" (click)="hideOverlay()"></div>
    <berta-popup></berta-popup>
  `,
  styles: [`
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

    section {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }

    iframe {
      flex-grow: 1;
      width:100%;
      height:100%;
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
    `
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'berta';
  routeIsRoot = true;

  @Select(AppState.getShowOverlay) showOverlay$;
  @Select(AppState.getInputFocus) inputFocus$: Observable<boolean>;
  @Select(UserState.isLoggedIn) isLoggedIn$;
  @Select(AppState.isSetup) isSetup$: Observable<boolean>;

  private loginSub: Subscription;
  private logoutSub: Subscription;

  constructor(private router: Router,
              private store: Store,
              private _ngZone: NgZone,
              private stateService: AppStateService,
              private actions$: Actions) {
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url.split('?')[0]),
      tap(url => {
        return this.routeIsRoot = url === '/';
      }),
      mergeMap((url) => this.store.select(AppState).pipe(map((state => [url, state])), take(1))),
      filter(([, state]) => {
        return this.routeIsRoot === state.showOverlay;
      }),
    )
    .subscribe(([url]) => {
      if (url !== '/') {
        this.showOverlay();
      } else {
        this.store.dispatch(AppHideOverlay);
      }
    });

    // After login, navigate to users last location or the root
    this.loginSub = this.actions$.pipe(
      ofActionSuccessful(UserLoginAction),
      switchMap(() => this.store.select(UserState).pipe(take(1))),
    ).subscribe((user: UserStateModel) => {

      if (user.nextUrl) {
        this.router.navigateByUrl(user.nextUrl);
        this.store.dispatch(new SetUserNextUrlAction(''));
      } else {
        this.router.navigate(['/']);
      }
    });

    // After logout navigate to login url
    this.logoutSub = this.actions$.pipe(
      ofActionSuccessful(UserLogoutAction),
    ).subscribe(() => {
      this.router.navigate(['/login']);
    });

    this.isLoggedIn$.subscribe(isLoggedIn => {
      let url = location.protocol + '//' + location.hostname;

      if (isLoggedIn) {
        url += '/engine/editor/';
      }
    });

    // Navigate to root if setup mode
    this.isSetup$.pipe(
      filter(isSetup => isSetup)
    ).subscribe(() => {
      this.router.navigate(['/'], { queryParamsHandling: 'preserve' });
    });

    if (isDevMode()) {
      /* add debugging helpers on `window.bt` while in dev mode */
      this.setDevUpHelper();
    }
  }

  hideOverlay() {
    this.inputFocus$.pipe(
      take(1),
      filter(isInputFocused => !isInputFocused)
    ).subscribe(() => {
      this.store.dispatch(AppHideOverlay);
      this.router.navigate(['/'], { queryParamsHandling: 'preserve' });
    });
  }

  showOverlay() {
    this.store.dispatch(AppShowOverlay);
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
      }
    };
  }
}
