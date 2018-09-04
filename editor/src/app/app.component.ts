import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { Store, Select } from '@ngxs/store';
import { AppHideOverlay, AppShowOverlay } from './app-state/app.actions';
import { AppState } from './app-state/app.state';
import { UserState } from './user/user-state';


@Component({
  selector: 'berta-root',
  template: `
    <!--The content below is only a placeholder and can be replaced.-->
    <berta-header></berta-header>
    <main>
      <aside [style.display]="(routeIsRoot ? 'none' : '')"><!-- the sidebar -->
        <div class="scroll-wrap"><router-outlet></router-outlet></div></aside>
      <section>
        <iframe sandbox="allow-same-origin allow-scripts allow-modals allow-popups allow-forms"
                [src]="previewUrl"
                frameborder="0"></iframe>
      </section>
    </main>
    <div [style.display]="((showOverlay$ | async) ? '' : 'none')" class="overlay" (click)="hideOverlay()">
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    main {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }

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
      box-sizing: border-box;
    }

    section {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }

    iframe {
      flex-grow: 1;
      width:100%;
      height:100%;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    .scroll-wrap {
      display: block;
      overflow-x: hidden;
      height: 100%;
    }
    `
  ]
})
export class AppComponent implements OnInit {
  title = 'berta';
  routeIsRoot = true;
  previewUrl: SafeUrl;

  @Select(AppState.getShowOverlay) showOverlay$;
  @Select(UserState.isLoggedIn) isLoggedIn$;

  constructor(private router: Router,
              private store: Store,
              private sanitizer: DomSanitizer) {
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

    this.isLoggedIn$.subscribe(isLoggedIn => {
      let url = location.protocol + '//' + location.hostname;

      if (isLoggedIn) {
        url = url + '/_preview';
      }

      this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
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
