import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';

import { UserState } from '../user/user.state';
import { AppShowLoading, AppHideLoading, UpdateInputFocus } from '../app-state/app.actions';
import { UserLoginAction } from '../user/user.actions';


@Component({
  selector: 'berta-login',
  template: `
  <div *ngIf="!(isLoggedIn$ | async)" class="login-container setting-group">
    <h3><img src="/engine/layout/berta.png"></h3>
    <div *ngIf="message" class="error-message">{{ message }}</div>
    <form action="" (submit)="login($event)">
      <berta-text-input [label]="'Username'"
                        [value]="username"
                        [enabledOnUpdate]="true"
                        (inputFocus)="updateComponentFocus($event)"
                        (update)="updateField('username', $event)"></berta-text-input>
      <berta-text-input [label]="'Password'"
                        [value]="password"
                        [type]="'password'"
                        [enabledOnUpdate]="true"
                        (inputFocus)="updateComponentFocus($event)"
                        (update)="updateField('password', $event)"></berta-text-input>
      <div class="form-group">
        <button type="submit" class="button">Log in</button>
      </div>
    </form>
    <div class="footer">
      berta 2008 - {{ currentYear }}
    </div>
  </div>
  `
})
export class LoginComponent implements OnInit {
  message = '';
  username = '';
  password = '';
  currentYear = (new Date()).getFullYear();

  @Select(UserState.isLoggedIn) isLoggedIn$: Observable<boolean>;

  constructor(
    private store: Store,
    private router: Router) {
  }

  ngOnInit() {
    this.isLoggedIn$.pipe(take(1)).subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.router.navigate(['/']);
      }
    });
  }

  updateField(field, value) {
    this[field] = value;
  }

  updateComponentFocus(isFocused) {
    this.store.dispatch(new UpdateInputFocus(isFocused));
  }

  login(event) {
    event.preventDefault();
    this.store.dispatch(new AppShowLoading());

    this.store.dispatch(new UserLoginAction(this.username, this.password))
    .subscribe({
      next: () => {
        this.message = 'Login Successful';
        this.store.dispatch(new AppHideLoading());
      },
      error: (error: HttpErrorResponse|Error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.message = 'Incorrect Username or password!';
        } else {
          this.message = error.message;
        }
        this.store.dispatch(new AppHideLoading());
      }
    });
  }
}
