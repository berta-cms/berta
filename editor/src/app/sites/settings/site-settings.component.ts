import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { SiteSettingsModel, SiteSettingsConfigStateModel, SiteSettingsConfigGroup } from './site-settings.interface';
import { Observable } from 'rxjs';
import { SiteSettingsState } from './site-settings.state';
import { camel2Words, isPlainObject } from '../../shared/helpers';
import { mergeMap, map, filter, tap } from 'rxjs/operators';
import { SiteSettingsConfigState } from './site-settings-config.state';
import { UpdateSiteSettingsAction } from './site-settings.actions';


@Component({
  selector: 'berta-site-settings',
  template: `
    <h2>Site settings</h2>

    <div *ngFor="let settingGroup of settings$ | async">
      <h3>{{ settingGroup.group.title || settingGroup.group.slug }}</h3>
      <berta-setting *ngFor="let setting of settingGroup.settings"
                     [setting]="setting.setting"
                     [config]="setting.config"
                     (update)="updateSetting(settingGroup.group.slug, $event)"></berta-setting>
    </div>
  `,
  styles: [`
    div {
      margin-bottom: 10px;
    }
  `]
})
export class SiteSettingsComponent implements OnInit {
  settings$: Observable<{ group: any, settings: any[] }[]>;

  constructor(private store: Store) { }

  ngOnInit() {
    /**
     * @note:
     * Current setup will destroy and recreate all the setting components on each update.
     * This is due to transformation of store necessary to display it. The transformation will crtheeate new objects and
     * arrays every time, so all the components will be recreated.
     *
     * @todo: update the store, so the data it contains reflects the data we use here.
     */
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
        const groupConfig = (settingsWConfig[settingGroup] &&
                             settingsWConfig[settingGroup].config &&
                             settingsWConfig[settingGroup].config._) || {};
        return {
          group: {
            slug: settingGroup,
            ...groupConfig
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
            })
            .filter(setting => !!setting.config)
            .map(setting => {
              if (setting.config.format === 'select' || setting.config.format === 'fontselect') {
                let values = setting.config.values;

                if (isPlainObject(values)) {
                  values = Object.keys(values).map((value => {
                    return {value: value, title: values[value]};
                  }));

                } else if (!(values instanceof Array)) {
                  values = [{value: String(setting.config.values), title: setting.config.values}];

                } else {
                  values = values.map(value => {
                    return {value: value, title: camel2Words(value)};
                  });
                }
                setting.config = {...setting.config, values: values};
              }
              return setting;
            })
        };
      }).filter(settingGroup => !settingGroup.group.invisible);
  }

  updateSetting(settingGroup: string, updateEvent) {
    const data = {[updateEvent.field]: updateEvent.value};
    this.store.dispatch(new UpdateSiteSettingsAction(settingGroup, data));
  }
}
