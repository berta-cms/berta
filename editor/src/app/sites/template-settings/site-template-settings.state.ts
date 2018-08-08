import { State, Action, StateContext, Selector, NgxsOnInit, Store } from '@ngxs/store';
import { AppStateService } from '../../app-state/app-state.service';
import { take } from 'rxjs/operators';
import { SitesTemplateSettingsStateModel } from './site-template-settings.interface';
import { SiteSettingsState } from '../settings/site-settings.state';
import { SiteSettingsModel } from '../settings/site-settings.interface';
import { AppStateModel } from '../../app-state/app-state.interface';
import { AppState } from '../../app-state/app.state';
import { UpdateSiteTemplateSettingsAction, DeleteSiteTemplateSettingsAction } from './site-teplate-settings.actions';

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
    const updatedSiteSettingsGroup = {...currentState[currentSite][currentSiteTemplate][action.settingGroup], ...action.payload};

    patchState({[currentSite]: {
      ...currentState[currentSite],
      [currentSiteTemplate]: {
        ...currentState[currentSite][currentSiteTemplate],
        [action.settingGroup]: updatedSiteSettingsGroup
      }
    }});
  }

  @Action(DeleteSiteTemplateSettingsAction)
  deleteSiteTemplateSettings({ setState, getState }: StateContext<SitesTemplateSettingsStateModel>,
                             action: DeleteSiteTemplateSettingsAction) {
    const state = getState();
    const res = Object.assign({}, state);
    delete res[action.siteName];
    setState(res);
  }
}
