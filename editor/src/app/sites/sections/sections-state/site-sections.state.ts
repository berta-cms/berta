import { get } from 'lodash';
import { concat } from 'rxjs';
import { take, switchMap, tap } from 'rxjs/operators';
import { Store, State, Action, StateContext, Selector, NgxsOnInit, Actions, ofActionSuccessful } from '@ngxs/store';

import { assignByPath } from 'src/app/shared/helpers';
import { SiteSectionStateModel } from './site-sections-state.model';
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
  UpdateSiteSectionBackgroundFromSyncAction} from './site-sections.actions';
import { DeleteSectionTagsAction, RenameSectionTagsAction, AddSectionTagsAction } from '../tags/section-tags.actions';
import {
  DeleteSectionEntriesAction,
  RenameSectionEntriesAction,
  AddSectionEntriesAction } from '../entries/entries-state/section-entries.actions';
import { UserLoginAction } from '../../../user/user.actions';


@State<SiteSectionStateModel[]>({
  name: 'siteSections',
  defaults: []
})
export class SiteSectionsState implements NgxsOnInit {

  @Selector([AppState.getSite])
  static getCurrentSiteSections(state, site) {
    return state.filter(section => {
      return section.site_name === site;
    });
  }

  constructor(private appStateService: AppStateService,
              private actions$: Actions,
              private store: Store) {
  }

  ngxsOnInit({ dispatch }: StateContext<SiteSectionStateModel[]>) {
    concat(
      this.appStateService.getInitialState('', 'site_sections').pipe(take(1)),
      this.actions$.pipe(ofActionSuccessful(UserLoginAction), switchMap(() => {
        return this.appStateService.getInitialState('', 'site_sections').pipe(take(1));
      }))
    )
    .subscribe((sections) => {
      dispatch(new InitSiteSectionsAction(sections));
    });
  }

  @Action(CreateSectionAction)
  createSection({ getState, setState, dispatch }: StateContext<SiteSectionStateModel[]>, action: CreateSectionAction) {
    const siteName = this.store.selectSnapshot(AppState.getSite);
    const data = {
      name: action.section ? action.section.name : null,
      site: siteName,
      title: action.section ? action.section.title : null,
    };

    return this.appStateService.sync('siteSections', data, 'POST').pipe(
      tap(response => {
        if (response.error_message) {
          // @TODO handle error message
          console.error(response.error_message);
        } else {
          const state = getState();
          const newSiteSection: SiteSectionStateModel = response.section;

          /** @todo: possibly trigger AddSiteSectionsAction to decrease action clutter */
          setState(
            [...state, newSiteSection]
          );

          if (response.entries && response.entries.length) {
            dispatch(new AddSectionEntriesAction(siteName, response.entries));
          }

          if (response.tags && response.tags) {
            dispatch(new AddSectionTagsAction(siteName, response.tags));
          }
        }
      })
    );
  }

  @Action(AddSiteSectionsAction)
  addSiteSections({ getState, setState }: StateContext<SiteSectionStateModel[]>, action: AddSiteSectionsAction) {
    const state = getState();
    setState(
      [...state, ...action.sections]
    );
  }

  @Action(CloneSectionAction)
  cloneSection({ dispatch }: StateContext<SiteSectionStateModel[]>, action: CloneSectionAction) {
    dispatch(new CreateSectionAction(action.section));
  }

  @Action(UpdateSiteSectionAction)
  updateSiteSection({ getState, setState }: StateContext<SiteSectionStateModel[]>, action: UpdateSiteSectionAction) {
    // @todo rewite this path lookup from payload
    const fieldKeys = [Object.keys(action.payload)[0]];
    if (action.payload[fieldKeys[0]] instanceof Object) {
      fieldKeys.push(Object.keys(action.payload[fieldKeys[0]])[0]);
    }
    const field = fieldKeys.join('/');
    const path = action.section.site_name + '/section/' + action.order + '/' + field;
    const value = get(action.payload, fieldKeys.join('.'));

    const data = {
      path: path,
      value: value
    };

    return this.appStateService.sync('siteSections', data).pipe(
      tap(response => {
        if (response.error_message) {
          // @TODO handle error message
          console.error(response.error_message);
        } else {
          const state = getState();
          setState(state.map(section => {
            if (section.site_name !== action.section.site_name || section.order !== action.order) {
              return section;
            }
            /* Quick workaround for deep settings: */
            if (action.payload['@attributes']) {
              /** @todo rebuild this recursive */
              const attributes = { ...section['@attributes'], ...action.payload['@attributes'] };
              return { ...section, ...action.payload, ...{ '@attributes': attributes } };
            }
            return { ...section, ...action.payload };  // Deep set must be done here for complex properties
          }));
        }
      })
    );
  }

  @Action(UpdateSiteSectionFromSyncAction)
  updateSiteSettingsFromSync({setState, getState}: StateContext<SiteSectionStateModel[]>, action: UpdateSiteSectionFromSyncAction) {
    return this.appStateService.sync('siteSections', {
      path: action.path,
      value: action.payload
    }).pipe(
      tap(response => {
        if (response.error_message) {
          /* This should probably be handled in sync */
          console.error(response.error_message);
        } else {
          const state = getState();
          const path = action.path.split('/');
          const [currentSite, _, sectionOrder] = path;
          const siteName = currentSite === '0' ? '' : currentSite;

          setState(state.map(section => {
            if (section.site_name !== siteName || section.order !== parseInt(sectionOrder, 10)) {
              return section;
            }

            return assignByPath(section, path.slice(3).join('/'), action.payload);
          }));
        }
      })
    );
  }

  @Action(UpdateSiteSectionBackgroundFromSyncAction)
  updateSiteSectionBackgroundFromSync({ getState, setState }: StateContext<SiteSectionStateModel[]>,
                                      action: UpdateSiteSectionBackgroundFromSyncAction) {
    return this.appStateService.sync('siteSectionBackgrounds', {
      site: action.site,
      section: action.section,
      files: action.files
      },
      'PUT'
    ).pipe(
      tap(response => {
        if (response.error_message) {
          // @TODO handle error message
          console.error(response.error_message);
        } else {
          const state = getState();

          setState(state.map(section => {
            if (section.site_name !== action.site || section.name !== action.section) {
              return section;
            }

            const mediaCacheData = { ...section.mediaCacheData, file: response.files };
            return { ...section, mediafolder: response.mediafolder, mediaCacheData: mediaCacheData };
          }));
        }
      })
    );
  }

  @Action(RenameSiteSectionAction)
  renameSiteSection({ getState, setState, dispatch }: StateContext<SiteSectionStateModel[]>, action: RenameSiteSectionAction) {
    const path = action.section.site_name + '/section/' + action.order + '/title';
    const data = {
      path: path,
      value: action.payload.title
    };

    return this.appStateService.sync('siteSections', data).pipe(
      tap(response => {
        if (response.error_message) {
          // @TODO handle error message
          console.error(response.error_message);
        } else {
          const state = getState();
          setState(state.map(section => {
            if (section.site_name !== action.section.site_name || section.order !== action.order) {
              return section;
            }
            return { ...section, title: response.section.title, name: response.section.name };
          }));

          // Section related data rename
          dispatch(new RenameSectionTagsAction(action.section.site_name, action.section, response.section.name));
          dispatch(new RenameSectionEntriesAction(action.section.site_name, action.section, response.section.name));
        }
      })
    );
  }

  @Action(RenameSiteSectionsSitenameAction)
  renameSiteSectionsSitename({ getState, setState }: StateContext<SiteSectionStateModel[]>, action: RenameSiteSectionsSitenameAction) {
    const state = getState();

    setState(
      state.map(section => {
        if (section.site_name !== action.site.name) {
          return section;
        }
        return {...section, ...{'site_name': action.siteName}};
      })
    );
  }

  @Action(DeleteSiteSectionAction)
  deleteSiteSection({ getState, setState, dispatch }: StateContext<SiteSectionStateModel[]>, action: DeleteSiteSectionAction) {
    const data = {
      site: action.section.site_name,
      section: action.section.name
    };

    return this.appStateService.sync('siteSections', data, 'DELETE').pipe(
      tap(response => {
        if (response.error_message) {
          // @TODO handle error message
          console.error(response.error_message);
        } else {
          /** @todo: considder triggering `DeleteSiteSectionsAction` to reduce action clutter */
          const state = getState();
          let order = -1;

          setState(
            state
              .filter(section => !(section.site_name === response.site && section.name === response.name))
              // Update order
              .map(section => {
                if (section.site_name === response.site) {
                  order++;

                  if (section.order !== order) {
                    return { ...section, ...{ 'order': order } };
                  }
                }
                return section;
              })
          );
          dispatch(new DeleteSectionTagsAction(action.section));
          dispatch(new DeleteSectionEntriesAction(action.section));
        }
      })
    );
  }

  @Action(DeleteSiteSectionsAction)
  deleteSiteSections({ getState, setState }: StateContext<SiteSectionStateModel[]>, action: DeleteSiteSectionsAction) {
    const state = getState();
    setState(
      state.filter(section => section.site_name !== action.siteName)
    );
  }

  @Action(ResetSiteSectionsAction)
  resetSiteSections({ setState }: StateContext<SiteSectionStateModel[]>) {
    setState([]);
  }

  @Action(InitSiteSectionsAction)
  initSiteSections({ setState }: StateContext<SiteSectionStateModel[]>, action: InitSiteSectionsAction) {
    let sections = action.payload;

    if (action.payload instanceof Array) {
      sections = action.payload.map(section => {
        if (!section['@attributes']) {
          section = {...section, '@attributes': {}};
        }
        if (!section['@attributes']['type']) {
          section['@attributes'] = {...section['@attributes'], 'type': 'default'};
        }
        return section;
      });
    }

    setState(sections);
  }
}
