import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, shareReplay, catchError, exhaustMap, filter, take, retryWhen, pairwise, switchMap} from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { UserLogin, UserLogoutAction } from '../user/user-actions';
import { Router } from '@angular/router';
import { AppShowLoading, AppHideLoading } from './app.actions';


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

  showLoading() {
    this.store.dispatch(new AppShowLoading());
  }

  hideLoading() {
    this.store.dispatch(new AppHideLoading());
  }

  sync(urlName: string, data: any, method?: string) {
    method = method || 'PATCH';
    return this.store.select(state => state.app)
      .pipe(
        filter(appState => !!appState.user.token && appState.urls[urlName]),
        take(1),
        switchMap(state => {
          this.showLoading();
          return this.http.request<any>(method, state.urls[urlName], {
            body: method === 'GET' ? undefined : data,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Authorization': 'Bearer ' + state.user.token
            }
          });
        }),
        retryWhen(attempts => {
          return attempts.pipe(
            map((error, i) => {
              this.hideLoading();
              /* Only retry on authorization failure */
              if (!(error instanceof HttpErrorResponse) || error.status !== 401 || i > MAX_REQUEST_RETRIES) {
                /* set app error state here maybe don't even throw it */
                throw error;
              }
              this.store.dispatch(new UserLogoutAction(true));
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
        catchError(error => {
            this.hideLoading();
            throw error;
        })
      );
  }

  getInitialState(site: string = '', stateSlice?: string, force = false) {

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
              this.hideLoading();
              /* Only retry on authorization failure */
              if (!(error instanceof HttpErrorResponse) || error.status !== 401 || i > MAX_REQUEST_RETRIES) {
                /* set app error state here maybe don't even throw it */
                throw error;
              }
              this.store.dispatch(new UserLogoutAction(true));
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
          if ((error instanceof HttpErrorResponse) && error.status === 401) {
            // Lot out if user is unauthorized
            this.store.dispatch(new UserLogoutAction(true));
          }
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
        window.localStorage.setItem('profileUrl', JSON.stringify(resp.data.profileUrl));
      })
    );
  }

  logout() {
    window.localStorage.removeItem('name');
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('features');
    window.localStorage.removeItem('profileUrl');

    this.cachedSiteStates = {};

    return this.http.put('/_api/v1/logout', {});
  }
}
