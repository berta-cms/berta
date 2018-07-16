import { Component } from '@angular/core';

@Component({
  selector: 'berta-header',
  template: `
    <header>
      <nav>
        <a [routerLink]="['/sections']" [routerLinkActive]="'nav-active'" queryParams="">Sections</a>
        <a [routerLink]="['/design']" [routerLinkActive]="'nav-active'" queryParams="">Design</a>
        <a [routerLink]="['/settings']" [routerLinkActive]="'nav-active'" queryParams="">Settings</a>
        <a [routerLink]="['/multisite']" [routerLinkActive]="'nav-active'" queryParams="">Multisite</a>
        <a [routerLink]="['/shop']" [routerLinkActive]="'nav-active'" queryParams="">Shop</a>
        <a [routerLink]="['/seo']" [routerLinkActive]="'nav-active'" queryParams="">Seo</a>
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

    header nav a {
      display: inline-block;
      text-decoration: none;
    }
  `]
})
export class HeaderComponent {}
