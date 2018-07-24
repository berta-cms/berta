import { State, Action, StateContext, Selector, NgxsOnInit } from '@ngxs/store';
import { SitesSettingsStateModel } from './sites-settings.interface';
import { AppStateService } from '../../app-state/app-state.service';
import { take } from 'rxjs/operators';
import { AppStateModel } from '../../app-state/app-state.interface';
import { AppState } from '../../app-state/app.state';


@State<SitesSettingsStateModel>({
  name: 'siteSettings',
  defaults: {}
})
export class SitesSettingsState implements NgxsOnInit {

  @Selector([AppState])
  static getCurrentSiteSettingsArray(siteSettings: SitesSettingsStateModel, appState: AppStateModel) {
    if (!(siteSettings && appState && siteSettings[appState.site])) {
      return;
    }

    return siteSettings[appState.site];
  }

  constructor(
    private appStateService: AppStateService) {
  }

  ngxsOnInit({ setState }: StateContext<SitesSettingsStateModel>) {
    this.appStateService.getInitialState('', 'site_settings').pipe(take(1)).subscribe({
      next: (response) => {
        setState(response as SitesSettingsStateModel);
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
