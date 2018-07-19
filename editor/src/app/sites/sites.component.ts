import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { AppState } from '../app-state/app.state';
import { Observable } from '../../../node_modules/rxjs';
import { SiteStateModel } from './sites-state/site-state.model';

@Component({
  selector: 'berta-sites',
  template: `
    <h2>Sites</h2>
    <ul>
      <li *ngFor="let site of sites$ | async">{{site.name || 'ROOT'}}</li>
    </ul>
  `,
  styles: []
})
export class SitesComponent implements OnInit {
  @Select(AppState.isLoggedIn) isLoggedIn$;
  @Select('sites') public sites$: Observable<SiteStateModel[]>;

  constructor(private store$: Store) { }

  ngOnInit() {
    this.sites$.subscribe((state) => console.log(state));
  }
}
