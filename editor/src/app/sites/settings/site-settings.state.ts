import { cloneDeep } from 'lodash';
import { State, Action, StateContext, Selector, NgxsOnInit, Store } from '@ngxs/store';
import { SitesSettingsStateModel } from './site-settings.interface';
import { AppStateService } from '../../app-state/app-state.service';
import { take } from 'rxjs/operators';
import { AppState } from '../../app-state/app.state';
import { UpdateSiteSettingsAction, DeleteSiteSettingsAction, RenameSiteSettingsSitenameAction } from './site-settings.actions';


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
    const newState = cloneDeep(state);
    const keyVal = newState[action.site.name];
    delete newState[action.site.name];
    newState[action.siteName] = keyVal;
    setState(newState);
  }

  @Action(DeleteSiteSettingsAction)
  deleteSiteSettings({ setState, getState }: StateContext<SitesSettingsStateModel>, action: DeleteSiteSettingsAction) {
    const state = getState();
    const res = Object.assign({}, state);
    delete res[action.siteName];
    setState(res);
  }
}
