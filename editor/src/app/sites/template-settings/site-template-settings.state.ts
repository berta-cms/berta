import { State, Action, StateContext, Selector, NgxsOnInit, Store } from '@ngxs/store';
import { AppStateService } from '../../app-state/app-state.service';
import { take } from 'rxjs/operators';
import { SitesTemplateSettingsStateModel } from './site-template-settings.interface';
import { SiteSettingsState } from '../settings/site-settings.state';
import { SiteSettingsModel } from '../settings/site-settings.interface';
import { AppStateModel } from '../../app-state/app-state.interface';
import { AppState } from '../../app-state/app.state';
import {
  UpdateSiteTemplateSettingsAction,
  DeleteSiteTemplateSettingsAction,
  RenameSiteTemplateSettingsSitenameAction
} from './site-teplate-settings.actions';

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

  @Selector([SiteTemplateSettingsState.getCurrentSiteTemplateSettings])
  static getIsResponsive(_, currentSiteTemplateSettings) {
    return currentSiteTemplateSettings.pageLayout.responsive === 'yes';
  }

  constructor(
    private store: Store,
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

  @Action(UpdateSiteTemplateSettingsAction)
  updateSiteTemplateSettings({ patchState, getState }: StateContext<SitesTemplateSettingsStateModel>,
    action: UpdateSiteTemplateSettingsAction) {
    const currentSite = this.store.selectSnapshot(AppState.getSite);
    const currentSiteTemplate = this.store.selectSnapshot(SiteSettingsState.getCurrentSiteTemplate);
    const currentState = getState();
    const updatedSiteSettingsGroup = { ...currentState[currentSite][currentSiteTemplate][action.settingGroup], ...action.payload };

    patchState({
      [currentSite]: {
        ...currentState[currentSite],
        [currentSiteTemplate]: {
          ...currentState[currentSite][currentSiteTemplate],
          [action.settingGroup]: updatedSiteSettingsGroup
        }
      }
    });
  }


  @Action(RenameSiteTemplateSettingsSitenameAction)
  renameSiteTemplateSettingsSitename(
    { setState, getState }: StateContext<SitesTemplateSettingsStateModel>,
    action: RenameSiteTemplateSettingsSitenameAction) {

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

  @Action(DeleteSiteTemplateSettingsAction)
  deleteSiteTemplateSettings(
    { setState, getState }: StateContext<SitesTemplateSettingsStateModel>,
    action: DeleteSiteTemplateSettingsAction) {

    const newState = {...getState()};
    delete newState[action.siteName];
    setState(newState);
  }
}
