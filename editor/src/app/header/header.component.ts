import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Select, Store } from '@ngxs/store';

import { AppState } from '../app-state/app.state';
import { UserState } from '../user/user-state';
import { UserStateModel } from '../user/user.state.model';

@Component({
  selector: 'berta-header',
  template: `
    <header>
      <div class="bt-menu" *ngIf="isLoggedIn$ | async">
        <nav>
          <a *ngIf="user.features.indexOf('multisite') > -1"
             [routerLink]="['/multisite']"
             [routerLinkActive]="'nav-active'"
             [queryParams]="queryParams$ | async">Multisite</a>
          <a [routerLink]="['/sections']" [routerLinkActive]="'nav-active'" [queryParams]="queryParams$ | async">Sections</a>
          <a [routerLink]="['/settings']" [routerLinkActive]="'nav-active'" [queryParams]="queryParams$ | async">Settings</a>
          <a [routerLink]="['/design']" [routerLinkActive]="'nav-active'" [queryParams]="queryParams$ | async">Design</a>
          <a *ngIf="user.features.indexOf('shop') > -1"
             [routerLink]="['/shop']"
             [routerLinkActive]="'nav-active'"
             [queryParams]="queryParams$ | async">Shop</a>
             <a *ngIf="user.profileUrl"
                href="http://support.berta.me/kb"
                target="_blank">Knowledge base</a>
        </nav>
        <berta-profile-dropdown></berta-profile-dropdown>
      </div>
      <a *ngIf="!(isLoggedIn$ | async)" [routerLink]="['/login']">Log in</a>
      <button class="bt-view-editor" type="button">(o)</button>
    </header>
  `,
  styles: [`

    header {
      display: flex;
      justify-content: flex-end;
    }

    header .bt-menu {
      display: flex;
      justify-content: space-between;
      flex-grow: 1;
    }

    header nav a {
      display: inline-block;
      text-decoration: none;
    }
  `]
})
export class HeaderComponent implements OnInit {
  user: Observable<UserStateModel>;
  queryParams$: Observable<{[k: string]: string}>;

  @Select(UserState.isLoggedIn) isLoggedIn$: Observable<boolean>;
  @Select(AppState.getSite) site$: Observable<string|null>;

  constructor(
    private store: Store) {
  }

  ngOnInit() {
    this.store.select(UserState).subscribe((userState) => {
      this.user = userState;
    });

    this.queryParams$ = this.site$.pipe(
      map(site => site ? {site: site} : {})
    );
  }
}
