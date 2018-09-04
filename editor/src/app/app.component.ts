import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { take, switchMap, mergeMap, filter, map, tap } from 'rxjs/operators';

import { Store, Select, Actions, ofActionSuccessful } from '@ngxs/store';
import { AppHideOverlay, AppShowOverlay } from './app-state/app.actions';
import { AppState } from './app-state/app.state';
import { UserLoginAction, UserLogoutAction, SetUserNextUrlAction } from './user/user.actions';
import { UserState } from './user/user.state';
import { UserStateModel } from './user/user.state.model';

@Component({
  selector: 'berta-root',
  template: `
    <!--The content below is only a placeholder and can be replaced.-->
    <berta-header></berta-header>
    <main>
      <aside [style.display]="(routeIsRoot ? 'none' : '')"><!-- the sidebar -->
        <div class="scroll-wrap"><router-outlet></router-outlet></div></aside>
      <section>
        <div style="text-align:center">
          <h1>
            Welcome to {{title}}!
          </h1>
          <img width="300" src="http://www.berta.me/storage/media/logo.png">
        </div>
        <button (click)="showOverlay()">Show overlay</button>
      </section>
    </main>
    <div [style.display]="((showOverlay$ | async) ? '' : 'none')" class="overlay" (click)="hideOverlay()">
  `,
  styles: [`
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

  private loginSub: Subscription;
  private logoutSub: Subscription;

  constructor(
    private router: Router,
    private store: Store,
    private actions$: Actions
  ) {
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      tap((event: NavigationEnd) => this.routeIsRoot = event.url === '/'),
      mergeMap((event) => this.store.select(AppState).pipe(map((state => [event, state])), take(1))),
      filter(([, state]) => {
        return this.routeIsRoot === state.showOverlay;
      }),
    )
    .subscribe(([event]) => {
      if (event.url !== '/') {
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
  }

  hideOverlay() {
    this.store.dispatch(AppHideOverlay);
    this.router.navigate(['/']);
  }
  showOverlay() {
    this.store.dispatch(AppShowOverlay);
  }

  ngOnDestroy() {
    this.loginSub.unsubscribe();
    this.logoutSub.unsubscribe();
  }
}
