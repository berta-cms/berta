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

    <div *ngFor="let settingGroup of settings$ | async">
      <h3>{{ settingGroup.group.title || settingGroup.group.slug }}</h3>
      <berta-setting *ngFor="let setting of settingGroup.settings"
                     [setting]="setting.setting"
                     [config]="setting.config"></berta-setting>
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
  settings$: Observable<{ group: any, settings: any[] }[]>;

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
      map(this.getSettingsGroups),
      tap(result => console.log('after settings map: ', result))
    );
  }

  getSettingsGroups(settingsWConfig: { setting: SiteSettingsModel, config: SiteSettingsConfigGroup }) {
    if (!settingsWConfig) {
      return [];
    }

    return Object.keys(settingsWConfig)
      .map((settingGroup) => {
        return {
          group: {
            slug: settingGroup,
            ...(settingsWConfig[settingGroup].config._ || {})
          },
          settings: Object.keys(settingsWConfig[settingGroup].setting).map(
            setting => {
              return {
                setting: {
                  slug: setting,
                  value: settingsWConfig[settingGroup].setting[setting]
                },
                config: settingsWConfig[settingGroup].config[setting]
              };
            }).filter(setting => !!setting.config)
            .map(setting => {
              if (setting.config.format === 'select' && !(setting.config.values instanceof Array)) {
                setting.config = {...setting.config, values: [setting.config.values]};
              }
              return setting;
            })
        };
      }).filter(settingGroup => !settingGroup.group.invisible);
  }
}
