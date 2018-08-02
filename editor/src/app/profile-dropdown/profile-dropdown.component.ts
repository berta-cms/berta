import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppStateService } from '../app-state/app-state.service';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { UserState } from '../user/user-state';
import { UserStateModel } from '../user/user.state.model';

/** @todo add icons */
@Component({
  selector: 'berta-profile-dropdown',
  template: `
    <button type="button" class="bt-profile-anchor">{{ user.name }}</button>
    <ul>
      <li *ngIf="!user.profileUrl">
        <a [routerLink]="['/account']" [routerLinkActive]="'nav-active'" [queryParams]="queryParams$ | async">Account</a>
      </li>
      <li *ngIf="user.profileUrl">
        <a href="{{ user.profileUrl }}" target="_blank">Account</a>
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

  user: Observable<UserStateModel>;

  constructor(
    private appStateService: AppStateService,
    private router: Router,
    private store: Store) {
  }

  ngOnInit() {

    this.store.select(UserState).subscribe((userState) => {
      this.user = userState;
    });
  }

  logOut() {
    this.appStateService.logout();
  }
}
