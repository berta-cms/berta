import { Component, OnInit } from '@angular/core';
import { Select } from '../../../../node_modules/@ngxs/store';
import { SiteSettingsModel, SiteSettingsStateMap } from './site-settings.interface';
import { Observable } from '../../../../node_modules/rxjs';
import { SitesSettingsState } from './site-settings.state';
import { map } from '../../../../node_modules/rxjs/operators';

@Component({
  selector: 'berta-site-settings',
  template: `
    <h2>Site settings</h2>
    <div *ngFor="let setting of getSettings(settings$) | async">{{setting[0]}}: {{setting[1] | json}}</div>
  `,
  styles: [`
    div {
      overflow: hidden;
      height: 1em;
      margin-bottom: 10px;
    }
  `]
})
export class SiteSettingsComponent implements OnInit {
  @Select(state => state.siteSettings[state.app.site]) settings$: Observable<SiteSettingsModel>;

  constructor() { }

  ngOnInit() {
  }

  getSettings(settings$) {
    return settings$.pipe(map((settings: SiteSettingsModel) => {
      return settings && Object.keys(settings).map((setting) => {
        return [setting, settings[setting]];
      }) || [];
    }));
  }
}
