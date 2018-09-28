import { Component } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SiteStateModel } from './sites-state/site-state.model';
import { UpdateInputFocus } from '../app-state/app.actions';
import { CreateSiteAction } from './sites-state/sites.actions';

@Component({
  selector: 'berta-sites',
  template: `
    <berta-site *ngFor="let site of sites$ | async"
                [site]="site"
                (inputFocus)="updateComponentFocus($event)"></berta-site>
    <button type="button" class="button" (click)="createSite()">Create new site</button>
  `
})
export class SitesComponent {
  @Select('sites') public sites$: Observable<SiteStateModel[]>;

  constructor(private store: Store) { }

  updateComponentFocus(isFocused) {
    this.store.dispatch(new UpdateInputFocus(isFocused));
  }

  createSite() {
    this.store.dispatch(CreateSiteAction);
  }
}
