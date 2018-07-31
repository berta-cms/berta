import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { Select } from '@ngxs/store';

import { UserState } from '../user/user-state';

@Component({
  selector: 'berta-header',
  template: `
    <header>
      <div class="bt-menu" *ngIf="isLoggedIn$ | async">
        <nav>
          <a [routerLink]="['/multisite']" [routerLinkActive]="'nav-active'" queryParams="">Multisite</a>
          <a [routerLink]="['/sections']" [routerLinkActive]="'nav-active'" queryParams="">Sections</a>
          <a [routerLink]="['/settings']" [routerLinkActive]="'nav-active'" queryParams="">Settings</a>
          <a [routerLink]="['/design']" [routerLinkActive]="'nav-active'" queryParams="">Design</a>
          <a [routerLink]="['/shop']" [routerLinkActive]="'nav-active'" queryParams="">Shop</a>
          <a href="http://support.berta.me/kb" target="_blank">Knowledge base</a>
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
export class HeaderComponent {
  @Select(UserState.isLoggedIn) isLoggedIn$: Observable<boolean>;
}
