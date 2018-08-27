import { concat } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';
import { State, Action, StateContext, Selector, NgxsOnInit, Store, Actions, ofActionSuccessful } from '@ngxs/store';
import { SitesSettingsStateModel, SiteSettingsResponse, SiteSettingsSiteResponse } from './site-settings.interface';
import { SettingsGroupModel } from '../../shared/interfaces';
import { AppStateService } from '../../app-state/app-state.service';
import { AppState } from '../../app-state/app.state';
import {
  UpdateSiteSettingsAction,
  DeleteSiteSettingsAction,
  RenameSiteSettingsSitenameAction,
  CreateSiteSettingsAction,
  ResetSiteSettingsAction,
  InitSiteSettingsAction} from './site-settings.actions';
import { UserLoginAction } from '../../user/user-actions';


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
    private actions$: Actions,
    private appStateService: AppStateService) {
  }

  ngxsOnInit({ dispatch }: StateContext<SitesSettingsStateModel>) {
    concat(
      this.appStateService.getInitialState('', 'site_settings').pipe(take(1)),
      this.actions$.pipe(ofActionSuccessful(UserLoginAction), switchMap(() => {
        return this.appStateService.getInitialState('', 'site_settings').pipe(take(1));
      }))
    )
    .subscribe({
      next: (response: SiteSettingsResponse) => {
        dispatch(new InitSiteSettingsAction(response));
      },
      error: (error) => console.error(error)
    });
  }

  @Action(CreateSiteSettingsAction)
  createSiteSettings({ patchState }: StateContext<SitesSettingsStateModel>, action: CreateSiteSettingsAction) {
    const newSettings = {[action.site.name]: this.initializeSettingsForSite(action.settings)};
    patchState(newSettings);
  }

  @Action(UpdateSiteSettingsAction)
  updateSiteSettings({ patchState, getState }: StateContext<SitesSettingsStateModel>, action: UpdateSiteSettingsAction) {
    const currentSite = this.store.selectSnapshot(AppState.getSite);
    const settingKey = Object.keys(action.payload)[0];
    const data = {
      path: currentSite + '/settings/' + action.settingGroup + '/' + settingKey,
      value: action.payload[settingKey]
    };
    /** @todo: Loading should be triggered here */

    this.appStateService.sync('siteSettings', data)
      .subscribe(response => {
        /** @todo: additional action should be triggered here!!! */
        if (response.error_message) {
          // @TODO handle error message
          console.error(response.error_message);
        } else {
          const currentState = getState();

          patchState({[currentSite]: currentState[currentSite].map(settingGroup => {
            if (settingGroup.slug !== action.settingGroup) {
              return settingGroup;
            }

            return {
              ...settingGroup,
              settings: settingGroup.settings.map(setting => {
                if (setting.slug !== settingKey) {
                  return setting;
                }
                return { ...setting, value: action.payload[settingKey] };
              })
            };
          })});
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

  initializeSettingsForSite(settings: SiteSettingsSiteResponse): SettingsGroupModel[] {
    return Object.keys(settings).map(settingGroupSlug => {
      return {
        slug: settingGroupSlug,
        settings: Object.keys(settings[settingGroupSlug]).map(settingSlug => {
          return {
            slug: settingSlug,
            value: settings[settingGroupSlug][settingSlug]
          };
        })
      };
    });
  }

  @Action(ResetSiteSettingsAction)
  resetSiteSettings({ setState }: StateContext<SitesSettingsStateModel>) {
    setState({});
  }

  @Action(InitSiteSettingsAction)
  initSiteSettings({ setState }: StateContext<SitesSettingsStateModel>, action: InitSiteSettingsAction) {
    const newState: SitesSettingsStateModel = {};

    for (const siteSlug in action.payload) {
      newState[siteSlug] = this.initializeSettingsForSite(action.payload[siteSlug]);
    }

    setState(newState);
  }
}
