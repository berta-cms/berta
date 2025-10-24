import { get } from 'lodash';
import { concat } from 'rxjs';
import { take, switchMap, tap } from 'rxjs/operators';
import {
  Store,
  State,
  Action,
  StateContext,
  Selector,
  NgxsOnInit,
  Actions,
  ofActionSuccessful,
} from '@ngxs/store';

import { assignByPath } from '../../../shared/helpers';
import {
  SiteSectionBackgroundFile,
  SiteSectionStateModel,
} from './site-sections-state.model';
import { AppStateService } from '../../../app-state/app-state.service';
import { AppState } from '../../../app-state/app.state';
import {
  UpdateSiteSectionAction,
  UpdateSiteSectionFromSyncAction,
  DeleteSiteSectionsAction,
  RenameSiteSectionsSitenameAction,
  DeleteSiteSectionAction,
  CreateSectionAction,
  CloneSectionAction,
  RenameSiteSectionAction,
  AddSiteSectionsAction,
  ResetSiteSectionsAction,
  InitSiteSectionsAction,
  UpdateSiteSectionBackgroundFromSyncAction,
  AddSiteSectionAction,
  ReOrderSiteSectionsAction,
  OrderSiteSectionBackgroundAction,
  DeleteSiteSectionBackgroundFileAction,
  AddSiteSectionBackgroundFileAction,
  UpdateSectionBackgroundFileAction,
  UpdateSiteSectionByPathAction,
  SwapContentsSitesSectionsAction,
} from './site-sections.actions';
import {
  DeleteSectionTagsAction,
  RenameSectionTagsAction,
  AddSectionTagsAction,
} from '../tags/section-tags.actions';
import {
  DeleteSectionEntriesAction,
  RenameSectionEntriesAction,
  AddSectionEntriesAction,
} from '../entries/entries-state/section-entries.actions';
import { UserLoginAction } from '../../../user/user.actions';
import { FileUploadService } from '../../shared/file-upload.service';
import { Injectable } from '@angular/core';

@State<SiteSectionStateModel[]>({
  name: 'siteSections',
  defaults: [],
})
@Injectable()
export class SiteSectionsState implements NgxsOnInit {
  @Selector([SiteSectionsState, AppState.getSite])
  static getCurrentSiteSections(
    state: SiteSectionStateModel[],
    site: string,
  ): SiteSectionStateModel[] {
    return state
      .filter((section) => {
        return section.site_name === site;
      })
      .sort((sectionA, sectionB) => (sectionA.order > sectionB.order ? 1 : -1));
  }

  @Selector([SiteSectionsState.getCurrentSiteSections])
  static getCurrentSiteShopSections(
    sections: SiteSectionStateModel[],
  ): SiteSectionStateModel[] {
    return sections.filter(
      (section) => section['@attributes']?.type === 'shop',
    );
  }

  constructor(
    private appStateService: AppStateService,
    private actions$: Actions,
    private store: Store,
    private fileUploadService: FileUploadService,
  ) {}

  ngxsOnInit({ dispatch }: StateContext<SiteSectionStateModel[]>) {
    concat(
      this.appStateService.getInitialState('', 'site_sections').pipe(take(1)),
      this.actions$.pipe(
        ofActionSuccessful(UserLoginAction),
        switchMap(() => {
          return this.appStateService
            .getInitialState('', 'site_sections')
            .pipe(take(1));
        }),
      ),
    ).subscribe((sections) => {
      dispatch(new InitSiteSectionsAction(sections));
    });
  }

  @Action(CreateSectionAction)
  createSection(
    { dispatch }: StateContext<SiteSectionStateModel[]>,
    action: CreateSectionAction,
  ) {
    const siteName = this.store.selectSnapshot(AppState.getSite);
    const data = {
      name: action.section ? action.section.name : null,
      site: siteName,
      title: action.section ? action.section.title : null,
    };

    return this.appStateService.sync('siteSections', data, 'POST').pipe(
      tap((response) => {
        if (response.error_message) {
          // @TODO handle error message
          console.error(response.error_message);
        } else {
          const newSiteSection: SiteSectionStateModel = response.section;

          dispatch(new AddSiteSectionAction(newSiteSection));

          if (response.entries && response.entries.length) {
            dispatch(new AddSectionEntriesAction(siteName, response.entries));
          }

          if (response.tags && response.tags) {
            dispatch(new AddSectionTagsAction(siteName, response.tags));
          }
        }
      }),
    );
  }

  @Action(AddSiteSectionAction)
  addSiteSection(
    { getState, setState }: StateContext<SiteSectionStateModel[]>,
    action: AddSiteSectionAction,
  ) {
    const state = getState();
    setState([...state, action.section]);
  }

  @Action(AddSiteSectionsAction)
  addSiteSections(
    { getState, setState }: StateContext<SiteSectionStateModel[]>,
    action: AddSiteSectionsAction,
  ) {
    const state = getState();
    setState([...state, ...action.sections]);
  }

  @Action(CloneSectionAction)
  cloneSection(
    { dispatch }: StateContext<SiteSectionStateModel[]>,
    action: CloneSectionAction,
  ) {
    dispatch(new CreateSectionAction(action.section));
  }

  @Action(UpdateSiteSectionAction)
  updateSiteSection(
    { getState, setState }: StateContext<SiteSectionStateModel[]>,
    action: UpdateSiteSectionAction,
  ) {
    // @todo rewite this path lookup from payload
    const fieldKeys = [Object.keys(action.payload)[0]];
    if (action.payload[fieldKeys[0]] instanceof Object) {
      fieldKeys.push(Object.keys(action.payload[fieldKeys[0]])[0]);
    }
    const field = fieldKeys.join('/');
    const path = action.site + '/section/' + action.order + '/' + field;
    const value = get(action.payload, fieldKeys.join('.'));

    const data = {
      path: path,
      value: value,
    };

    return this.appStateService.sync('siteSections', data).pipe(
      tap((response) => {
        if (response.error_message) {
          // @TODO handle error message
          console.error(response.error_message);
        } else {
          const state = getState();
          setState(
            state.map((section) => {
              if (
                section.site_name !== action.site ||
                section.order !== action.order
              ) {
                return section;
              }
              /* Quick workaround for deep settings: */
              if (action.payload['@attributes']) {
                // sometimes we are getting numbers as action payload. But there are places in code where we need strings. Like '1'.
                const attrNames = Object.keys(action.payload['@attributes']);
                attrNames.forEach(
                  (key) =>
                    (action.payload['@attributes'][key] =
                      action.payload['@attributes'][key] + ''),
                );

                /** @todo rebuild this recursive */
                const attributes = {
                  ...section['@attributes'],
                  ...action.payload['@attributes'],
                };
                return {
                  ...section,
                  ...action.payload,
                  ...{ '@attributes': attributes },
                };
              }
              return { ...section, ...action.payload }; // Deep set must be done here for complex properties
            }),
          );
        }
      }),
    );
  }

  @Action(UpdateSiteSectionByPathAction)
  updateSiteSectionByPath(
    { setState, getState }: StateContext<SiteSectionStateModel[]>,
    action: UpdateSiteSectionByPathAction,
  ) {
    return this.appStateService
      .sync('siteSections', {
        path: action.path,
        value: action.payload,
      })
      .pipe(
        tap((response) => {
          if (response.error_message) {
            // @TODO handle error message
            console.error(response.error_message);
          } else {
            const state = getState();
            const path = action.path.split('/');
            const [currentSite, _, sectionOrder] = path;
            const siteName = currentSite === '0' ? '' : currentSite;

            setState(
              state.map((section) => {
                if (
                  section.site_name !== siteName ||
                  section.order !== parseInt(sectionOrder, 10)
                ) {
                  return section;
                }

                return assignByPath(
                  section,
                  path.slice(3).join('/'),
                  action.payload,
                );
              }),
            );
          }
        }),
      );
  }

  @Action(UpdateSiteSectionFromSyncAction)
  updateSiteSettingsFromSync(
    { setState, getState }: StateContext<SiteSectionStateModel[]>,
    action: UpdateSiteSectionFromSyncAction,
  ) {
    return this.appStateService
      .sync('siteSections', {
        path: action.path,
        value: action.payload,
      })
      .pipe(
        tap((response) => {
          if (response.error_message) {
            /* This should probably be handled in sync */
            console.error(response.error_message);
          } else {
            const state = getState();
            const path = action.path.split('/');
            const [currentSite, _, sectionOrder] = path;
            const siteName = currentSite === '0' ? '' : currentSite;

            setState(
              state.map((section) => {
                if (
                  section.site_name !== siteName ||
                  section.order !== parseInt(sectionOrder, 10)
                ) {
                  return section;
                }

                return assignByPath(
                  section,
                  path.slice(3).join('/'),
                  action.payload,
                );
              }),
            );
          }
        }),
      );
  }

  @Action(UpdateSiteSectionBackgroundFromSyncAction)
  updateSiteSectionBackgroundFromSync(
    { getState, setState }: StateContext<SiteSectionStateModel[]>,
    action: UpdateSiteSectionBackgroundFromSyncAction,
  ) {
    return this.appStateService
      .sync(
        'siteSectionBackgrounds',
        {
          site: action.site,
          section: action.section,
          files: action.files,
        },
        'PUT',
      )
      .pipe(
        tap((response) => {
          if (response.error_message) {
            // @TODO handle error message
            console.error(response.error_message);
          } else {
            const state = getState();

            setState(
              state.map((section) => {
                if (
                  section.site_name !== action.site ||
                  section.name !== action.section
                ) {
                  return section;
                }

                const mediaCacheData = {
                  ...section.mediaCacheData,
                  file: response.files,
                };
                return {
                  ...section,
                  mediafolder: response.mediafolder,
                  mediaCacheData: mediaCacheData,
                };
              }),
            );
          }
        }),
      );
  }

  @Action(OrderSiteSectionBackgroundAction)
  orderSiteSectionBackground(
    { getState, setState }: StateContext<SiteSectionStateModel[]>,
    action: OrderSiteSectionBackgroundAction,
  ) {
    return this.appStateService
      .sync(
        'siteSectionBackgrounds',
        {
          site: action.site,
          section: action.section,
          files: action.files,
        },
        'PUT',
      )
      .pipe(
        tap((response) => {
          if (response.error_message) {
            // @TODO handle error message
            console.error(response.error_message);
          } else {
            const state = getState();

            setState(
              state.map((section) => {
                if (
                  section.site_name !== action.site ||
                  section.name !== action.section
                ) {
                  return section;
                }

                const mediaCacheData = {
                  ...section.mediaCacheData,
                  file: response.files,
                };
                return {
                  ...section,
                  mediafolder: response.mediafolder,
                  mediaCacheData: mediaCacheData,
                };
              }),
            );
          }
        }),
      );
  }

  @Action(DeleteSiteSectionBackgroundFileAction)
  deleteSiteSectionBackgroundFile(
    { getState, setState }: StateContext<SiteSectionStateModel[]>,
    action: DeleteSiteSectionBackgroundFileAction,
  ) {
    return this.appStateService
      .sync(
        'siteSectionBackgrounds',
        {
          site: action.site,
          section: action.section,
          file: action.file,
        },
        'DELETE',
      )
      .pipe(
        tap((response) => {
          if (response.error_message) {
            // @TODO handle error message
            console.error(response.error_message);
          } else {
            const state = getState();

            setState(
              state.map((section) => {
                if (
                  section.site_name !== action.site ||
                  section.name !== action.section
                ) {
                  return section;
                }

                const mediaCacheData = {
                  ...section.mediaCacheData,
                  file: section.mediaCacheData.file.filter(
                    (f) => f['@attributes'].src !== response.file,
                  ),
                };
                return { ...section, mediaCacheData: mediaCacheData };
              }),
            );
          }
        }),
      );
  }

  @Action(AddSiteSectionBackgroundFileAction)
  addSiteSectionBackgroundFile(
    { getState, setState }: StateContext<SiteSectionStateModel[]>,
    action: AddSiteSectionBackgroundFileAction,
  ) {
    const data = {
      path: `${action.site}/section/${action.section}`,
      value: action.file,
    };

    return this.fileUploadService.upload('siteSectionBackgrounds', data).pipe(
      tap((response) => {
        if (response.error_message) {
          // @TODO handle error message
          console.error(response.error_message);

          return response.error_message;
        } else {
          const state = getState();

          setState(
            state.map((section) => {
              if (
                section.site_name !== action.site ||
                section.name !== action.section
              ) {
                return section;
              }

              const newFile: SiteSectionBackgroundFile = {
                '@value': '',
                '@attributes': {
                  type: response.type,
                  src: response.filename,
                  width: response.width,
                  height: response.height,
                },
              };

              const mediaCacheData = {
                ...section.mediaCacheData,
                file: [
                  ...(section.mediaCacheData && section.mediaCacheData.file
                    ? section.mediaCacheData.file
                    : []),
                  newFile,
                ],
              };

              return {
                ...section,
                mediafolder: response.mediafolder,
                mediaCacheData: mediaCacheData,
              };
            }),
          );
        }
      }),
    );
  }

  @Action(UpdateSectionBackgroundFileAction)
  updateSectionBackgroundFile(
    { setState, getState }: StateContext<SiteSectionStateModel[]>,
    action: UpdateSectionBackgroundFileAction,
  ) {
    return this.appStateService
      .sync('siteSections', {
        path: action.path,
        value: action.payload,
      })
      .pipe(
        tap((response) => {
          if (response.error_message) {
            /* This should probably be handled in sync */
            console.error(response.error_message);
          } else {
            const state = getState();
            const path = action.path.split('/');
            const [currentSite, _, sectionOrder] = path;
            const siteName = currentSite === '0' ? '' : currentSite;

            setState(
              state.map((section) => {
                if (
                  section.site_name !== siteName ||
                  section.order !== parseInt(sectionOrder, 10)
                ) {
                  return section;
                }

                return assignByPath(
                  section,
                  path.slice(3).join('/'),
                  action.payload,
                );
              }),
            );
          }
        }),
      );
  }

  @Action(RenameSiteSectionAction)
  renameSiteSection(
    { getState, setState, dispatch }: StateContext<SiteSectionStateModel[]>,
    action: RenameSiteSectionAction,
  ) {
    const path =
      action.section.site_name + '/section/' + action.order + '/title';
    const data = {
      path: path,
      value: action.payload.title,
    };

    return this.appStateService.sync('siteSections', data).pipe(
      tap((response) => {
        if (response.error_message) {
          // @TODO handle error message
          console.error(response.error_message);
        } else {
          const state = getState();
          setState(
            state.map((section) => {
              if (
                section.site_name !== action.section.site_name ||
                section.order !== action.order
              ) {
                return section;
              }
              return {
                ...section,
                title: response.section.title,
                name: response.section.name,
              };
            }),
          );

          // Section related data rename
          dispatch(
            new RenameSectionTagsAction(
              action.section.site_name,
              action.section,
              response.section.name,
            ),
          );
          dispatch(
            new RenameSectionEntriesAction(
              action.section.site_name,
              action.section,
              response.section.name,
            ),
          );
        }
      }),
    );
  }

  @Action(RenameSiteSectionsSitenameAction)
  renameSiteSectionsSitename(
    { getState, setState }: StateContext<SiteSectionStateModel[]>,
    action: RenameSiteSectionsSitenameAction,
  ) {
    const state = getState();

    setState(
      state.map((section) => {
        if (section.site_name !== action.site.name) {
          return section;
        }
        return { ...section, ...{ site_name: action.siteName } };
      }),
    );
  }

  @Action(SwapContentsSitesSectionsAction)
  swapContentsSitesTags(
    { getState, setState }: StateContext<SiteSectionStateModel[]>,
    action: SwapContentsSitesSectionsAction,
  ) {
    const sections = getState();
    setState(
      sections.map((section) => {
        if (section.site_name === action.payload.siteSlugFrom) {
          return { ...section, site_name: action.payload.siteSlugTo };
        } else if (section.site_name === action.payload.siteSlugTo) {
          return { ...section, site_name: action.payload.siteSlugFrom };
        }
        return section;
      }),
    );
  }

  @Action(ReOrderSiteSectionsAction)
  reOrderSiteSections(
    { getState, setState }: StateContext<SiteSectionStateModel[]>,
    action: ReOrderSiteSectionsAction,
  ) {
    const siteName = this.store.selectSnapshot(AppState.getSite);
    const sectionsToSort = this.store.selectSnapshot(
      SiteSectionsState.getCurrentSiteSections,
    );
    const indexToSortBy =
      action.currentOrder < action.payload
        ? action.payload + 0.5
        : action.payload - 0.5;

    sectionsToSort.sort((sectionA, sectionB) => {
      if (
        sectionA.order !== action.currentOrder &&
        sectionB.order !== action.currentOrder
      ) {
        return sectionB.order > sectionA.order ? -1 : 1;
      } else if (sectionA.order === action.currentOrder) {
        return sectionB.order > indexToSortBy ? -1 : 1;
      } else if (sectionB.order === action.currentOrder) {
        return sectionA.order < indexToSortBy ? -1 : 1;
      }
    });

    return this.appStateService
      .sync(
        'siteSections',
        {
          site: siteName,
          sections: sectionsToSort.map((section) => section.name),
        },
        'PUT',
      )
      .pipe(
        tap((response) => {
          if (response.error_message) {
            // @TODO handle error message
            console.error(response.error_message);
          } else {
            const sites = getState();

            setState(
              sites.map((section) => {
                if (
                  (<string[]>response.sections).indexOf(section.name) === -1
                ) {
                  // The order of this section was not updated in this request
                  return section;
                }
                return {
                  ...section,
                  order: (<string[]>response.sections).indexOf(section.name),
                };
              }),
            );
          }
        }),
      );
  }

  @Action(DeleteSiteSectionAction)
  deleteSiteSection(
    { getState, setState, dispatch }: StateContext<SiteSectionStateModel[]>,
    action: DeleteSiteSectionAction,
  ) {
    const data = {
      site: action.section.site_name,
      section: action.section.name,
    };

    return this.appStateService.sync('siteSections', data, 'DELETE').pipe(
      tap((response) => {
        if (response.error_message) {
          // @TODO handle error message
          console.error(response.error_message);
        } else {
          /** @todo: considder triggering `DeleteSiteSectionsAction` to reduce action clutter */
          const state = getState();
          let order = -1;

          setState(
            state
              .filter(
                (section) =>
                  !(
                    section.site_name === response.site &&
                    section.name === response.name
                  ),
              )
              // Update order
              .map((section) => {
                if (section.site_name === response.site) {
                  order++;

                  if (section.order !== order) {
                    return { ...section, ...{ order: order } };
                  }
                }
                return section;
              }),
          );
          dispatch(new DeleteSectionTagsAction(action.section));
          dispatch(new DeleteSectionEntriesAction(action.section));
        }
      }),
    );
  }

  @Action(DeleteSiteSectionsAction)
  deleteSiteSections(
    { getState, setState }: StateContext<SiteSectionStateModel[]>,
    action: DeleteSiteSectionsAction,
  ) {
    const state = getState();
    setState(state.filter((section) => section.site_name !== action.siteName));
  }

  @Action(ResetSiteSectionsAction)
  resetSiteSections({ setState }: StateContext<SiteSectionStateModel[]>) {
    setState([]);
  }

  @Action(InitSiteSectionsAction)
  initSiteSections(
    { setState }: StateContext<SiteSectionStateModel[]>,
    action: InitSiteSectionsAction,
  ) {
    let sections = action.payload;

    if (action.payload instanceof Array) {
      sections = action.payload.map((section) => {
        if (!section['@attributes']) {
          section = { ...section, '@attributes': {} };
        }
        if (!section['@attributes']['type']) {
          section['@attributes'] = {
            ...section['@attributes'],
            type: 'default',
          };
        }
        return section;
      });
    }

    setState(sections);
  }
}
