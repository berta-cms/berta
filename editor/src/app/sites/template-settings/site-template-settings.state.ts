import { concat } from 'rxjs';
import { take, switchMap, tap } from 'rxjs/operators';
import {
  State,
  Action,
  StateContext,
  Selector,
  NgxsOnInit,
  Store,
  Actions,
  ofActionSuccessful,
} from '@ngxs/store';

import { AppStateService } from '../../app-state/app-state.service';
import { FileUploadService } from '../shared/file-upload.service';
import {
  SitesTemplateSettingsStateModel,
  SitesTemplateSettingsResponse,
  TemplateSettingsTemplateResponse,
} from './site-template-settings.interface';
import { SettingsGroupModel } from '../../shared/interfaces';
import { SiteSettingsState } from '../settings/site-settings.state';
import { AppState } from '../../app-state/app.state';
import {
  UpdateSiteTemplateSettingsAction,
  DeleteSiteTemplateSettingsAction,
  RenameSiteTemplateSettingsSitenameAction,
  CreateSiteTemplateSettingsAction,
  ResetSiteTemplateSettingsAction,
  InitSiteTemplateSettingsAction,
  HandleSiteTemplateSettingsAction,
  ResetToDefaultsSiteTemplateSettingsAction,
} from './site-template-settings.actions';
import { UserLoginAction } from '../../user/user.actions';
import { Injectable } from '@angular/core';

@State<SitesTemplateSettingsStateModel>({
  name: 'siteTemplateSettings',
  defaults: {},
})
@Injectable()
export class SiteTemplateSettingsState implements NgxsOnInit {
  @Selector([AppState.getSite, SiteSettingsState.getCurrentSiteTemplate])
  static getCurrentSiteTemplateSettings(
    state: SiteTemplateSettingsState,
    site: string,
    currentTemplateSlug: string
  ) {
    if (!(state && currentTemplateSlug && state[site])) {
      return;
    }
    return state[site][currentTemplateSlug];
  }

  @Selector([SiteTemplateSettingsState.getCurrentSiteTemplateSettings])
  static getIsResponsive(_, currentSiteTemplateSettings) {
    const settingGroup = currentSiteTemplateSettings.find(
      (g) => g.slug === 'pageLayout'
    );

    if (!settingGroup) {
      return false;
    }

    const isResponsive = settingGroup.settings.find(
      (s) => s.slug === 'responsive' && s.value === 'yes'
    );
    return !!isResponsive;
  }

  constructor(
    private store: Store,
    private actions$: Actions,
    private appStateService: AppStateService,
    private fileUploadService: FileUploadService
  ) {}

  ngxsOnInit({ dispatch }: StateContext<SitesTemplateSettingsStateModel>) {
    concat(
      this.appStateService
        .getInitialState('', 'site_template_settings')
        .pipe(take(1)),
      this.actions$.pipe(
        ofActionSuccessful(UserLoginAction),
        switchMap(() => {
          return this.appStateService
            .getInitialState('', 'site_template_settings')
            .pipe(take(1));
        })
      )
    ).subscribe({
      next: (response: SitesTemplateSettingsResponse) => {
        dispatch(new InitSiteTemplateSettingsAction(response));
      },
      error: (error) => console.error(error),
    });
  }

  @Action(CreateSiteTemplateSettingsAction)
  createSiteTemplateSettings(
    { patchState }: StateContext<SitesTemplateSettingsStateModel>,
    action: CreateSiteTemplateSettingsAction
  ) {
    const newTemplateSettings = { [action.site.name]: {} };

    for (const templateSlug in action.templateSettings) {
      newTemplateSettings[action.site.name][templateSlug] =
        this.initializeSettingsForTemplate(
          action.templateSettings[templateSlug]
        );
    }
    patchState(newTemplateSettings);
  }

  @Action(UpdateSiteTemplateSettingsAction)
  updateSiteTemplateSettings(
    {
      patchState,
      getState,
      dispatch,
    }: StateContext<SitesTemplateSettingsStateModel>,
    action: UpdateSiteTemplateSettingsAction
  ) {
    const currentSite = this.store.selectSnapshot(AppState.getSite);
    const currentSiteTemplate = this.store.selectSnapshot(
      SiteSettingsState.getCurrentSiteTemplate
    );
    const settingKey = Object.keys(action.payload)[0];
    const data = {
      path:
        currentSite +
        '/site_template_settings/' +
        currentSiteTemplate +
        '/' +
        action.settingGroup +
        '/' +
        settingKey,
      value: action.payload[settingKey],
    };

    return (
      data.value instanceof File
        ? this.fileUploadService.upload('siteTemplateSettingsUpload', data)
        : this.appStateService.sync('siteTemplateSettings', data)
    ).pipe(
      tap((response) => {
        if (response.error_message) {
          // @TODO handle error message
          console.error(response.error_message);
        } else {
          const currentState = getState();

          patchState({
            [currentSite]: {
              ...currentState[currentSite],
              [currentSiteTemplate]: currentState[currentSite][
                currentSiteTemplate
              ].map((settingGroup) => {
                if (settingGroup.slug !== action.settingGroup) {
                  return settingGroup;
                }

                return {
                  ...settingGroup,
                  settings: settingGroup.settings.map((setting) => {
                    if (setting.slug !== settingKey) {
                      return setting;
                    }
                    return { ...setting, value: response.value };
                  }),
                };
              }),
            },
          });
        }

        switch (action.settingGroup) {
          case 'pageLayout':
          case 'pageHeading':
          case 'entryLayout':
          case 'sideBar':
          case 'heading':
          case 'menu':
          case 'tagsMenu':
            dispatch(
              new HandleSiteTemplateSettingsAction(
                action.settingGroup,
                action.payload
              )
            );
            break;
          case 'css':
            dispatch(
              new HandleSiteTemplateSettingsAction(
                action.settingGroup,
                action.payload
              )
            );
            break;
        }
      })
    );
  }

  @Action(RenameSiteTemplateSettingsSitenameAction)
  renameSiteTemplateSettingsSitename(
    { setState, getState }: StateContext<SitesTemplateSettingsStateModel>,
    action: RenameSiteTemplateSettingsSitenameAction
  ) {
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
    action: DeleteSiteTemplateSettingsAction
  ) {
    const newState = { ...getState() };
    delete newState[action.siteName];
    setState(newState);
  }

  @Action(ResetSiteTemplateSettingsAction)
  resetSiteTemplateSettings({
    setState,
  }: StateContext<SitesTemplateSettingsStateModel>) {
    setState({});
  }

  @Action(InitSiteTemplateSettingsAction)
  initSiteTemplateSettings(
    { setState }: StateContext<SitesTemplateSettingsStateModel>,
    action: InitSiteTemplateSettingsAction
  ) {
    /** Initializing state: */
    const newState: SitesTemplateSettingsStateModel = {};

    for (const siteSlug in action.payload) {
      newState[siteSlug] = {};

      for (const templateSlug in action.payload[siteSlug]) {
        newState[siteSlug][templateSlug] = this.initializeSettingsForTemplate(
          action.payload[siteSlug][templateSlug]
        );
      }
    }

    setState(newState);
  }

  @Action(ResetToDefaultsSiteTemplateSettingsAction)
  resetToDefaultsSiteTemplateSettings(
    { patchState, getState }: StateContext<SitesTemplateSettingsStateModel>,
    action: ResetToDefaultsSiteTemplateSettingsAction
  ) {
    return this.appStateService
      .sync('siteTemplateSettings', action, 'PUT')
      .pipe(
        tap((response) => {
          if (response.error_message) {
            // @TODO handle error message
            console.error(response.error_message);
          } else {
            const currentSite = this.store.selectSnapshot(AppState.getSite);
            const currentSiteTemplate = this.store.selectSnapshot(
              SiteSettingsState.getCurrentSiteTemplate
            );
            const currentState = getState();

            patchState({
              [currentSite]: {
                ...currentState[currentSite],
                [currentSiteTemplate]:
                  this.initializeSettingsForTemplate(response),
              },
            });
          }
        })
      );
  }

  initializeSettingsForTemplate(
    settings: TemplateSettingsTemplateResponse
  ): SettingsGroupModel[] {
    return Object.keys(settings).map((settingGroupSlug) => {
      return {
        slug: settingGroupSlug,
        settings: Object.keys(settings[settingGroupSlug]).map((settingSlug) => {
          return {
            slug: settingSlug,
            value: settings[settingGroupSlug][settingSlug],
          };
        }),
      };
    });
  }
}
