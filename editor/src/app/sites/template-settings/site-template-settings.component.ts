import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SiteTemplateSettingsState } from './site-template-settings.state';
import { camel2Words } from '../../shared/helpers';
import { map, filter } from 'rxjs/operators';


@Component({
  selector: 'berta-site-template-settings',
  template: `
    <h2>Site Template Settings</h2>
    <div *ngFor="let settingGroup of templateSettings$ | async">
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
export class SiteTemplateSettingsComponent implements OnInit {

  templateSettings$: Observable<any[]>;

  constructor (
    private store: Store) {
  }

  ngOnInit () {
    this.templateSettings$ = this.store.select(SiteTemplateSettingsState.getCurrentSiteTemplateSettings).pipe(
      filter(settings => !!settings && Object.keys(settings).length > 0),
      map(this.getSettingsGroups)
    );
  }

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
