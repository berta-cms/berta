import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'node_modules/rxjs';
import { map, tap, take, catchError} from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { AppLogin } from './app.actions';


interface APIResponse {
  message: string;
  data: {
    [k: string]: any
  };
}


@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  initialAppState$: BehaviorSubject<any>;

  constructor(
    private http: HttpClient,
    private store: Store,
  ) {
    this.initialAppState$ = new BehaviorSubject(null);
  }

  getInitialState(stateSlice: 'settings'|'site_sections' = 'site_sections') {
    return this.http.get('/_api/v1/state/0', {headers : {
      'X-Authorization': 'Bearer' + [
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9',
        'eyJpYXQiOjE1MzE4MjY0MjQsImV4cCI6MTUzMTkxMjgyNH0',
        'uv4yPkkVvW5c7xFpWBO7CfJH9Bv02gu8GPt4eZO3j3U'].join('.')
    }}).pipe(
      map(json => {
        return json['site_sections'];
      })
    );
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
