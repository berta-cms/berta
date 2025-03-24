import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'berta-icon-readonly',
  template: `<img [src]="iconSrc" />`,
  styles: [
    `
      :host {
        display: block;
        transform: translateY(50%);
        margin-right: 0.5em;
      }

      img {
        width: 16px;
        height: 16px;
      }
    `,
  ],
})
export class IconReadonlyComponent implements OnInit {
  @Input() value: string;
  iconSrc: SafeUrl;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.value = this.value ? this.value : 'link';
    let url =
      location.protocol +
      '//' +
      location.hostname +
      '/_templates/_includes/icons/' +
      this.value +
      '.svg';
    this.iconSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
