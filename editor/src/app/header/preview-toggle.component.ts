import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Store, Select } from '@ngxs/store';

import { AppState } from '../app-state/app.state';

/** @todo add icons */
@Component({
  selector: 'berta-preview-toggle',
  template: `
    <button class="bt-view-editor" type="button" (click)="togglePreview()">
      @if (!isPreviewActive) {
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="12.6"
          version="1.1"
          viewBox="0 0 20 12.6"
        >
          <path
            d="m18.5 6.3q-1.7-2.6-4.2-4 0.6 1.1 0.6 2.5 0 2.1-1.5 3.5-1.5 1.5-3.5 1.5-2.1 0-3.5-1.5-1.5-1.5-1.5-3.5 0-1.4 0.6-2.5-2.5 1.2-4.2 4 1.5 2.2 3.7 3.6 2.2 1.4 4.8 1.4 2.6 0 4.8-1.4 2.2-1.4 3.7-3.6zm-7.9-4.2q0-0.2-0.1-0.4t-0.4-0.1q-1.4 0-2.3 1-1 1-1 2.3 0 0.2 0.1 0.4 0.1 0.1 0.4 0.1t0.4-0.1q0.1-0.1 0.1-0.4 0-1 0.6-1.6 0.6-0.6 1.6-0.6 0.2 0 0.4-0.1 0.1-0.1 0.1-0.4zm9.4 4.2q0 0.4-0.2 0.7-1.5 2.6-4.2 4.1-2.6 1.5-5.6 1.5-2.8 0-5.6-1.5-2.6-1.5-4.2-4.1-0.2-0.4-0.2-0.7t0.2-0.7q1.6-2.5 4.2-4.1 2.6-1.5 5.6-1.5 2.8 0 5.6 1.5 2.6 1.5 4.2 4.1 0.2 0.4 0.2 0.7z"
            stroke-width="0"
          />
        </svg>
      }
      @if (isPreviewActive) {
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="18.3"
          version="1.1"
          viewBox="0 0 20 18.3"
        >
          <path
            d="m4.6 15v1.7h-4.6v-1.7zm4.6-1.7q0.3 0 0.6 0.2 0.2 0.2 0.2 0.6v3.3q0 0.3-0.2 0.6-0.2 0.2-0.6 0.2h-3.3q-0.3 0-0.6-0.2-0.2-0.2-0.2-0.6v-3.3q0-0.3 0.2-0.6 0.2-0.2 0.6-0.2zm2.1-5v1.7h-11.2v-1.7zm-8.3-6.7v1.7h-2.9v-1.7zm17.1 13.3v1.7h-9.6v-1.7zm-12.5-15q0.3 0 0.6 0.2 0.2 0.2 0.2 0.6v3.3q0 0.3-0.2 0.6-0.2 0.2-0.6 0.2h-3.3q-0.3 0-0.6-0.2-0.2-0.2-0.2-0.6v-3.3q0-0.3 0.2-0.6 0.2-0.2 0.6-0.2zm8.3 6.7q0.3 0 0.6 0.2t0.2 0.6v3.3q0 0.3-0.2 0.6t-0.6 0.2h-3.3q-0.3 0-0.6-0.2-0.2-0.2-0.2-0.6v-3.3q0-0.3 0.2-0.6 0.2-0.2 0.6-0.2zm4.2 1.7v1.7h-2.9v-1.7zm0-6.7v1.7h-11.2v-1.7z"
            stroke-width="0"
          />
        </svg>
      }
    </button>
  `,
  styles: [
    `
      :host {
        display: flex;
      }
    `,
  ],
  standalone: false,
})
export class PreviewToggleComponent implements OnInit {
  @Select(AppState.getLastRoute) lastRoute$: Observable<string>;

  isPreviewActive = true;

  constructor(
    private store: Store,
    private router: Router,
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((evt) => evt instanceof ActivationEnd))
      .subscribe((event: ActivationEnd) => {
        this.isPreviewActive = event.snapshot.url.length === 0;
      });
  }

  togglePreview() {
    let route = '/';

    if (this.isPreviewActive) {
      route = this.store.selectSnapshot(AppState.getLastRoute);
    }

    this.router.navigate([route], { queryParamsHandling: 'preserve' });
  }
}
