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
import {
  SitesSettingsStateModel,
  SiteSettingsResponse,
  SiteSettingsSiteResponse,
} from './site-settings.interface';
import { SettingsGroupModel } from '../../shared/interfaces';
import { FileUploadService } from '../shared/file-upload.service';
import { AppStateService } from '../../app-state/app-state.service';
import { AppState } from '../../app-state/app.state';
import {
  UpdateSiteSettingsAction,
  DeleteSiteSettingsAction,
  RenameSiteSettingsSitenameAction,
  CreateSiteSettingsAction,
  ResetSiteSettingsAction,
  InitSiteSettingsAction,
  UpdateSiteSettingsFromSyncAction,
  AddSiteSettingChildrenAction,
  DeleteSiteSettingChildrenAction,
  UpdateSiteSettingChildrenAction,
  UpdateNavigationSiteSettingsAction,
  HandleSiteSettingsChildrenChangesAction,
  SwapContentsSitesSettingsAction,
} from './site-settings.actions';
import { UserLoginAction } from '../../user/user.actions';
import { AddSiteSectionAction } from '../sections/sections-state/site-sections.actions';
import { Injectable } from '@angular/core';

@State<SitesSettingsStateModel>({
  name: 'siteSettings',
  defaults: {},
})
@Injectable()
export class SiteSettingsState implements NgxsOnInit {
  @Selector([SiteSettingsState, AppState.getSite])
  static getCurrentSiteSettings(
    siteSettings: SitesSettingsStateModel,
    siteSlug: string,
  ) {
    if (!siteSettings || siteSlug === null) {
      return undefined;
    }

    return siteSettings[siteSlug];
  }

  @Selector([SiteSettingsState.getCurrentSiteSettings])
  static getCurrentSiteTemplate(currentSiteSettings): string | undefined {
    if (!currentSiteSettings) {
      return undefined;
    }
    const templateSettings = currentSiteSettings.find(
      (settingGroup) => settingGroup.slug === 'template',
    );
    const template =
      templateSettings &&
      templateSettings.settings.find((setting) => setting.slug === 'template');
    return template && template.value;
  }

  @Selector([SiteSettingsState.getCurrentSiteSettings])
  static getCurrentSiteLanguage(currentSiteSettings): string | undefined {
    if (!currentSiteSettings) {
      return undefined;
    }
    const languageSettings = currentSiteSettings.find(
      (settingGroup) => settingGroup.slug === 'language',
    );
    const language =
      languageSettings &&
      languageSettings.settings.find((setting) => setting.slug === 'language');
    return language && language.value;
  }

  constructor(
    private store: Store,
    private actions$: Actions,
    private appStateService: AppStateService,
    private fileUploadService: FileUploadService,
  ) {}

  ngxsOnInit({ dispatch }: StateContext<SitesSettingsStateModel>) {
    concat(
      this.appStateService.getInitialState('', 'site_settings').pipe(take(1)),
      this.actions$.pipe(
        ofActionSuccessful(UserLoginAction),
        switchMap(() => {
          return this.appStateService
            .getInitialState('', 'site_settings')
            .pipe(take(1));
        }),
      ),
    ).subscribe({
      next: (response: SiteSettingsResponse) => {
        dispatch(new InitSiteSettingsAction(response));
      },
      error: (error) => console.error(error),
    });
  }

  @Action(CreateSiteSettingsAction)
  createSiteSettings(
    { patchState }: StateContext<SitesSettingsStateModel>,
    action: CreateSiteSettingsAction,
  ) {
    const newSettings = {
      [action.site.name]: this.initializeSettingsForSite(action.settings),
    };
    patchState(newSettings);
  }

  @Action(UpdateSiteSettingsAction)
  updateSiteSettings(
    { getState, patchState, dispatch }: StateContext<SitesSettingsStateModel>,
    action: UpdateSiteSettingsAction,
  ) {
    const currentSite = this.store.selectSnapshot(AppState.getSite);
    const settingKey = Object.keys(action.payload)[0];
    const data = {
      path: currentSite + '/settings/' + action.settingGroup + '/' + settingKey,
      value: action.payload[settingKey],
    };

    return (
      data.value instanceof File
        ? this.fileUploadService.upload('siteSettingsUpload', data)
        : this.appStateService.sync('siteSettings', data)
    ).pipe(
      tap((response) => {
        if (response.error_message) {
          /* This should probably be handled in sync */
          console.error(response.error_message);
        } else {
          const currentState = getState();

          patchState({
            [currentSite]: currentState[currentSite].map((settingGroup) => {
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
          });

          switch (action.settingGroup) {
            case 'navigation':
              dispatch(new UpdateNavigationSiteSettingsAction(action.payload));
              break;
            case 'socialMediaLinks':
            case 'socialMediaButtons':
            case 'media':
            case 'banners':
            case 'settings':
            case 'entryLayout':
            case 'pageLayout':
              dispatch(
                new HandleSiteSettingsChildrenChangesAction(
                  action.settingGroup,
                  action.payload,
                ),
              );
              break;
          }
        }
      }),
    );
  }

  @Action(UpdateSiteSettingsFromSyncAction)
  updateSiteSettingsFromSync(
    { patchState, getState, dispatch }: StateContext<SitesSettingsStateModel>,
    action: UpdateSiteSettingsFromSyncAction,
  ) {
    return this.appStateService
      .sync('siteSettings', {
        path: action.path,
        value: action.payload,
      })
      .pipe(
        tap((response) => {
          if (response.error_message) {
            /* This should probably be handled in sync */
            console.error(response.error_message);
          } else {
            const currentState = getState();
            const [currentSite, _, settingGroup, settingKey] =
              action.path.split('/');

            patchState({
              [currentSite]: currentState[currentSite].map((_settingGroup) => {
                if (_settingGroup.slug !== settingGroup) {
                  return _settingGroup;
                }

                if (
                  _settingGroup.settings.some(
                    (setting) => setting.slug === settingKey,
                  )
                ) {
                  return {
                    ..._settingGroup,
                    settings: _settingGroup.settings.map((setting) => {
                      if (setting.slug !== settingKey) {
                        return setting;
                      }
                      return { ...setting, value: response.value };
                    }),
                  };
                }

                return {
                  ..._settingGroup,
                  settings: [
                    ..._settingGroup.settings,
                    { slug: settingKey, value: response.value },
                  ],
                };
              }),
            });

            if (response.section) {
              dispatch(new AddSiteSectionAction(response.section));
            }
          }
        }),
      );
  }

  @Action(AddSiteSettingChildrenAction)
  addSiteSettingChildren(
    { getState, patchState, dispatch }: StateContext<SitesSettingsStateModel>,
    action: AddSiteSettingChildrenAction,
  ) {
    const currentSite = this.store.selectSnapshot(AppState.getSite);
    const settingKey = action.slug;
    const data = {
      path: currentSite + '/settings/' + action.settingGroup + '/' + settingKey,
      value: action.payload,
    };

    return this.appStateService.sync('siteSettings', data, 'POST').pipe(
      tap((response) => {
        if (response.error_message) {
          /* This should probably be handled in sync */
          console.error(response.error_message);
        } else {
          const currentState = getState();

          patchState({
            [currentSite]: currentState[currentSite].map((settingGroup) => {
              if (settingGroup.slug !== action.settingGroup) {
                return settingGroup;
              }

              return {
                ...settingGroup,
                settings: settingGroup.settings.map((setting) => {
                  if (setting.slug !== settingKey) {
                    return setting;
                  }

                  const newChild: any = Object.keys(response).map((slug) => {
                    return {
                      slug: slug,
                      value: response[slug],
                    };
                  });

                  return {
                    ...setting,
                    value: [
                      ...(setting.value as Array<{
                        [k: string]: string | number | boolean;
                      }>),
                      newChild,
                    ],
                  };
                }),
              };
            }),
          });

          dispatch(
            new HandleSiteSettingsChildrenChangesAction(action.settingGroup),
          );
        }
      }),
    );
  }

  @Action(DeleteSiteSettingChildrenAction)
  deleteSiteSettingChildren(
    { getState, patchState, dispatch }: StateContext<SitesSettingsStateModel>,
    action: DeleteSiteSettingChildrenAction,
  ) {
    const currentSite = this.store.selectSnapshot(AppState.getSite);
    const settingKey = action.slug;
    const data = {
      path: currentSite + '/settings/' + action.settingGroup + '/' + settingKey,
      value: action.payload,
    };

    return this.appStateService.sync('siteSettings', data, 'DELETE').pipe(
      tap((response) => {
        if (response.error_message) {
          /* This should probably be handled in sync */
          console.error(response.error_message);
        } else {
          const currentState = getState();

          patchState({
            [currentSite]: currentState[currentSite].map((settingGroup) => {
              if (settingGroup.slug !== action.settingGroup) {
                return settingGroup;
              }

              return {
                ...settingGroup,
                settings: settingGroup.settings.map((setting) => {
                  if (setting.slug !== settingKey) {
                    return setting;
                  }

                  return {
                    ...setting,
                    value: (
                      setting.value as Array<{
                        [k: string]: string | number | boolean;
                      }>
                    ).filter((_, i) => i !== action.payload),
                  };
                }),
              };
            }),
          });

          dispatch(
            new HandleSiteSettingsChildrenChangesAction(action.settingGroup),
          );
        }
      }),
    );
  }

  @Action(UpdateSiteSettingChildrenAction)
  updateSiteSettingChildren(
    { getState, patchState, dispatch }: StateContext<SitesSettingsStateModel>,
    action: UpdateSiteSettingChildrenAction,
  ) {
    const currentSite = this.store.selectSnapshot(AppState.getSite);
    const settingSlug = action.slug;
    const childParentSlug = settingSlug.substr(0, settingSlug.length - 1);
    const childSlug = Object.keys(action.payload)[0];
    const path = [
      currentSite,
      'settings',
      action.settingGroup,
      settingSlug,
      childParentSlug,
      action.index,
      childSlug,
    ];
    const data = {
      path: path.join('/'),
      value: action.payload[childSlug],
    };

    return this.appStateService.sync('siteSettings', data).pipe(
      tap((response) => {
        if (response.error_message) {
          /* This should probably be handled in sync */
          console.error(response.error_message);
        } else {
          const currentState = getState();

          patchState({
            [currentSite]: currentState[currentSite].map((settingGroup) => {
              if (settingGroup.slug !== action.settingGroup) {
                return settingGroup;
              }

              return {
                ...settingGroup,
                settings: settingGroup.settings.map((setting) => {
                  if (setting.slug !== settingSlug) {
                    return setting;
                  }

                  return {
                    ...setting,
                    value: (setting.value as any).map((row, index) => {
                      if (action.index !== index) {
                        return row;
                      }

                      const slug = Object.keys(action.payload)[0];

                      return row.map((child) => {
                        if (child.slug !== slug) {
                          return child;
                        }

                        return { ...child, value: response.value };
                      });
                    }),
                  };
                }),
              };
            }),
          });

          dispatch(
            new HandleSiteSettingsChildrenChangesAction(action.settingGroup),
          );
        }
      }),
    );
  }

  @Action(RenameSiteSettingsSitenameAction)
  renameSiteSettingsSitename(
    { setState, getState }: StateContext<SitesSettingsStateModel>,
    action: RenameSiteSettingsSitenameAction,
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

  @Action(SwapContentsSitesSettingsAction)
  swapContentsSitesSettings(
    { getState, setState }: StateContext<SitesSettingsStateModel>,
    action: SwapContentsSitesSettingsAction,
  ) {
    const state = getState();
    setState({
      ...state,
      [action.payload.siteSlugFrom]: state[action.payload.siteSlugTo],
      [action.payload.siteSlugTo]: state[action.payload.siteSlugFrom],
    });
  }

  @Action(DeleteSiteSettingsAction)
  deleteSiteSettings(
    { setState, getState }: StateContext<SitesSettingsStateModel>,
    action: DeleteSiteSettingsAction,
  ) {
    const newState = { ...getState() };
    delete newState[action.siteName];
    setState(newState);
  }

  initializeSettingsForSite(
    settings: SiteSettingsSiteResponse,
  ): SettingsGroupModel[] {
    return Object.keys(settings).map((settingGroupSlug) => {
      return {
        slug: settingGroupSlug,
        settings: Object.keys(settings[settingGroupSlug]).map((settingSlug) => {
          return {
            slug: settingSlug,
            value:
              settings[settingGroupSlug][settingSlug] instanceof Array
                ? settings[settingGroupSlug][settingSlug].map((children) => {
                    return Object.keys(children).map((slug) => {
                      return {
                        slug: slug,
                        value: children[slug],
                      };
                    });
                  })
                : settings[settingGroupSlug][settingSlug],
          };
        }),
      };
    });
  }

  @Action(ResetSiteSettingsAction)
  resetSiteSettings({ setState }: StateContext<SitesSettingsStateModel>) {
    setState({});
  }

  @Action(InitSiteSettingsAction)
  initSiteSettings(
    { setState }: StateContext<SitesSettingsStateModel>,
    action: InitSiteSettingsAction,
  ) {
    const newState: SitesSettingsStateModel = {};

    for (const siteSlug in action.payload) {
      newState[siteSlug] = this.initializeSettingsForSite(
        action.payload[siteSlug],
      );
    }

    setState(newState);
  }
}
