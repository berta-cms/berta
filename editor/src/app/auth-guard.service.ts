import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, Route } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { UserState } from './user/user.state';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SetUserNextUrlAction } from './user/user.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  @Select(UserState.isLoggedIn) isLoggedIn$: Observable<boolean>;

  constructor(private store: Store, private router: Router) {}

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
            new SetUserNextUrlAction('/' + route.url.toString() + queryParams)
          );
          this.router.navigate(['/login']);
        }
      })
    );
  }

  canLoad(route: Route) {
    return this.isLoggedIn$.pipe(
      tap((isLoggedIn) => {
        if (!isLoggedIn) {
          this.store.dispatch(new SetUserNextUrlAction('/' + route.path));
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
