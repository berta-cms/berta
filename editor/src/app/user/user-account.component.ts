import { Component } from '@angular/core';
import { UserService } from './user.service';

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
      <div *ngIf="error" style="color: red">
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
export class UserAccountComponent {

  error = '';
  message = '';

  constructor(
    private userService: UserService) {
  }

  changePassword(event, oldPassword, newPassword, retypePassword) {
    event.preventDefault();
    this.error = '';
    this.message = '';

    if (newPassword !== retypePassword) {
      /** @todo: add correct error from server */
      this.message = "New passwords don't match";
      return;
    }

    this.userService.changePassword(oldPassword, newPassword).subscribe({
      next: (response: any) => {
        event.target.reset();
        this.message = response.message;
      },
      error: (error) => {
        this.error = error.error.message;
      }
    });
  }
}
