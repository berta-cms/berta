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
        <a [routerLink]="['/account']" [routerLinkActive]="'nav-active'" [queryParams]="queryParams$ | async">Account</a>
      </li>
      <li *ngIf="(user$ | async).profileUrl">
        <a href="{{ (user$ | async).profileUrl }}" target="_blank">Account</a>
      </li>
      <li>
        <button type="button" (click)="logOut()">Log Out</button>
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
