import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, combineLatest } from 'rxjs';
import {
  map,
  tap,
  shareReplay,
  catchError,
  exhaustMap,
  filter,
  take,
  retryWhen,
  pairwise,
  switchMap,
} from 'rxjs/operators';

import { Store } from '@ngxs/store';

import { removeXMLInvalidChars } from '../shared/helpers';
import { UserLogoutAction } from '../user/user.actions';
import { AppShowLoading, AppHideLoading } from './app.actions';
import { PushErrorAction } from '../error-state/error.actions';

interface APIResponse {
  message: string;
  data: {
    [k: string]: any;
  };
}

const CACHE_SIZE = 1;
const MAX_REQUEST_RETRIES = 100;

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  cachedSiteStates: { [k: string]: Observable<{ [k: string]: any }> } = {};
  cachedLocaleSettings: { [k: string]: Observable<{ [k: string]: any }> } = {};

  constructor(private http: HttpClient, private store: Store) {}

  showLoading() {
    this.store.dispatch(new AppShowLoading());
  }

  hideLoading() {
    this.store.dispatch(new AppHideLoading());
  }

  sync(urlName: string, data: any, method?: string) {
    method = method || 'PATCH';
    return combineLatest(
      this.store.select((state) => state.app),
      this.store.select((state) => state.user)
    ).pipe(
      filter(
        ([appState, user]) =>
          !!user.token && (appState.urls[urlName] || urlName)
      ),
      take(1),
      switchMap(([appState, user]) => {
        this.showLoading();

        // Remove XML 1.0 invalid characters from user input
        if (['POST', 'PUT', 'PATCH'].indexOf(method) > -1) {
          data = JSON.stringify(data);
          data = removeXMLInvalidChars(data);
          data = JSON.parse(data);
        }

        return this.http.request<any>(
          method,
          appState.urls[urlName] || urlName,
          {
            body: method === 'GET' ? undefined : data,
            params: method === 'GET' ? data : undefined,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'X-Authorization': 'Bearer ' + user.token,
            },
          }
        );
      }),
      retryWhen((attempts) => {
        return attempts.pipe(
          map((error, i) => {
            this.hideLoading();
            /* Only retry on authorization failure */
            if (
              !(error instanceof HttpErrorResponse) ||
              error.status !== 401 ||
              i > MAX_REQUEST_RETRIES
            ) {
              /* set app error state here maybe don't even throw it */
              throw error;
            }
            this.showError(error, {});
            this.store.dispatch(new UserLogoutAction(true));
            return error;
          }),
          exhaustMap(() => {
            return this.store
              .select((state) => state.user)
              .pipe(
                pairwise(),
                filter(
                  ([prevUser, user]) =>
                    !!user.token && prevUser.token !== user.token
                ),
                take(1)
              );
          })
        );
      }),
      tap(() => this.hideLoading()),
      catchError((error) => {
        this.showError(error, data);
        this.hideLoading();
        throw error;
      })
    );
  }

  getAppMetadata() {
    return this.http.get('/_api/v1/meta').pipe(
      map((resp: APIResponse) => {
        return resp.data;
      })
    );
  }

  getInitialState(site: string = '', stateSlice?: string, force = false) {
    if (!this.cachedSiteStates[site] || force) {
      this.cachedSiteStates[site] = combineLatest(
        this.store.select((state) => state.app),
        this.store.select((state) => state.user)
      ).pipe(
        filter(([appState, user]) => !!user.token && appState.site !== null), // Make sure user is logged in
        take(1),
        tap(() => this.showLoading()),
        // `exhaustMap` waits for the first request to complete instead of canceling and starting new ones.
        exhaustMap(([appState, user]) => {
          const _site = site || appState.site;
          return this.http.get(
            '/_api/v1/state' + (_site ? '/' + _site : _site),
            {
              headers: { 'X-Authorization': 'Bearer ' + user.token },
            }
          );
        }),
        retryWhen((attempts) => {
          return attempts.pipe(
            map((error, i) => {
              this.hideLoading();

              /* Only retry on authorization failure */
              if (
                !(error instanceof HttpErrorResponse) ||
                error.status !== 401 ||
                i > MAX_REQUEST_RETRIES
              ) {
                /* set app error state here maybe don't even throw it */
                throw error;
              }
              this.store.dispatch(new UserLogoutAction(true));
              return error;
            }),
            exhaustMap(() => {
              return this.store
                .select((state) => state.user)
                .pipe(
                  pairwise(),
                  filter(
                    ([prevUser, user]) =>
                      !!user.token && prevUser.token !== user.token
                  ),
                  take(1)
                );
            })
          );
        }),
        tap(() => this.hideLoading()),
        shareReplay(CACHE_SIZE),
        catchError((error) => {
          this.hideLoading();
          this.showError(error, {});
          if (error instanceof HttpErrorResponse && error.status === 401) {
            // Lot out if user is unauthorized
            this.store.dispatch(new UserLogoutAction(true));
          }
          delete this.cachedSiteStates[site];
          throw error;
        })
      );
    }

    if (stateSlice) {
      return this.cachedSiteStates[site].pipe(
        map((stateCache) => stateCache[stateSlice])
      );
    }

    return this.cachedSiteStates[site];
  }

  getLocaleSettings(
    language: string = 'en',
    stateSlice?: string,
    force = false
  ) {
    if (!this.cachedLocaleSettings[language] || force) {
      this.cachedLocaleSettings[language] = this.sync(
        'localeSettings',
        { language: language },
        'GET'
      ).pipe(shareReplay(CACHE_SIZE));
    }

    if (stateSlice) {
      return this.cachedLocaleSettings[language].pipe(
        map((stateCache) => stateCache[stateSlice])
      );
    }

    return this.cachedLocaleSettings[language];
  }

  login(data) {
    window.localStorage.removeItem('token');

    return this.http
      .post('/_api/v1/login', {
        auth_user: data.username,
        auth_pass: data.password,
        auth_key: data.token,
      })
      .pipe(
        tap((resp: APIResponse) => {
          if (!resp.data.token) {
            throw new Error('Invalid login response!');
          }

          window.localStorage.setItem('name', resp.data.name);
          window.localStorage.setItem('token', resp.data.token);
          window.localStorage.setItem(
            'features',
            JSON.stringify(resp.data.features)
          );
          window.localStorage.setItem(
            'profileUrl',
            JSON.stringify(resp.data.profileUrl)
          );
          window.localStorage.setItem(
            'intercom',
            JSON.stringify(resp.data.intercom)
          );
          window.localStorage.setItem(
            'helpcrunch',
            JSON.stringify(resp.data.helpcrunch)
          );
        })
      );
  }

  logout() {
    window.localStorage.removeItem('name');
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('features');
    window.localStorage.removeItem('profileUrl');
    window.localStorage.removeItem('intercom');
    window.localStorage.removeItem('helpcrunch');

    this.cachedSiteStates = {};

    return this.http.put('/_api/v1/logout', {});
  }

  private showError(error: any, data: any) {
    let message = 'Oops unexpected error!';

    if (error) {
      if (error.error && error.error.message) {
        message = error.error.message;
      } else if (error.message) {
        message = error.message;
      }

      if (error.status && error.status === 401) {
        message = 'Please log in!';
      }
    }

    this.hideLoading();
    this.store.dispatch(
      new PushErrorAction({
        message: message,
        httpStatus: error.status ? error.status : undefined,
        field: data.path ? data.path : '',
      })
    );
  }
}
