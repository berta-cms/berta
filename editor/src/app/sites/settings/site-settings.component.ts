import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { SiteSettingsModel } from './sites-settings.interface';
import { Observable } from 'rxjs';
import { SitesSettingsState } from './sites-settings.state';
import { camel2Words } from '../../shared/helpers';


@Component({
  selector: 'berta-site-settings',
  template: `
    <h2>Site settings</h2>
    <div *ngFor="let settingGroup of getSettingsGroups(settings$ | async)">
      <h3>{{ settingGroup[0] }}</h3>
      <ul>
        <li *ngFor="let setting of settingGroup[1]"><strong>{{setting[0]}}</strong>: {{setting[1]}}</li>
      </ul>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      overflow-x: hidden;
      height: 100%;
    }
    div {
      margin-bottom: 10px;
    }
  `]
})
export class SiteSettingsComponent {
  @Select(SitesSettingsState.getCurrentSiteSettings) settings$: Observable<SiteSettingsModel>;

  getSettingsGroups(settings) {
    if (!settings) {
      return [];
    }

    return Object.keys(settings).map((settingGroup) => {
      return [
        camel2Words(settingGroup),
        Object.keys(settings[settingGroup]).map(setting => [camel2Words(setting), settings[settingGroup][setting]])
      ];
    });
  }
}
