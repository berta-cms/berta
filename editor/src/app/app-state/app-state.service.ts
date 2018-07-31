import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, shareReplay, catchError, exhaustMap, filter, take, retryWhen, switchMap, pairwise} from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { UserLogin, UserLogout } from '../user/user-actions';
import { Router } from '@angular/router';


interface APIResponse {
  message: string;
  data: {
    [k: string]: any
  };
}

const CACHE_SIZE = 1;
const MAX_REQUEST_RETRIES = 100;

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  cachedSiteStates: {[k: string]: Observable<{[k: string]: any}>} = {};

  constructor(
    private http: HttpClient,
    private store: Store,
    private router: Router) {
  }

  getInitialState(site: string = '', stateSlice?: string , force = false) {

    if (!this.cachedSiteStates[site] || force) {
      this.cachedSiteStates[site] = this.store.select(state => state.app).pipe(
        filter(appState => !!appState.user.token && appState.site !== null),  // Make sure user is logged in
        take(1),
        // `exhaustMap` waits for the first request to complete instead of canceling and starting new ones.
        exhaustMap(appState => {
          const _site = site || appState.site;
          return this.http.get('/_api/v1/state' + (_site ? '/' + _site : _site), {
            headers: { 'X-Authorization': 'Bearer ' + appState.user.token }
          });
        }),
        retryWhen(attempts => {
          return attempts.pipe(
            map((error, i) => {
              /* Only retry on authorization failure */
              if (!(error instanceof HttpErrorResponse) || error.status !== 401 || i > MAX_REQUEST_RETRIES) {
                /* set app error state here maybe don't even throw it */
                throw error;
              }
              this.logout();
              return error;
            }),
            exhaustMap(() => {
              return this.store.select(state => state.app).pipe(
                pairwise(),
                filter(([prevAppState, appState]) => !!appState.user.token && prevAppState.user.token !== appState.user.token),
                take(1));
            })
          );
        }),
        shareReplay(CACHE_SIZE),
        catchError(error => {
          delete this.cachedSiteStates[site];
          throw error;
        })
      );
    }

    if (stateSlice) {
      return this.cachedSiteStates[site].pipe(map(stateCache => stateCache[stateSlice]));
    }

    return this.cachedSiteStates[site];
  }

  login(user: string, password: string) {
    window.localStorage.removeItem('token');

    return this.http.post('/_api/v1/login', {
      'auth_user': user,
      'auth_pass': password
    }).pipe(
      tap((resp: APIResponse) => {
        if (!resp.data.token) {
          throw new Error('Invalid login response!');
        }
        this.store.dispatch(new UserLogin(
          resp.data.name,
          resp.data.token,
          resp.data.features,
          resp.data.profileUrl
        ));

        window.localStorage.setItem('name', resp.data.name);
        window.localStorage.setItem('token', resp.data.token);
        window.localStorage.setItem('features', JSON.stringify(resp.data.features));
        window.localStorage.setItem('profileUrl', resp.data.profileUrl);
      })
    );
  }

  logout() {
    this.http.put('/_api/v1/logout', {}).subscribe({
      next: () => {},
      error: (error) => console.error(error)
    });
    this.store.dispatch(new UserLogout());

    window.localStorage.removeItem('name');
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('features');
    window.localStorage.removeItem('profileUrl');

    this.router.navigate(['/login']);
  }
}
