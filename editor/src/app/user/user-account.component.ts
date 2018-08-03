import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take } from '../../../node_modules/rxjs/operators';
import { Store } from '@ngxs/store';

@Component({
  selector: 'berta-user-account',
  template: `
    <h2>Change password</h2>
    <form action="" (submit)="changePassword($event, old_password.value, new_password.value, retype_password.value)">
      <label for="old_password">Old password
        <input type="password" name="old_password" #old_password>
      </label>
      <label for="new_password">New password
        <input type="password" name="new_password" #new_password>
      </label>
      <label for="retype_password">Retype new password
        <input type="password" name="retype_password" #retype_password>
      </label>
      <button type="submit">Change password</button>

      <div *ngIf="message">
        {{ message }}
      </div>
      <div *ngIf="error">
        {{ error }}
      </div>
    </form>

    <hr />
    Password must be at least 6 characters long<br>
    and containing alphanumeric (A-Z, a-z, 0-9) characters.
  `,
  styles: [`
    label {
      display: block;
    }
    input {
      display: block;
      margin-bottom: 1rem;
    }
    button {
      margin-bottom: 1rem;
    }
  `]
})
export class UserAccountComponent implements OnInit {

  error: string;
  message: string;

  constructor(
    private http: HttpClient,
    private store: Store) {
  }

  ngOnInit() {
    this.error = '';
    this.message = '';
  }

  changePassword(event, old_password, new_password, retype_password) {
    event.preventDefault();
    this.error = '';
    this.message = '';

    this.store.select(state => state.app).pipe(take(1)).subscribe((appState) => {
      this.http.patch('/_api/v1/user/changepassword', {
        old_password: old_password,
        new_password: new_password,
        retype_password: retype_password,
      },
        {
          headers: { 'X-Authorization': 'Bearer ' + appState.user.token }
        }).subscribe({
          next: (response: any) => {
            event.target.reset();
            this.message = response.message;
          },
          error: (error) => {
            this.error = error.error.message;
          }
        });
    });
  }
}
