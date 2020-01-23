import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';

import { AppStateModel } from '../app-state/app-state.interface';
import { AppState } from '../app-state/app.state';

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
    private store: Store) {
  }

  ngOnInit() {
    this.store.select(AppState).subscribe((state: AppStateModel) => {
      this.appState = state;
    });
  }

  previewTheme(event, theme) {
    event.preventDefault();
    console.log('previewTheme:', theme);
  }

  applyTheme(event, theme) {
    event.preventDefault();
    console.log('applyTheme:', theme);
  }
}
