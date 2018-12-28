import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { splitCamel, uCFirst } from '../../shared/helpers';
import { Animations } from '../../shared/animations';
import { SiteSettingsState } from '../settings/site-settings.state';
import { SiteTemplateSettingsState } from './site-template-settings.state';
import { SiteTemplatesState } from './site-templates.state';
import { UpdateSiteTemplateSettingsAction } from './site-template-settings.actions';
import { SettingGroupConfigModel, SettingModel, SettingConfigModel } from '../../shared/interfaces';


@Component({
  selector: 'berta-site-template-settings',
  template: `
    <div class="setting-group"
         [class.is-expanded]="camelifySlug(currentGroup) === settingGroup.slug"
         *ngFor="let settingGroup of templateSettings$ | async">
      <h3 [routerLink]="['/design', slugifyCamel(settingGroup.slug)]" queryParamsHandling="preserve" class="hoverable">
        {{ settingGroup.config.title || settingGroup.slug }}
        <svg class="drop-icon" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 1L4.75736 5.24264L0.514719 1" stroke="#9b9b9b" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </h3>
      <div class="settings" [@isExpanded]="camelifySlug(currentGroup) === settingGroup.slug">
        <berta-setting *ngFor="let setting of settingGroup.settings"
                      [templateSlug]="settingGroup.templateSlug"
                      [settingGroup]="settingGroup"
                      [setting]="setting.setting"
                      [config]="setting.config"
                      (update)="updateSetting(settingGroup.slug, $event)"></berta-setting>
      </div>
    </div>
  `,
  animations: [
    Animations.slideToggle
  ]
})
export class SiteTemplateSettingsComponent implements OnInit {
  defaultGroup = 'general-font-settings';
  currentGroup: string;
  templateSettings$: Observable<Array<{
    config: SettingGroupConfigModel['_'],
    settings: Array<{
      setting: SettingModel,
      config: SettingConfigModel,
      templateSlug: string
    }>,
    slug: string
  }>>;

  constructor(
    private store: Store,
    private route: ActivatedRoute) {
  }

  ngOnInit () {
    this.templateSettings$ = combineLatest(
      this.store.select(SiteTemplateSettingsState.getCurrentSiteTemplateSettings),
      this.store.select(SiteTemplatesState.getCurrentTemplateConfig),
      this.store.select(SiteSettingsState.getCurrentSiteTemplate)
    )
    .pipe(
      filter(([settings, config]) => settings && settings.length > 0 && config && Object.keys(config).length > 0),
      map(([settings, config, templateSlug]) => {
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
              slug: settingGroup.slug,
              templateSlug: templateSlug
            };
          });
      }),
      /**
       * settingGroups in this step aren't the ones we get from the store,
       * they are virtual objects created in prev step (the map function)
       */
      scan((prevSettingGroups, settingGroups, templateSlug) => {
        if (!prevSettingGroups || prevSettingGroups.length === 0 || !templateSlug) {
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
    const currentSiteTemplate = this.store.selectSnapshot(SiteSettingsState.getCurrentSiteTemplate).split('-').shift();

    if (currentSiteTemplate === 'messy' && settingGroup === 'pageLayout') {
      if (data['responsive'] && data['responsive'] === 'yes') {
        this.store.dispatch(new UpdateSiteTemplateSettingsAction(settingGroup, {autoResponsive: 'no'}));
      } else if (data['autoResponsive'] && data['autoResponsive'] === 'yes') {
        this.store.dispatch(new UpdateSiteTemplateSettingsAction(settingGroup, {responsive: 'no'}));
      }
    }

    this.store.dispatch(new UpdateSiteTemplateSettingsAction(settingGroup, data));
  }
}
