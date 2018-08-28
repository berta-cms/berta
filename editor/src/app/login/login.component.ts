import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Select } from '@ngxs/store';

import { AppStateService } from '../app-state/app-state.service';
import { UserState } from '../user/user.state';


@Component({
  selector: 'berta-login',
  template: `
  <div *ngIf="!(isLoggedIn$ | async)">
    <h2>Enter your Login details</h2>
    <p class="error">{{error}}<p>
    <form action="" (submit)="login($event, user.value, pass.value)">
      <input #user type="text" name="user">
      <input #pass type="password" name="password">
      <button type="submit">Login</button>
    </form>
  </div>
  <div *ngIf="isLoggedIn$ | async">
    <h2>Login Successful!</h2>
  </div>
  `,
  styles: []
})
export class LoginComponent implements OnInit {
  message = 'Login';
  @Select(UserState.isLoggedIn) isLoggedIn$: Observable<boolean>;

  constructor(
    private appStateService: AppStateService,
    private router: Router) {
  }

  ngOnInit() {
    this.isLoggedIn$.pipe(take(1)).subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.router.navigate(['/']);
      }
    });
  }

  login(event, user, pass) {
    event.preventDefault();
    this.appStateService.login(user, pass)
    .subscribe({
      next: (response: any) => {
        if (!response) {
          return;
        }
        this.message = 'Login Successful';
      },
      error: (error: HttpErrorResponse|Error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.message = 'Incorrect Username or password!';
        } else {
          this.message = error.message;
        }
      }
    });
  }
}
