import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Store, Select } from '@ngxs/store';
import { AppHideOverlay, AppShowOverlay } from './app-state/app.actions';
import { AppState } from './app-state/app.state';

@Component({
  selector: 'berta-root',
  template: `
    <!--The content below is only a placeholder and can be replaced.-->
    <div style="text-align:center">
      <h1>
        Welcome to {{title}}!
      </h1>
      <img width="300" src="http://www.berta.me/storage/media/logo.png">
    </div>
    <h2>Here are some links to help you start: </h2>
    <ul>
      <li>
        <h2><a [routerLink]="'/random'">Random</a></h2>
      </li>
      <li>
        <button (click)="showOverlay()">Show overlay</button>
      </li>
    </ul>
    <div [style.display]="((showOverlay$ | async) ? '' : 'none')" class="overlay" (click)="hideOverlay()">
      <router-outlet></router-outlet>
    </div>
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
  }
  showOverlay() {
    this.store.dispatch(AppShowOverlay);
  }
}
