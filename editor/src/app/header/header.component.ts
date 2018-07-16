import { Component } from '@angular/core';

@Component({
  selector: 'berta-header',
  template: `
    <header>
      <nav> <!-- @todo: add nav component here -->
        <a [routerLink]="['/sections']" queryParams="">sections</a>
        <a [routerLink]="['/design']" queryParams="">design</a>
        <a [routerLink]="['/settings']" queryParams="">settings</a>
        <a [routerLink]="['/multisite']" queryParams="">multisite</a>
        <a [routerLink]="['/shop']" queryParams="">shop</a>
        <a [routerLink]="['/seo']" queryParams="">seo</a>
        <a href="http://support.berta.me/kb" target="_blank">knowledge base</a>
      </nav>
      <!-- @todo: add user profile dropdown component here -->
      <div class="user-profile">
        <button>user@amil.com</button>
        <ul>
          <li>Profile/Account</li>
          <li>Log Out</li>
        </ul>
      </div>
    </header>`,
  styles: [`

    /* use flexbox here: */
    header > * {
      display: inline-block;
    }

    header nav a {
      display: inline-block;
    }
    .user-profile {
      float: right;
    }
  `]
})
export class HeaderComponent {

  constructor() { }

}
