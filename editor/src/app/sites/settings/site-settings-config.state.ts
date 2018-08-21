import { State, Action, StateContext, Selector, NgxsOnInit } from '@ngxs/store';
import { AppStateService } from '../../app-state/app-state.service';
import { take } from 'rxjs/operators';
import { SiteSettingsConfigStateModel } from './site-settings.interface';
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
      next: (siteSettingsConfig) => {
        /** Initialize state: */
        const settingGroups = {};

        for (const groupSlug in siteSettingsConfig) {
          const settingGroupConfig = siteSettingsConfig[groupSlug];
          settingGroups[groupSlug] = {};

          for (const settingSlug in settingGroupConfig) {
            if (settingSlug === '_') {
              settingGroups[groupSlug]['_'] = settingGroupConfig[settingSlug];
              continue;
            }

            if (['select', 'fontselect'].indexOf(settingGroupConfig[settingSlug].format) > -1) {
              let values: {value: string|number, title: string}[] = [];

              if (isPlainObject(settingGroupConfig[settingSlug].values)) {
                values = Object.keys(settingGroupConfig[settingSlug]).map((value => {
                  return {value: value, title: values[value]};
                }));

              } else if (settingGroupConfig[settingSlug].values instanceof Array) {
                values = settingGroupConfig[settingSlug].values.map(value => {
                  return {value: value, title: camel2Words(String(value))};
                });

              } else {
                values = [{
                  value: String(settingGroupConfig[settingSlug].values),
                  title: String(settingGroupConfig[settingSlug].values)
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

  // @Action(AppShowOverlay)
  // showOverlay({ patchState }: StateContext<SiteSettingsModel>) {
  //   patchState({ showOverlay: true });
  // }

  // @Action(AppHideOverlay)
  // hideOverlay({ patchState }: StateContext<SiteSettingsModel>) {
  //   patchState({ showOverlay: false });
  // }

  // @Action(AppLogin)
  // login({ patchState }: StateContext<SiteSettingsModel>, action: AppLogin) {
  //   patchState({authToken: action.token});
  // }
}
