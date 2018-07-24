import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SiteTemplateSettingsModel } from './site-template-settings.interface';
import { SiteTemplateSettingsState } from './site-template-settings.state';
import { camel2Words } from '../../shared/helpers';


@Component({
  selector: 'berta-site-template-settings',
  template: `
    <h2>Site Template Settings</h2>
    <div *ngFor="let settingGroup of getSettingsGroups(templateSettings$ | async)">
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
export class SiteTemplateSettingsComponent {

  @Select(SiteTemplateSettingsState.getCurrentSiteTemplateSettings)
  templateSettings$: Observable<SiteTemplateSettingsModel>;

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
