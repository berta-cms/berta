import { Component } from '@angular/core';

@Component({
  selector: 'berta-profile-dropdown',
  template: `
    <button>user@email.com</button>
    <ul>
      <li><a href="https://hosting.berta.me/log-in" target="_blank">Profile/Account</a></li>
      <li><button type="button">Log Out</button></li>
    </ul>
  `,
  styles: []
})
export class ProfileDropdownComponent {}
