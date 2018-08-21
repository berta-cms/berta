import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { SiteTemplateSettingsState } from './site-template-settings.state';
import { camel2Words, isPlainObject } from '../../shared/helpers';
import { map, filter, mergeMap } from 'rxjs/operators';
import { SiteTemplatesState } from './site-templates.state';
import { TemplateConf } from './site-template-settings.interface';
import { UpdateSiteTemplateSettingsAction } from './site-template-settings.actions';


@Component({
  selector: 'berta-site-template-settings',
  template: `
    <h2>Site Template Settings</h2>

    <div *ngFor="let settingGroup of templateSettings$ | async">
      <h3>{{ settingGroup.config.title || settingGroup.slug }}</h3>
      <berta-setting *ngFor="let setting of settingGroup.settings"
                     [setting]="setting.setting"
                     [config]="setting.config"
                     (update)="updateSetting(settingGroup.slug, $event)"></berta-setting>
    </div>
  `,
  styles: [`
    div {
      margin-bottom: 10px;
    }
  `]
})
export class SiteTemplateSettingsComponent implements OnInit {

  templateSettings$: Observable<{ config: any, settings: any[], slug: string }[]>;

  constructor (
    private store: Store) {
  }

  ngOnInit () {
    /**
     * @note:
     * Current setup will destroy and recreate all the setting components on each update.
     * This is due to transformation of store necessary to display it. The transformation will crtheeate new objects and
     * arrays every time, so all the components will be recreated.
     *
     * @todo: update the store, so the data it contains reflects the data we use here.
     */
    this.templateSettings$ = combineLatest(
      this.store.select(SiteTemplateSettingsState.getCurrentSiteTemplateSettings),
      this.store.select(SiteTemplatesState.getCurrentTemplateConfig)
    )
    .pipe(
      filter(([settings, config]) => settings && settings.length > 0 && config && Object.keys(config).length > 0),
      map(([settings, config]) => {
        return settings
          .filter(settingGroup => !config[settingGroup.slug]._.invisible)
          .map(settingGroup => {
            return {
              settings: settingGroup.settings
                .filter(setting => !!config[settingGroup.slug][setting.slug])  // don't show settings that have no config
                .map(setting => {
                  return {
                    setting: setting,
                    config: config[settingGroup.slug][setting.slug]
                  };
                }),
              config: config[settingGroup.slug]._,
              slug: settingGroup.slug
            };
          });
      })
    );
  }

  getSettingsGroups(settingsWConfig) {
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
    this.store.dispatch(new UpdateSiteTemplateSettingsAction(settingGroup, data));
  }
}
