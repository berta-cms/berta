import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { SiteSettingsModel, SiteSettingsConfigGroup } from './site-settings.interface';
import { Observable, combineLatest } from 'rxjs';
import { SiteSettingsState } from './site-settings.state';
import { camel2Words, isPlainObject } from '../../shared/helpers';
import { map, filter, tap } from 'rxjs/operators';
import { SiteSettingsConfigState } from './site-settings-config.state';
import { UpdateSiteSettingsAction } from './site-settings.actions';


@Component({
  selector: 'berta-site-settings',
  template: `
    <h2>Site settings</h2>

    <div *ngFor="let settingGroup of settings$ | async">
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
export class SiteSettingsComponent implements OnInit {
  settings$: Observable<{ config: any, settings: any[], slug: string }[]>;

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
      tap(result => console.log('after settings map: ', result))
    );
  }

  updateSetting(settingGroup: string, updateEvent) {
    const data = {[updateEvent.field]: updateEvent.value};
    this.store.dispatch(new UpdateSiteSettingsAction(settingGroup, data));
  }
}
