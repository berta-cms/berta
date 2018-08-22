import { State, StateContext, NgxsOnInit } from '@ngxs/store';
import { AppStateService } from '../../app-state/app-state.service';
import { take } from 'rxjs/operators';
import { SiteSettingsConfigStateModel, SiteSettingsConfigResponse } from './site-settings-config.interface';
import { camel2Words, isPlainObject } from '../../shared/helpers';


@State<SiteSettingsConfigStateModel>({
  name: 'siteSettingsConfig',
  defaults: {}
})
export class SiteSettingsConfigState implements NgxsOnInit {

  constructor(
    private appStateService: AppStateService) {
  }

  ngxsOnInit({ setState }: StateContext<SiteSettingsConfigStateModel>) {
    this.appStateService.getInitialState('', 'siteSettingsConfig').pipe(
      take(1)
    ).subscribe({
      next: (siteSettingsConfig: SiteSettingsConfigResponse) => {
        /** Initialize state: */
        const settingGroups = {};

        for (const groupSlug in siteSettingsConfig) {
          const settingGroupConfig = siteSettingsConfig[groupSlug];
          settingGroups[groupSlug] = {};

          for (const settingSlug in settingGroupConfig) {
            const settingConfig = settingGroupConfig[settingSlug];

            if (settingSlug === '_') {
              settingGroups[groupSlug]['_'] = settingConfig;
              continue;
            }

            if (settingConfig.format === 'select' || settingConfig.format === 'fontselect') {
              let values: {value: string|number, title: string}[] = [];

              if (isPlainObject(settingConfig.values)) {
                values = Object.keys(settingConfig.values).map((value => {
                  return {value: value, title: settingConfig.values[value]};
                }));

              } else if (settingConfig.values instanceof Array) {
                values = settingConfig.values.map(value => {
                  return {value: value, title: camel2Words(String(value))};
                });

              } else {
                values = [{
                  value: String(settingConfig.values),
                  title: String(settingConfig.values)
                }];
              }
              settingGroups[groupSlug][settingSlug] = { ...settingGroupConfig[settingSlug], values: values };
              continue;
            }

            settingGroups[groupSlug][settingSlug] = settingGroupConfig[settingSlug];
          }
        }

        setState(settingGroups);
      },
      error: (error) => console.error(error)
    });
  }
}
