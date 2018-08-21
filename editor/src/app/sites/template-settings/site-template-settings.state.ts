import { State, Action, StateContext, Selector, NgxsOnInit, Store } from '@ngxs/store';
import { AppStateService } from '../../app-state/app-state.service';
import { take } from 'rxjs/operators';
import { SitesTemplateSettingsStateModel, SitesTemplateSettingsResponseModel } from './site-template-settings.interface';
import { SiteSettingsState } from '../settings/site-settings.state';
import { AppStateModel } from '../../app-state/app-state.interface';
import { AppState } from '../../app-state/app.state';
import {
  UpdateSiteTemplateSettingsAction,
  DeleteSiteTemplateSettingsAction,
  RenameSiteTemplateSettingsSitenameAction,
  CreateSiteTemplateSettingsAction} from './site-template-settings.actions';

@State<SitesTemplateSettingsStateModel>({
  name: 'siteTemplateSettings',
  defaults: {}
})
export class SiteTemplateSettingsState implements NgxsOnInit {

  @Selector([AppState, SiteSettingsState.getCurrentSiteTemplate])
  static getCurrentSiteTemplateSettings(
    state: SiteTemplateSettingsState,
    appState: AppStateModel,
    currentTemplateSlug: string) {

    if (!(state && appState && currentTemplateSlug && state[appState.site])) {
      return;
    }
    return state[appState.site][currentTemplateSlug];
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
      next: (response: SitesTemplateSettingsResponseModel) => {
        /** Initializing state: */
        const newState: SitesTemplateSettingsStateModel = {};

        for (const siteSlug in response) {
          newState[siteSlug] = {};

          for (const templateSlug in response[siteSlug]) {
            console.log('ts', response[siteSlug][templateSlug]);
            newState[siteSlug][templateSlug] = Object.keys(response[siteSlug][templateSlug]).map(settingGroupSlug => {
              const settingGroup = response[siteSlug][templateSlug][settingGroupSlug];

              return {
                slug: settingGroupSlug,
                settings: Object.keys(settingGroup).map(settingSlug => {
                  return {
                    slug: settingSlug,
                    value: settingGroup[settingSlug]
                  };
                })
              };
            });
          }
        }

        setState(newState);
      },
      error: (error) => console.error(error)
    });
  }

  @Action(CreateSiteTemplateSettingsAction)
  createSiteTemplateSettings({ patchState, getState }: StateContext<SitesTemplateSettingsStateModel>,
                             action: CreateSiteTemplateSettingsAction) {
    return;
    const currentState   = getState();
    const newTemplateSettings = {};
    newTemplateSettings[action.site.name] = action.templateSettings;
    patchState({...currentState, ...newTemplateSettings});
  }

  @Action(UpdateSiteTemplateSettingsAction)
  updateSiteTemplateSettings({ patchState, getState }: StateContext<SitesTemplateSettingsStateModel>,
    action: UpdateSiteTemplateSettingsAction) {
    return;
    const currentSite = this.store.selectSnapshot(AppState.getSite);
    const currentSiteTemplate = this.store.selectSnapshot(SiteSettingsState.getCurrentSiteTemplate);
    const settingKey = Object.keys(action.payload)[0];
    const data = {
      path: currentSite + '/site_template_settings/' + currentSiteTemplate + '/' + action.settingGroup + '/' + settingKey,
      value: action.payload[settingKey]
    };

    this.appStateService.sync('siteTemplateSettings', data)
      .subscribe(response => {
        if (response.error_message) {
          // @TODO handle error message
          console.error(response.error_message);
        } else {
          const currentState = getState();
          const updatedSiteSettingsGroup = {...currentState[currentSite][currentSiteTemplate][action.settingGroup], ...action.payload};

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
