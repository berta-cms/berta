import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { AppState } from '../app-state/app.state';
import { SitesState } from '../sites/sites-state/sites.state';

@Injectable({
  providedIn: 'root'
})
export class TemplateRenderService {
  store: Store;

  constructor(
     store: Store) {

      this.store = store;
  }

  getViewObservables() {
    const viewObservables = {
      currentSite: this.store.select(AppState.getSite),
      sites: this.store.select(SitesState),
    };

    return viewObservables;
  }
}
