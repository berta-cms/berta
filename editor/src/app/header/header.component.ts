import { Component } from '@angular/core';

@Component({
  selector: 'berta-header',
  template: `
    <header>
      <nav>
        <a [routerLink]="['/sections']" queryParams="">Sections</a>
        <a [routerLink]="['/design']" queryParams="">Design</a>
        <a [routerLink]="['/settings']" queryParams="">Settings</a>
        <a [routerLink]="['/multisite']" queryParams="">Multisite</a>
        <a [routerLink]="['/shop']" queryParams="">Shop</a>
        <a [routerLink]="['/seo']" queryParams="">Seo</a>
        <a href="http://support.berta.me/kb" target="_blank">Knowledge base</a>
      </nav>
      <div class="user-profile">
        <button>user@amil.com</button>
        <ul>
          <li>Profile/Account</li>
          <li>Log Out</li>
        </ul>
      </div>
    </header>
  `,
  styles: [`

    header {
      display: flex;
      justify-content: space-between;
    }

    header > * {
      display: inline-block;
    }

    header nav a {
      display: inline-block;
      text-decoration: none;
    }
  `]
})
export class HeaderComponent {

  constructor() { }

}
