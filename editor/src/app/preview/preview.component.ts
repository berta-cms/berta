import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngxs/store';
import { UserState } from '../user/user.state';

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
    private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.store.select(UserState.isLoggedIn).subscribe(isLoggedIn => {
      let url = location.protocol + '//' + location.hostname;

      if (isLoggedIn) {
        url += '/engine/editor/';
      }

      this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    });
  }

  onLoad(event) {
    this.waitFullLoad(event.target).subscribe({
      next: (iframe) => {
        console.log('IFRAME LOADED!!!');
        console.log(iframe.contentWindow);
        console.log('sync: ', iframe.contentWindow['sync']);
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

      const loadCheck = setInterval(() => {
        if (intervalCount >= maxChecks) {
          clearInterval(loadCheck);
          observer.error({message: 'Could not load iframe: ' + lastError, data: iframe});
          return;
        }
        if (!iframe.contentDocument) {
          lastError = 'Iframe has no contentDocument';
          intervalCount++;
          return;
        }
        if (typeof(iframe.contentWindow['sync']) !== 'function') {
          lastError = '`sync` function does not exist on iframe(s) `contentWindow`';
          intervalCount++;
          return;
        }
        if (iframe.contentDocument.body.classList.length === 0 ||
            !/(xContent|xSectionType)-/.test(iframe.contentDocument.body.className)) {
              lastError = 'Berta classes `xContent-[]` or `xSectionType-` are missing from body element';
              intervalCount++;
              return;
        }
        observer.next(iframe);
        observer.complete();
      }, 500);
    });
  }
}
