import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AppState } from '../app-state/app.state';
import { UserState } from '../user/user.state';
import { UserStateModel } from '../user/user.state.model';
import { AiAssistantState } from '../ai-assistant/ai-assistant.state';
import { ToggleAiAssistantAction } from '../ai-assistant/ai-assistant.actions';

@Component({
  selector: 'berta-header',
  template: `
    <header>
      <div
        class="loading"
        [style.display]="(isLoading$ | async) ? 'block' : ''"
      ></div>
      @if (isLoggedIn$ | async) {
        <div class="bt-menu">
          @if (!(isSetup$ | async)) {
            <nav>
              @if ((user$ | async).features.includes('multisite')) {
                <a
                  [routerLink]="['/multisite']"
                  [routerLinkActive]="'nav-active'"
                  queryParamsHandling="preserve"
                  >Multisite</a
                >
              }
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
              @if ((user$ | async).features.includes('shop')) {
                <a
                  [routerLink]="['/shop']"
                  [routerLinkActive]="'nav-active'"
                  queryParamsHandling="preserve"
                  >Shop</a
                >
              }
              <a href="https://support.berta.me" target="_blank"
                >Knowledge base</a
              >
              @if ((user$ | async).features.includes('ai_assistant')) {
                <a
                  href="#"
                  (click)="toggleAiAssistant($event)"
                  [class.nav-active]="isAiOpen$ | async"
                  >AI <span class="badge-new">New</span></a
                >
              }
            </nav>
          }
          <berta-profile-dropdown></berta-profile-dropdown>
        </div>
      }
      @if (!(isLoggedIn$ | async)) {
        <a [routerLink]="['/login']">Log in</a>
      }
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

      header nav a .badge-new {
        display: inline-block;
        font-size: 9px;
        line-height: 1;
        padding: 2px 4px;
        border-radius: 3px;
        background: #0c4dff;
        color: #fff;
        vertical-align: middle;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        position: relative;
        top: -1px;
      }
    `,
  ],
  standalone: false,
})
export class HeaderComponent {
  user$: Observable<UserStateModel>;
  isLoggedIn$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  isSetup$: Observable<boolean>;
  isAiOpen$: Observable<boolean>;

  constructor(private store: Store) {
    this.user$ = this.store.select((state) => state.user);
    this.isLoggedIn$ = this.store.select(UserState.isLoggedIn);
    this.isLoading$ = this.store.select(AppState.getShowLoading);
    this.isSetup$ = this.store.select(AppState.isSetup);
    this.isAiOpen$ = this.store.select(AiAssistantState.isOpen);
  }

  toggleAiAssistant(event: Event) {
    event.preventDefault();
    this.store.dispatch(new ToggleAiAssistantAction());
  }
}
