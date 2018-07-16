import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Store, Select } from '@ngxs/store';
import { AppHideOverlay, AppShowOverlay } from './app-state/app.actions';
import { AppState } from './app-state/app.state';

@Component({
  selector: 'berta-root',
  template: `
    <!--The content below is only a placeholder and can be replaced.-->
    <header>
      <nav><ul> <!-- @todo: add nav component here -->
        <li><a [routerLink]="['/sections']" queryParams="">sections</a></li>
        <li><a [routerLink]="['/design']" queryParams="">design</a></li>
        <li><a [routerLink]="['/settings']" queryParams="">settings</a></li>
        <li><a [routerLink]="['/multisite']" queryParams="">multisite</a></li>
        <li><a [routerLink]="['/shop']" queryParams="">shop</a></li>
        <li><a [routerLink]="['/seo']" queryParams="">seo</a></li>
        <li><a [routerLink]="['/account']" queryParams="">account</a></li>
        <li><a href="http://support.berta.me/kb" target="_blank">knowledge base</a></li>
      </ul>
      </nav>
      <!-- @todo: add user profile dropdown component here -->
      <div class="user-profile">
        <button>user@amil.com</button>
        <ul>
          <li>Profile</li>
          <li>Log Out</li>
        </ul>
      </div>
    </header>
    <main>
      <aside><router-outlet></router-outlet></aside><!-- the sidebar -->
      <section>
        <div style="text-align:center">
          <h1>
            Welcome to {{title}}!
          </h1>
          <img width="300" src="http://www.berta.me/storage/media/logo.png">
        </div>
        <button (click)="showOverlay()">Show overlay</button>
      </section>
    </main>
    <div [style.display]="((showOverlay$ | async) ? '' : 'none')" class="overlay" (click)="hideOverlay()">
  `,
  styles: [
    `
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(30,30,30, 0.3);
    }
    /* use flexbox here: */
    header > * {
      display: inline-block;
    }

    header nav ul {
      list-style: none;
    }
    header nav li {
      display: inline-block;
      margin-right: 10px;
    }
    .user-profile {
      float: right;
    }
    `
  ]
})
export class AppComponent implements OnInit {
  title = 'berta';

  @Select(AppState.getShowOverlay) showOverlay$;

  constructor(
    private router: Router,
    private store: Store) {
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url !== '/') {
          this.showOverlay();
        } else {
          this.hideOverlay();
        }
      }
    });
  }

  hideOverlay() {
    this.store.dispatch(AppHideOverlay);
    this.router.navigate(['/']);
  }
  showOverlay() {
    this.store.dispatch(AppShowOverlay);
  }
}
