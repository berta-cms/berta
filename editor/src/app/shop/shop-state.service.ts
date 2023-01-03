import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, combineLatest } from 'rxjs';
import { take, filter, tap, exhaustMap, retryWhen, map, pairwise, shareReplay, catchError } from 'rxjs/operators';

import { Store } from '@ngxs/store';
import { AppShowLoading, AppHideLoading } from '../app-state/app.actions';
import { UserLogoutAction } from '../user/user.actions';
import { PushErrorAction } from '../error-state/error.actions';


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
export class ShopStateService {

  cachedSectionStates: {[k: string]: Observable<{[k: string]: any}>} = {};


  constructor(
    private http: HttpClient,
    private store: Store) {
  }

  getInitialState(site: string = '', section?: string, force = false) {

    if (!this.cachedSectionStates[site] || force) {
      this.cachedSectionStates[site] = combineLatest(
        this.store.select(state => state.app),
        this.store.select(state => state.user)
      ).pipe(
        filter(([appState, user]) => false && !!user.token && appState.site !== null),  // Make sure user is logged in
        // uncomment this part in case you want shop feature back
        // filter(([appState, user]) => !!user.token && appState.site !== null),  // Make sure user is logged in
        take(1),
        tap(() => this.store.dispatch(new AppShowLoading())),
        // `exhaustMap` waits for the first request to complete instead of canceling and starting new ones.
        exhaustMap(([appState, user]) => {
          return this.http.get('/_api/v1/plugin/shop', {
            headers: { 'X-Authorization': 'Bearer ' + user.token },
            params: site ? {'site': site} : {}  // Use null instead of empty string so we can fetch home page
          });
        }),
        retryWhen(attempts => {
          return attempts.pipe(
            map((error, i) => {
              this.store.dispatch(new AppHideLoading());

              /* Only retry on authorization failure */
              if (!(error instanceof HttpErrorResponse) || error.status !== 401 || i > MAX_REQUEST_RETRIES) {
                /* set app error state here maybe don't even throw it */
                this.store.dispatch(new UserLogoutAction(true));
                throw error;
              }
              this.showError(error, {});
              return error;
            }),
            exhaustMap(() => {
              return this.store.select(state => state.user).pipe(
                pairwise(),
                filter(([prevUser, user]) => !!user.token && prevUser.token !== user.token),
                take(1));
            })
          );
        }),
        tap(() => this.store.dispatch(new AppHideLoading())),
        shareReplay(CACHE_SIZE),
        catchError(error => {
          this.store.dispatch(new AppHideLoading());

          if ((error instanceof HttpErrorResponse) && error.status === 401) {
            // Lot out if user is unauthorized
            this.store.dispatch(new UserLogoutAction(true));
          }
          delete this.cachedSectionStates[site];
          this.showError(error, {});
          throw error;
        }),
        map((resp: APIResponse) => {
          return resp.data;
        })
      );
    }

    if (section) {
      return this.cachedSectionStates[site].pipe(map(stateCache => stateCache[section]));
    }

    return this.cachedSectionStates[site];
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

    this.store.dispatch(new AppHideLoading());
    this.store.dispatch(new PushErrorAction({
      message: message,
      httpStatus: error.status ? error.status : undefined,
      field: data.path ? data.path : ''
    }));
  }
}
