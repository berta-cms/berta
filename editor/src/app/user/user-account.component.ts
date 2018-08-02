import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'berta-user-account',
  template: `
    <h2>Change password</h2>
    <form method="patch" action="#">
      <label for="old_password">Old password
        <input type="password" name="old_password" id="old_password">
      </label>
      <label for="new_password">New password
        <input type="password" name="new_password" id="new_password">
      </label>
      <label for="retype_password">Retype new password
        <input type="password" name="retype_password" id="retype_password">
      </label>
      <input type="submit" value="Change password">
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
  `]
})
export class UserAccountComponent implements OnInit {

  ngOnInit() {

  }
}
