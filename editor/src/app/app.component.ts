import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Store, Select } from '@ngxs/store';
import { AppHideOverlay, AppShowOverlay } from './app-state/app.actions';
import { AppState } from './app-state/app.state';

@Component({
  selector: 'berta-root',
  template: `
    <!--The content below is only a placeholder and can be replaced.-->
    <berta-header></berta-header>
    <main>
      <aside [style.display]="(routeIsRoot ? 'none' : '')"><router-outlet></router-outlet></aside><!-- the sidebar -->
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
  styles: [`
    berta-header {
      display: block;
      position: relative;
      z-index: 3;
    }

    aside {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      height: 100%;
      width: 384px;
      z-index: 2;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
    `
  ]
})
export class AppComponent implements OnInit {
  title = 'berta';
  routeIsRoot = true;

  @Select(AppState.getShowOverlay) showOverlay$;

  constructor(
    private router: Router,
    private store: Store) {
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url !== '/') {
          this.routeIsRoot = false;
          this.showOverlay();
        } else {
          this.routeIsRoot = true;
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
