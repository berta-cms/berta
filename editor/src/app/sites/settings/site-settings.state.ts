import { State, Action, StateContext, Selector, NgxsOnInit, Store } from '@ngxs/store';
import { SitesSettingsStateModel, SiteSettingsResponse } from './site-settings.interface';
import { AppStateService } from '../../app-state/app-state.service';
import { take } from 'rxjs/operators';
import { AppState } from '../../app-state/app.state';
import {
  UpdateSiteSettingsAction,
  DeleteSiteSettingsAction,
  RenameSiteSettingsSitenameAction,
  CreateSiteSettingsAction } from './site-settings.actions';


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
  static getCurrentSiteTemplate(_, currentSiteSettings): string | undefined {
    if (!currentSiteSettings) {
      return;
    }
    const templateSettings = currentSiteSettings.find(settingGroup => settingGroup.slug === 'template');
    const template = templateSettings && templateSettings.settings.find(setting => setting.slug === 'template');
    return template && template.value;
  }

  constructor(
    private store: Store,
    private appStateService: AppStateService) {
  }

  ngxsOnInit({ setState }: StateContext<SitesSettingsStateModel>) {
    this.appStateService.getInitialState('', 'site_settings').pipe(take(1)).subscribe({
      next: (response: SiteSettingsResponse) => {
        /** Initializing state: */
        const newState: SitesSettingsStateModel = {};

        for (const siteSlug in response) {
          newState[siteSlug] = Object.keys(response[siteSlug]).map(settingGroupSlug => {
            return {
              slug: settingGroupSlug,
              settings: Object.keys(response[siteSlug][settingGroupSlug]).map(settingSlug => {
                return {
                  slug: settingSlug,
                  value: response[siteSlug][settingGroupSlug][settingSlug]
                };
              })
            };
          });
        }

        setState(newState);
      },
      error: (error) => console.error(error)
    });
  }

  @Action(CreateSiteSettingsAction)
  createSiteSettings({ patchState, getState }: StateContext<SitesSettingsStateModel>, action: CreateSiteSettingsAction) {
    /** @todo: rewrite this method to support new data structure */
    return;
    const currentState = getState();
    const newSettings = {};
    newSettings[action.site.name] = action.settings;
    patchState({...currentState, ...newSettings});
  }

  @Action(UpdateSiteSettingsAction)
  updateSiteSettings({ patchState, getState }: StateContext<SitesSettingsStateModel>, action: UpdateSiteSettingsAction) {
    /** @todo: rewrite this method to support new data structure */
    return;
    const currentSite = this.store.selectSnapshot(AppState.getSite);
    const settingKey = Object.keys(action.payload)[0];
    const data = {
      path: currentSite + '/settings/' + action.settingGroup + '/' + settingKey,
      value: action.payload[settingKey]
    };

    this.appStateService.sync('siteSettings', data)
      .subscribe(response => {
        if (response.error_message) {
          // @TODO handle error message
          console.error(response.error_message);
        } else {
          const currentState = getState();
          const updatedSiteSettingsGroup = {...currentState[currentSite][action.settingGroup], ...action.payload};

          patchState({[currentSite]: {
            ...currentState[currentSite],
            [action.settingGroup]: updatedSiteSettingsGroup
          }});
        }
    });
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
