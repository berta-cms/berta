import { Component, OnInit, NgZone } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Observable, combineLatest } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import { Store } from '@ngxs/store';

import { AppState } from '../app-state/app.state';
import { UserState } from '../user/user.state';
import { PreviewService } from './preview.service';
import { AppShowLoading, UpdateAppStateAction } from '../app-state/app.actions';
import { UserLogoutAction } from '../user/user.actions';


@Component({
  selector: 'berta-preview',
  template: `
  <iframe sandbox="allow-same-origin allow-scripts allow-modals allow-popups allow-forms"
          [src]="previewUrl"
          (load)="onLoad($event)"
          frameborder="0"></iframe>
  `,
  styles: [`
    :host {
      width: 100%;
      height: 100%;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
    iframe {
      flex-grow: 1;
      width:100%;
      height:100%;
      align-self: stretch;
    }
  `]
})
export class PreviewComponent implements OnInit {
  previewUrl: SafeUrl;

  constructor(
    private store: Store,
    private ngZone: NgZone,
    private service: PreviewService,
    private sanitizer: DomSanitizer,
    private http: HttpClient) {
  }

  ngOnInit() {
    // Load iframe with current site and section
    combineLatest(
      this.store.select(AppState.getSite),
      this.store.select(AppState.getSection),
      this.store.select(UserState.isLoggedIn)
    ).pipe(
      filter(([site]) => site !== null),
    ).subscribe(([site, section, isLoggedIn]) => {
      let url = location.protocol + '//' + location.hostname;
      const queryParams = [];

      if (isLoggedIn) {
        url += '/engine/editor/';

        if (site) {
          queryParams.push({
            key: 'site',
            value: site
          });
        }

        if (section) {
          queryParams.push({
            key: 'section',
            value: section
          });
        }

        if (queryParams.length) {
          url += '?' + queryParams.map(param => param.key + '=' + param.value).join('&');
        }
      }

      this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    });
  }

  onLoad(event) {
    this.waitFullLoad(event.target).subscribe({
      next: (iframe) => {
        const lastUrlPart = iframe.contentDocument.location.href.replace(/\/$/, '').split('/').pop();
        const isSetup = iframe.contentDocument.body && /xSetupWizard/.test(iframe.contentDocument.body.className);

        this.store.dispatch(new UpdateAppStateAction({setup: isSetup}));

        /*
          Check for iframe login page
          try to login user with existing token
        */
        if (lastUrlPart === 'login.php' || lastUrlPart === 'engine') {
          const user = this.store.selectSnapshot(UserState);

          if (!user.token) {
            this.store.dispatch(UserLogoutAction);
            return;
          }

          const appState = this.store.selectSnapshot(AppState);

          return this.http.get(appState.authenticateUrl, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest' // Otherwise Lumen don't recognize AJAX request
            },
            params: {
              auth_key: user.token
            }
          }).pipe(take(1)).subscribe({
            next: () => {
              // Token is valid, reload irame
              iframe.src += '';
            },
            error: (error) => {
              console.error(error);
              this.store.dispatch(UserLogoutAction);
            }
          });
        }

        if (typeof(iframe.contentWindow['sync']) === 'function') {

          iframe.contentWindow['syncState'] = (url, data, method) => {
            /* Return promise to the old berta */
            return new Promise((resolve, reject) => {
              this.ngZone.run(() => {
                this.store.dispatch(AppShowLoading);
                this.service.sync(url, data, method).subscribe({
                  next: (response) => {
                    resolve(response);
                  },
                  error: (err) => {
                    reject(err);
                  }
                });
              });
            });
          };
        }

        /* Reload the iframe when the settings change */
        this.service.connectIframeReload(iframe);
        iframe.contentWindow.onbeforeunload = () => {
          this.service.disconnectIframeView(iframe);
        };
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  private waitFullLoad(iframe: HTMLIFrameElement): Observable<HTMLIFrameElement> {
    return Observable.create(observer => {
      const maxChecks = 10;
      let intervalCount = 0;
      let lastError = '';
      const lastUrlPart = iframe.contentDocument.location.href.replace(/\/$/, '').split('/').pop();

      const loadCheck = setInterval(() => {
        if (intervalCount >= maxChecks) {
          clearInterval(loadCheck);
          observer.error({message: 'Could not load iframe: ' + lastError, data: iframe});
          observer.complete();
          return;
        }

        if (!iframe.contentDocument) {
          lastError = 'Iframe has no contentDocument';
          intervalCount++;
          return;
        }

        if (lastUrlPart === 'login.php' || lastUrlPart === 'engine') {
          observer.next(iframe);
          observer.complete();
        }

        if (iframe.contentDocument.body &&
            (iframe.contentDocument.body.classList.length === 0 ||
            !/(xLoginPageBody|xContent-|xSectionType-)/.test(iframe.contentDocument.body.className))
        ) {
              lastError = 'Berta classes `xLoginPageBody` or `xContent-[]` or `xSectionType-` are missing from body element';
              intervalCount++;
              return;
        }

        observer.next(iframe);
        observer.complete();
      }, 500);
    });
  }
}
