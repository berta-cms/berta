import { Component } from '@angular/core';
import { Store } from '@ngxs/store';

import { UserService } from './user.service';
import { UpdateInputFocus } from '../app-state/app.actions';

@Component({
  selector: 'berta-user-account',
  template: `
    <div class="user-account-container setting-group">
      <h3>Change password</h3>
      <div *ngIf="error" class="form-group error-message">{{ error }}</div>
      <form action="" (submit)="changePassword($event)">
        <berta-text-input [label]="'Old password'"
                          [value]="oldPassword"
                          [type]="'password'"
                          [enabledOnUpdate]="true"
                          [hideIcon]="true"
                          (inputFocus)="updateComponentFocus($event)"
                          (update)="updateField('oldPassword', $event)"></berta-text-input>

        <berta-text-input [label]="'New password'"
                          [value]="newPassword"
                          [type]="'password'"
                          [enabledOnUpdate]="true"
                          [hideIcon]="true"
                          (inputFocus)="updateComponentFocus($event)"
                          (update)="updateField('newPassword', $event)"></berta-text-input>

        <berta-text-input [label]="'Retype new password'"
                          [value]="retypePassword"
                          [type]="'password'"
                          [enabledOnUpdate]="true"
                          [hideIcon]="true"
                          (inputFocus)="updateComponentFocus($event)"
                          (update)="updateField('retypePassword', $event)"></berta-text-input>

        <div class="form-group">
          <button type="submit" class="button">Change password</button>
        </div>

        <div *ngIf="message" class="form-group info-message">{{ message }}</div>

        <div class="form-group setting-description">
          Password must be at least 6 characters long and containing alphanumeric (A-Z, a-z, 0-9) characters.
        </div>
      </form>
    </div>
  `
})
export class UserAccountComponent {

  error = '';
  message = '';
  oldPassword = '';
  newPassword = '';
  retypePassword = '';

  constructor(
    private store: Store,
    private userService: UserService) {
  }

  updateField(field, value) {
    this[field] = value;
  }

  updateComponentFocus(isFocused) {
    this.store.dispatch(new UpdateInputFocus(isFocused));
  }

  changePassword(event) {
    event.preventDefault();
    this.error = '';
    this.message = '';

    if (this.newPassword !== this.retypePassword) {
      /** @todo: add correct error from server */
      this.error = "New passwords don't match";
      return;
    }

    this.userService.changePassword(this.oldPassword, this.newPassword).subscribe({
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
