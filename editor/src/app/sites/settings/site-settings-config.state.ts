import { State, StateContext, NgxsOnInit, Action } from '@ngxs/store';
import { take } from 'rxjs/operators';
import { SiteSettingsConfigStateModel, SiteSettingsConfigResponse } from './site-settings-config.interface';
import { AppStateService } from '../../app-state/app-state.service';
import { initSettingConfigGroup } from '../../shared/helpers';
import { ResetSiteSettingsConfigAction } from './site-settings-config.actions';


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
          settingGroups[groupSlug] = initSettingConfigGroup(siteSettingsConfig[groupSlug]);
        }

        setState(settingGroups);
      },
      error: (error) => console.error(error)
    });
  }

  @Action(ResetSiteSettingsConfigAction)
  resetSiteSettingsConfig({ setState }: StateContext<SiteSettingsConfigStateModel>) {
    setState({});
  }
}
