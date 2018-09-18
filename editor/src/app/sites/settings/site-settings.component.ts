import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';
import { SiteSettingsState } from './site-settings.state';
import { SiteSettingsConfigState } from './site-settings-config.state';
import { UpdateSiteSettingsAction } from './site-settings.actions';
import { SettingModel, SettingConfigModel, SettingGroupConfigModel } from '../../shared/interfaces';


@Component({
  selector: 'berta-site-settings',
  template: `
    <div class="setting-group" *ngFor="let settingGroup of settings$ | async">
      <h3>
        {{ settingGroup.config.title || settingGroup.slug }}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 1L4.75736 5.24264L0.514719 1" stroke="#9b9b9b" stroke-linecap="round" stroke-linejoin="round" class="drop-icon"/>
        </svg>
      </h3>
      <div class="settings">
        <berta-setting *ngFor="let setting of settingGroup.settings"
                      [settingGroup]="settingGroup"
                      [setting]="setting.setting"
                      [config]="setting.config"
                      (update)="updateSetting(settingGroup.slug, $event)"></berta-setting>
      </div>
    </div>
  `,
  styles: [`
    div {
      margin-bottom: 10px;
    }
  `]
})
export class SiteSettingsComponent implements OnInit {
  settings$: Observable<Array<{
    config: SettingGroupConfigModel['_'],
    settings: Array<{
      setting: SettingModel,
      config: SettingConfigModel
    }>,
    slug: string
  }>>;

  constructor(private store: Store) { }

  ngOnInit() {
    this.settings$ = combineLatest(
      this.store.select(SiteSettingsState.getCurrentSiteSettings),
      this.store.select(SiteSettingsConfigState)
    ).pipe(
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

      }),
      /**
       * settingGroups in this step aren't the ones we get from the store,
       * they are virtual objects created in prev step (the map function)
       */
      scan((prevSettingGroups, settingGroups) => {
        if (!prevSettingGroups || prevSettingGroups.length === 0) {
          return settingGroups;
        }

        return settingGroups.map(settingGroup => {
          const prevSettingGroup = prevSettingGroups.find(psg => {
            return psg.slug === settingGroup.slug &&
              psg.config === settingGroup.config &&
              psg.settings.length === settingGroup.settings.length;
          });

          if (prevSettingGroup) {
            if (settingGroup.settings.some(((setting, index) => prevSettingGroup.settings[index].setting !== setting.setting))) {
              /* Careful, not to mutate anything coming from the store: */
              prevSettingGroup.settings = settingGroup.settings.map(setting => {
                const prevSetting = prevSettingGroup.settings.find(ps => {
                  return ps.setting === setting.setting && ps.config === setting.config;
                });
                if (prevSetting) {
                  return prevSetting;
                }
                return setting;
              });
            }
            return prevSettingGroup;
          }
          return settingGroup;
        });
      })
    );
  }

  updateSetting(settingGroup: string, updateEvent) {
    const data = {[updateEvent.field]: updateEvent.value};
    this.store.dispatch(new UpdateSiteSettingsAction(settingGroup, data));
  }
}
