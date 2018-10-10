import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Select, Store } from '@ngxs/store';

import { AppState } from '../app-state/app.state';
import { UserState } from '../user/user.state';
import { UserStateModel } from '../user/user.state.model';
import { UserLogoutAction } from '../user/user.actions';


/** @todo add icons */
@Component({
  selector: 'berta-profile-dropdown',
  template: `
    <button type="button" class="bt-profile-anchor">{{ (user$ | async).name }}</button>
    <ul>
      <li *ngIf="!((user$ | async).profileUrl)">
        <a [routerLink]="['/account']" [routerLinkActive]="'nav-active'" [queryParams]="queryParams$ | async">
          Account
          <svg xmlns="http://www.w3.org/2000/svg" width="13.3" height="16" version="1.1" viewBox="0 0 13.3 16"><path d="m13.3 13.2q0 1.1-0.7 1.9t-1.6 0.8h-8.9q-0.9 0-1.6-0.8t-0.7-1.9q0-0.9 0.1-1.7 0.1-0.8 0.3-1.6 0.2-0.8 0.6-1.4t1-0.9q0.6-0.4 1.4-0.4 1.4 1.3 3.3 1.3 1.9 0 3.3-1.3 0.8 0 1.4 0.4 0.6 0.4 1 0.9t0.6 1.4q0.2 0.8 0.3 1.6 0.1 0.8 0.1 1.7zm-2.7-9.2q0 1.7-1.2 2.8-1.2 1.2-2.8 1.2t-2.8-1.2q-1.2-1.2-1.2-2.8 0-1.7 1.2-2.8 1.2-1.2 2.8-1.2t2.8 1.2q1.2 1.2 1.2 2.8z" stroke-width="0"/></svg>
        </a>
      </li>
      <li *ngIf="(user$ | async).profileUrl">
        <a href="{{ (user$ | async).profileUrl }}" target="_blank">
          Account
          <svg xmlns="http://www.w3.org/2000/svg" width="13.3" height="16" version="1.1" viewBox="0 0 13.3 16"><path d="m13.3 13.2q0 1.1-0.7 1.9t-1.6 0.8h-8.9q-0.9 0-1.6-0.8t-0.7-1.9q0-0.9 0.1-1.7 0.1-0.8 0.3-1.6 0.2-0.8 0.6-1.4t1-0.9q0.6-0.4 1.4-0.4 1.4 1.3 3.3 1.3 1.9 0 3.3-1.3 0.8 0 1.4 0.4 0.6 0.4 1 0.9t0.6 1.4q0.2 0.8 0.3 1.6 0.1 0.8 0.1 1.7zm-2.7-9.2q0 1.7-1.2 2.8-1.2 1.2-2.8 1.2t-2.8-1.2q-1.2-1.2-1.2-2.8 0-1.7 1.2-2.8 1.2-1.2 2.8-1.2t2.8 1.2q1.2 1.2 1.2 2.8z" stroke-width="0"/></svg>
        </a>
      </li>
      <li>
        <button type="button" (click)="logOut()">
          Log Out
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="12.2" version="1.1" viewBox="0 0 15 12.2"><path d="m6.1 11.3q0 0 0 0.2 0 0.2 0 0.3 0 0.1 0 0.2 0 0.1-0.1 0.2-0.1 0.1-0.2 0.1h-3.1q-1.1 0-1.9-0.8-0.8-0.8-0.8-1.9v-6.7q0-1.1 0.8-1.9 0.8-0.8 1.9-0.8h3.1q0.1 0 0.2 0.1 0.1 0.1 0.1 0.2 0 0 0 0.2 0 0.2 0 0.3 0 0.1 0 0.2 0 0.1-0.1 0.2-0.1 0.1-0.2 0.1h-3.1q-0.6 0-1.1 0.4-0.4 0.4-0.4 1.1v6.7q0 0.6 0.4 1.1 0.4 0.4 1.1 0.4h3l0.1 0 0.1 0 0.1 0.1 0.1 0.1zm8.9-5.2q0 0.2-0.2 0.4l-5.2 5.2q-0.2 0.2-0.4 0.2t-0.4-0.2q-0.2-0.2-0.2-0.4v-2.8h-4.3q-0.2 0-0.4-0.2-0.2-0.2-0.2-0.4v-3.7q0-0.2 0.2-0.4t0.4-0.2h4.3v-2.8q0-0.2 0.2-0.4t0.4-0.2 0.4 0.2l5.2 5.2q0.2 0.2 0.2 0.4z" stroke-width="0"/></svg>
        </button>
      </li>
    </ul>
  `,
  styles: [`
    :host {
      display: block;
      position: relative;
    }

    :host:hover > ul,
    button:focus + ul {
      display: block;
    }

    button {
      cursor: pointer;
    }

    ul {
      position: absolute;
      display: none;
      list-style: none;
      padding: 0;
      margin: 0;
      width: 100%;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
    }

    ul > li,
    ul > li > * {
      width: 100%;
    }
  `]
})
export class ProfileDropdownComponent implements OnInit {
  @Select(AppState.getSite) site$: Observable<string|null>;
  @Select(UserState) user$: Observable<UserStateModel>;

  queryParams$: Observable<{[k: string]: string}>;

  constructor(
    private store: Store) {
  }

  ngOnInit() {
    this.queryParams$ = this.site$.pipe(
      map(site => site ? {site: site} : {})
    );
  }

  logOut() {
    this.store.dispatch(UserLogoutAction);
  }
}
