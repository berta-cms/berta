import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { SiteSettingsModel, SiteSettingsConfigStateModel, SiteSettingsConfigGroup } from './site-settings.interface';
import { Observable } from 'rxjs';
import { SiteSettingsState } from './site-settings.state';
import { camel2Words } from '../../shared/helpers';
import { mergeMap, map, filter, tap } from '../../../../node_modules/rxjs/operators';
import { SiteSettingsConfigState } from './site-settings-config.state';


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
export class SiteSettingsComponent implements OnInit {
  settings$: Observable<{[k: string]: {setting: SiteSettingsModel, config: SiteSettingsConfigGroup}}>;

  constructor(private store: Store) { }

  ngOnInit() {
    this.settings$ = this.store.select(SiteSettingsState.getCurrentSiteSettings).pipe(
      filter(settings => !!settings && Object.keys(settings).length > 0),
      mergeMap(settings => {
        return this.store.select(SiteSettingsConfigState).pipe(
          filter(settingsConfig => !!settingsConfig && Object.keys(settings).length > 0),
          map((settingsConfig: SiteSettingsConfigStateModel) => {
            const settingsWConfig = {};

            for (const settingGroup in settings) {
              settingsWConfig[settingGroup] = {
                setting: settings[settingGroup],
                config: settingsConfig[settingGroup]
              };
            }
            return settingsWConfig;
          }));
      }),
      tap(result => console.log('after settings map: ', result))
    );
  }

  getSettingsGroups(settingsWConfig: {setting: SiteSettingsModel, config: SiteSettingsConfigGroup}) {
    if (!settingsWConfig) {
      return [];
    }

    return Object.keys(settingsWConfig)
      .map((settingGroup) => {
        const groupKeys = Object.keys(settingsWConfig[settingGroup].setting);
        const groupsArray = groupKeys.map(
          setting => [
            settingsWConfig[settingGroup].config[setting] && settingsWConfig[settingGroup].config[setting].title
              ? settingsWConfig[settingGroup].config[setting].title
              : camel2Words(setting),
            settingsWConfig[settingGroup].setting[setting]
          ]);

        return [
          settingsWConfig[settingGroup].config._.title
            ? settingsWConfig[settingGroup].config._.title
            : camel2Words(settingGroup),
          groupsArray
        ];
      });
  }
}
