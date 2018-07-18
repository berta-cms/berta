import { Component } from '@angular/core';
import { AppStateService } from '../app-state/app-state.service';
import { Router } from '@angular/router';

/** @todo add icons */
@Component({
  selector: 'berta-profile-dropdown',
  template: `
    <button type="button" class="bt-profile-anchor">user@email.com</button>
    <ul>
      <li><a href="https://hosting.berta.me/log-in" target="_blank">My Profile</a></li>
      <li><button type="button" (click)="logOut()">Log Out</button></li>
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
export class ProfileDropdownComponent {
  constructor(
    private appStateService: AppStateService,
    private router: Router) {
  }

  logOut() {
    this.appStateService.logout();
    this.router.navigate(['/login']);
  }
}
