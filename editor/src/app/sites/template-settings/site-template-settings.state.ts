import { State, Action, StateContext, Selector, NgxsOnInit } from '@ngxs/store';
import { AppStateService } from '../../app-state/app-state.service';
import { take } from 'rxjs/operators';
import { SitesTemplateSettingsStateModel } from './site-template-settings.interface';
import { SiteSettingsState } from '../settings/site-settings.state';
import { SiteSettingsModel } from '../settings/site-settings.interface';
import { AppStateModel } from '../../app-state/app-state.interface';
import { AppState } from '../../app-state/app.state';

@State<SitesTemplateSettingsStateModel>({
  name: 'siteTemplateSettings',
  defaults: {}
})
export class SiteTemplateSettingsState implements NgxsOnInit {

  @Selector([AppState, SiteSettingsState.getCurrentSiteSettings])
  static getCurrentSiteTemplateSettings(
    state: SiteTemplateSettingsState,
    appState: AppStateModel,
    siteSettings: SiteSettingsModel) {

    if (!(state && appState && siteSettings && state[appState.site])) {
      return;
    }
    return state[appState.site][siteSettings.template.template];
  }

  @Selector([SiteSettingsState.getCurrentSiteSettings])
  static getIsResponsive(_, currentSiteTemplateSettings) {
    return currentSiteTemplateSettings.pageLayout.responsive === 'yes';
  }

  constructor(
    private appStateService: AppStateService) {
  }


  ngxsOnInit({ setState }: StateContext<SitesTemplateSettingsStateModel>) {
    this.appStateService.getInitialState('', 'site_template_settings').pipe(take(1)).subscribe({
      next: (response) => {
        setState(response as SitesTemplateSettingsStateModel);
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
