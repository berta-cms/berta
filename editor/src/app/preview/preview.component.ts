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
    const iframe: HTMLIFrameElement = event.target;
    console.log('IFRAME LOADED!!!');
    console.log(iframe.contentWindow);
    console.log('sync: ', iframe.contentWindow['sync']);
  }

}
