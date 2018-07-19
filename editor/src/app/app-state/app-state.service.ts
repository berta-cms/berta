import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'node_modules/rxjs';
import { map, tap, shareReplay, catchError, exhaustMap, filter, take} from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { AppLogin } from './app.actions';


interface APIResponse {
  message: string;
  data: {
    [k: string]: any
  };
}

const CACHE_SIZE = 1;

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  cachedSiteStates: {[k: string]: Observable<{[k: string]: any}>} = {};

  constructor(
    private http: HttpClient,
    private store: Store) {
  }

  getInitialState(site: string = '', stateSlice?: 'settings'|'site_sections'|'sites', force = false) {

    if (!this.cachedSiteStates[site] || force) {
      this.cachedSiteStates[site] = this.store.select(state => state.app).pipe(
        filter(appState => !!appState.authToken),  // Make sure user is logged in
        take(1),
        // `exhaustMap` waits for the first request to complete instead of canceling and starting new ones.
        exhaustMap(appState => {
          return this.http.get('/_api/v1/state' + (site ? '/' + site : site), {
            headers: { 'X-Authorization': 'Bearer ' + appState.authToken }
          });
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
        this.store.dispatch(new AppLogin(resp.data.token));
        window.localStorage.setItem('token', resp.data.token);
      })
    );
  }

  logout() {
    this.http.put('/_api/v1/logout', {}).subscribe({
      next: () => {},
      error: (error) => console.error(error)
    });
    this.store.dispatch(new AppLogin(null));
    window.localStorage.removeItem('token');
  }
}
