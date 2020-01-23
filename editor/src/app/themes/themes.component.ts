import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';

import { AppStateModel } from '../app-state/app-state.interface';
import { AppState } from '../app-state/app.state';
import {
  PreviewThemeSitesAction,
  ApplyThemeSitesAction
} from '../sites/sites-state/sites.actions';

@Component({
  selector: 'berta-themes',
  template: `
  <div class="themes-container setting-group">
    <div *ngFor="let theme of appState.themes">
      {{ theme }}
      [<a href="#" (click)="previewTheme($event, theme)">Preview</a>]
      [<a href="#" (click)="applyTheme($event, theme)">Apply</a>]
    </div>
  </div>
  `
})
export class ThemesComponent implements OnInit {
  appState: AppStateModel;

  constructor(
    private store: Store,
    private router: Router) {
  }

  ngOnInit() {
    this.store.select(AppState).subscribe((state: AppStateModel) => {
      this.appState = state;
    });
  }

  previewTheme(event, theme) {
    event.preventDefault();
    if (this.appState.isLoading) {
      return;
    }

    this.store.dispatch(new PreviewThemeSitesAction({
      site: this.appState.site,
      theme: theme
    })).subscribe({
      next: () => {
        const url = window.location.origin + (this.appState.site ? '/' + this.appState.site : '') + '?preview=1';
        window.open(url, '_blank');
      },
      error: (error) => console.error(error)
    });
  }

  applyTheme(event, theme) {
    event.preventDefault();
    if (this.appState.isLoading) {
      return;
    }

    this.store.dispatch(new ApplyThemeSitesAction({
      site: this.appState.site,
      theme: theme
    })).subscribe({
      next: () => {
        // @TODO update merged site state
        // Current workaround is to reload the window
        this.router.navigate(['/'], { queryParamsHandling: 'preserve' }).then(() => {
          window.location.reload();
        });
      },
      error: (error) => console.error(error)
    });
  }
}
