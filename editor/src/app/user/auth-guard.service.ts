import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Store } from '@ngxs/store';
import { UserState } from './user.state';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SetUserNextUrlAction } from './user.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  private readonly isLoggedIn$: Observable<boolean>;

  constructor(
    private store: Store,
    private router: Router,
  ) {
    this.isLoggedIn$ = this.store.select(UserState.isLoggedIn);
  }

  canActivate(route: ActivatedRouteSnapshot) {
    return this.isLoggedIn$.pipe(
      tap((isLoggedIn) => {
        if (!isLoggedIn) {
          const queryParams = route.queryParams
            ? '?' +
              Object.keys(route.queryParams)
                .map((param) => `${param}=${route.queryParams[param]}`)
                .join('&')
            : '';

          this.store.dispatch(
            new SetUserNextUrlAction('/' + route.url.toString() + queryParams),
          );
          this.router.navigate(['/login']);
        }
      }),
    );
  }
}
