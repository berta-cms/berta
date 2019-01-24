import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';
import { splitCamel, uCFirst } from '../../shared/helpers';
import { Animations } from '../../shared/animations';
import { SiteSettingsState } from './site-settings.state';
import { SiteSettingsConfigState } from './site-settings-config.state';
import { UpdateSiteSettingsAction } from './site-settings.actions';
import { SettingModel, SettingConfigModel, SettingGroupConfigModel } from '../../shared/interfaces';


@Component({
  selector: 'berta-site-settings',
  template: `
    <div class="setting-group"
         [class.is-expanded]="camelifySlug(currentGroup) === settingGroup.slug"
         *ngFor="let settingGroup of settings$ | async">
      <h3 [routerLink]="['/settings', slugifyCamel(settingGroup.slug)]" queryParamsHandling="preserve" class="hoverable">
        {{ settingGroup.config.title || settingGroup.slug }}
        <svg class="drop-icon" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 1L4.75736 5.24264L0.514719 1" stroke="#9b9b9b" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </h3>
      <div class="settings" [@isExpanded]="camelifySlug(currentGroup) === settingGroup.slug">
        <div *ngFor="let setting of settingGroup.settings">
          <berta-setting *ngIf="!setting.config.children"
                         [settingGroup]="settingGroup"
                         [setting]="setting.setting"
                         [config]="setting.config"
                         (update)="updateSetting(settingGroup.slug, $event)"></berta-setting>
          <div *ngIf="setting.config.children">
            [show list of inputs here]
          <div>
        </div>
      </div>
    </div>
  `,
  animations: [
    Animations.slideToggle
  ]
})
export class SiteSettingsComponent implements OnInit {
  defaultGroup = 'template';
  currentGroup: string;
  settings$: Observable<Array<{
    config: SettingGroupConfigModel['_'],
    settings: Array<{
      setting: SettingModel,
      config: SettingConfigModel,
      children?: Array<{
        [k: string]: {
          setting: SettingModel,
          config: SettingConfigModel
        }
      }>
    }>,
    slug: string
  }>>;

  constructor(
    private store: Store,
    private route: ActivatedRoute) {
  }

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
                    config: config[settingGroup.slug][setting.slug],
                    // children: config[settingGroup.slug][setting.slug].children ?
                    //   config[settingGroup.slug][setting.slug].children ...
                    //   :
                    //   []
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

    this.route.paramMap.subscribe(params => {
      this.currentGroup = params['params']['group'] || this.defaultGroup;
    });
  }

  slugifyCamel(camelText: string) {
    return splitCamel(camelText).map(piece => piece.toLowerCase()).join('-');
  }

  camelifySlug(slug: string) {
    return slug.split('-').map((piece, i) => {
      return i ? uCFirst(piece) : piece;
    }).join('');
  }

  updateSetting(settingGroup: string, updateEvent) {
    const data = {[updateEvent.field]: updateEvent.value};
    this.store.dispatch(new UpdateSiteSettingsAction(settingGroup, data));
  }
}
