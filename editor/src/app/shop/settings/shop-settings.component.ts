import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { SettingGroupConfigModel, SettingModel, SettingConfigModel } from '../../shared/interfaces';
import { filter, map, scan } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { ShopSettingsState } from './shop-settings.state';
import { ShopSettingsConfigState } from './shop-settings-config.state';
import { UpdateShopSettingsAction } from './shop-settings.actions';


@Component({
  selector: 'berta-shop-settings',
  template: `
  <div *ngFor="let settingGroup of settings$ | async" class="subgroup">
    <div class="setting">
      <h4>{{ settingGroup.config.title || settingGroup.slug }}</h4>
    </div>
    <berta-setting *ngFor="let setting of settingGroup.settings"
                   [setting]="setting.setting"
                   [config]="setting.config"
                   (update)="updateSetting(settingGroup.slug, $event)"></berta-setting>
  </div>
  `,
  styles: [`
    h4 {
      font-weight: bold;
    }
  `]
})
export class ShopSettingsComponent implements OnInit {
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
      this.store.select(ShopSettingsState.getCurrentSiteSettings),
      this.store.select(ShopSettingsConfigState)
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

  updateSetting(settingGroup: string, event) {
    this.store.dispatch(new UpdateShopSettingsAction(
      settingGroup, {field: event.field, value: event.value}));
  }
}
