import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { Select } from '@ngxs/store';

import { AppState } from '../app-state/app.state';
import { UserState } from '../user/user.state';
import { UserStateModel } from '../user/user.state.model';

@Component({
  selector: 'berta-header',
  template: `
    <header>
      <div
        class="loading"
        [style.display]="(isLoading$ | async) ? 'block' : ''"
      ></div>
      <div class="bt-menu" *ngIf="isLoggedIn$ | async">
        <nav *ngIf="!(isSetup$ | async)">
          <a
            *ngIf="(user$ | async).features.indexOf('multisite') > -1"
            [routerLink]="['/multisite']"
            [routerLinkActive]="'nav-active'"
            queryParamsHandling="preserve"
            >Multisite</a
          >
          <a
            [routerLink]="['/sections']"
            [routerLinkActive]="'nav-active'"
            queryParamsHandling="preserve"
            >Sections</a
          >
          <a
            [routerLink]="['/settings']"
            [routerLinkActive]="'nav-active'"
            queryParamsHandling="preserve"
            >Settings</a
          >
          <a
            [routerLink]="['/design']"
            [routerLinkActive]="'nav-active'"
            queryParamsHandling="preserve"
            >Design</a
          >
          <a
            [routerLink]="['/media/list']"
            [routerLinkActive]="'nav-active'"
            queryParamsHandling="preserve"
            >Media</a
          >
          <a
            *ngIf="(user$ | async).features.indexOf('shop') > -1"
            [routerLink]="['/shop']"
            [routerLinkActive]="'nav-active'"
            queryParamsHandling="preserve"
            >Shop</a
          >
          <a href="http://support.berta.me/kb" target="_blank"
            >Knowledge base</a
          >
        </nav>
        <berta-profile-dropdown></berta-profile-dropdown>
      </div>
      <a *ngIf="!(isLoggedIn$ | async)" [routerLink]="['/login']">Log in</a>
      <berta-preview-toggle></berta-preview-toggle>
    </header>
  `,
  styles: [
    `
      header {
        display: flex;
        justify-content: flex-end;
      }

      header .loading {
        display: none;
        content: '';
        position: absolute;
        width: 100%;
        height: 5px;
        top: 0;
        background-color: #777;
        background-image: repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 1rem,
          #555 1rem,
          #555 2rem
        );
        background-size: 200% 200%;
        animation: barberpole 15s linear infinite;
        z-index: 1;
      }

      @keyframes barberpole {
        0% {
          background-position: 100% 100%;
        }
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
    `,
  ],
})
export class HeaderComponent {
  @Select(UserState) user$: Observable<UserStateModel>;
  @Select(UserState.isLoggedIn) isLoggedIn$: Observable<boolean>;
  @Select(AppState.getShowLoading) isLoading$: Observable<boolean>;
  @Select(AppState.isSetup) isSetup$: Observable<boolean>;
}
