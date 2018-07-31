import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SiteTemplateSettingsState } from './site-template-settings.state';
import { camel2Words, isPlainObject } from '../../shared/helpers';
import { map, filter, mergeMap } from 'rxjs/operators';
import { SiteTemplatesState } from './templates.state';
import { TemplateConf } from './site-template-settings.interface';


@Component({
  selector: 'berta-site-template-settings',
  template: `
    <h2>Site Template Settings</h2>

    <div *ngFor="let settingGroup of templateSettings$ | async">
      <h3>{{ settingGroup.group.title || settingGroup.group.slug }}</h3>
      <berta-setting *ngFor="let setting of settingGroup.settings"
                     [setting]="setting.setting"
                     [config]="setting.config"></berta-setting>
    </div>
  `,
  styles: [`
    div {
      margin-bottom: 10px;
    }
  `]
})
export class SiteTemplateSettingsComponent implements OnInit {

  templateSettings$: Observable<{ group: any, settings: any[] }[]>;

  constructor (
    private store: Store) {
  }

  ngOnInit () {
    this.templateSettings$ = this.store.select(SiteTemplateSettingsState.getCurrentSiteTemplateSettings).pipe(
      filter(settings => !!settings && Object.keys(settings).length > 0),
      mergeMap(settings => {
        return this.store.select(SiteTemplatesState.getCurrentTemplateConfig).pipe(
          filter(templateConf => !!templateConf && Object.keys(templateConf).length > 0),
          map((templateConf: TemplateConf) => {
            const settingsWConfig = {};

            for (const settingGroup in settings) {
              settingsWConfig[settingGroup] = {
                setting: settings[settingGroup],
                config: templateConf[settingGroup]
              };
            }
            return settingsWConfig;
          }));
      }),
      map(this.getSettingsGroups)
    );
  }

  getSettingsGroups(settingsWConfig) {
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
}