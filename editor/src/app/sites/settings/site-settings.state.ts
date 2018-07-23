import { State, Action, StateContext, Selector, NgxsOnInit } from '@ngxs/store';
import { SiteSettingsStateMap } from './site-settings.interface';
import { AppStateService } from '../../app-state/app-state.service';
import { take } from 'rxjs/operators';

@State<SiteSettingsStateMap>({
  name: 'siteSettings',
  defaults: {}
})
export class SitesSettingsState implements NgxsOnInit {

  // @Selector()
  // static getCurrentSite(state: SiteSettingsModel) {
  //   return state.showOverlay;
  // }

  constructor(
    private appStateService: AppStateService) {
  }


  ngxsOnInit({ setState }: StateContext<SiteSettingsStateMap>) {
    this.appStateService.getInitialState('', 'site_settings').pipe(take(1)).subscribe({
      next: (response) => {
        console.log('response: ', response);
        setState(response as SiteSettingsStateMap);
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
