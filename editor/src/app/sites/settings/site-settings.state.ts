import { State, Action, StateContext, Selector, NgxsOnInit, Store } from '@ngxs/store';
import { SitesSettingsStateModel } from './site-settings.interface';
import { AppStateService } from '../../app-state/app-state.service';
import { take } from 'rxjs/operators';
import { AppState } from '../../app-state/app.state';
import { UpdateSiteSettingsAction,
  DeleteSiteSettingsAction,
  RenameSiteSettingsSitenameAction } from './site-settings.actions';


@State<SitesSettingsStateModel>({
  name: 'siteSettings',
  defaults: {}
})
export class SiteSettingsState implements NgxsOnInit {

  @Selector([AppState.getSite])
  static getCurrentSiteSettings(siteSettings: SitesSettingsStateModel, siteSlug: string) {
    if (!siteSettings || siteSlug === null) {
      return;
    }

    return siteSettings[siteSlug];
  }

  @Selector([SiteSettingsState.getCurrentSiteSettings])
  static getCurrentSiteTemplate(_, currentSiteSettings) {
    if (!(currentSiteSettings && currentSiteSettings.template)) {
      return;
    }
    return currentSiteSettings.template.template;
  }

  constructor(
    private store: Store,
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

  @Action(UpdateSiteSettingsAction)
  updateSiteSettings({ patchState, getState }: StateContext<SitesSettingsStateModel>, action: UpdateSiteSettingsAction) {
    const currentSite = this.store.selectSnapshot(AppState.getSite);
    const currentState = getState();
    const updatedSiteSettingsGroup = {...currentState[currentSite][action.settingGroup], ...action.payload};

    patchState({[currentSite]: {
      ...currentState[currentSite],
      [action.settingGroup]: updatedSiteSettingsGroup
    }});
  }

  @Action(RenameSiteSettingsSitenameAction)
  renameSiteSettingsSitename({ setState, getState }: StateContext<SitesSettingsStateModel>, action: RenameSiteSettingsSitenameAction) {
    const state = getState();
    const newState = {};

    /* Using the loop to retain the element order in the map */
    for (const siteName in state) {
      if (siteName === action.site.name) {
        newState[action.siteName] = state[siteName];
      } else {
        newState[siteName] = state[siteName];
      }
    }

    setState(newState);
  }

  @Action(DeleteSiteSettingsAction)
  deleteSiteSettings({ setState, getState }: StateContext<SitesSettingsStateModel>, action: DeleteSiteSettingsAction) {
    const newState = {...getState()};
    delete newState[action.siteName];
    setState(newState);
  }
}
