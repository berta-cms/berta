import { get } from 'lodash';
import { Store, State, Action, StateContext, Selector, NgxsOnInit  } from '@ngxs/store';
import { SiteSectionStateModel } from './site-sections-state.model';
import { AppStateService } from '../../../app-state/app-state.service';
import { take } from 'rxjs/operators';
import { AppState } from '../../../app-state/app.state';
import {
  UpdateSiteSectionAction,
  DeleteSiteSectionsAction,
  RenameSiteSectionsSitenameAction,
  DeleteSiteSectionAction,
  CreateSectionAction,
  CloneSectionAction,
  RenameSiteSectionAction,
  AddSiteSectionsAction} from './site-sections.actions';
import { DeleteSectionTagsAction, RenameSectionTagsAction, AddSectionTagsAction } from '../tags/section-tags.actions';
import {
  DeleteSectionEntriesAction,
  RenameSectionEntriesAction,
  AddSectionEntriesAction } from '../entries/entries-state/section-entries.actions';
import { slugify } from '../../../shared/helpers';

@State<SiteSectionStateModel[]>({
  name: 'siteSections',
  defaults: []
})
export class SiteSectionsState implements NgxsOnInit {

  @Selector([AppState])
  static getCurrentSiteSections(state, appState) {
    return state.filter(section => {
      return section.site_name === appState.site;
    });
  }

  constructor(private appStateService: AppStateService,
              private store: Store) {
  }

  ngxsOnInit({ setState }: StateContext<SiteSectionStateModel[]>) {
    this.appStateService.getInitialState('', 'site_sections').pipe(take(1)).subscribe((sections) => {
      if (sections instanceof Array) {
        sections = sections.map(section => {
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
    });
  }

  @Action(CreateSectionAction)
  createSection({ getState, setState }: StateContext<SiteSectionStateModel[]>, action: CreateSectionAction) {
    const siteName = this.store.selectSnapshot(AppState.getSite);
    const data = {
      name: action.section ? action.section.name : null,
      site: siteName,
      title: action.section ? action.section.title : null,
    };

    this.appStateService.sync('siteSections', data, 'POST')
      .then((response: any) => {
        if (response.error_message) {
          // @TODO handle error message
          console.error(response.error_message);
        } else {
          const state = getState();
          const newSiteSection: SiteSectionStateModel = response.section;

          setState(
            [...state, newSiteSection]
          );

          if (response.entries && response.entries.length) {
            this.store.dispatch(new AddSectionEntriesAction(siteName, response.entries));
          }

          if (response.tags && response.tags) {
            this.store.dispatch(new AddSectionTagsAction(siteName, response.tags));
          }
      }
    });
  }

  @Action(AddSiteSectionsAction)
  addSiteSections({ getState, setState }: StateContext<SiteSectionStateModel[]>, action: AddSiteSectionsAction) {
    const state = getState();
    setState(
      [...state, ...action.sections]
    );
  }

  @Action(CloneSectionAction)
  cloneSection({ getState, setState }: StateContext<SiteSectionStateModel[]>, action: CloneSectionAction) {
    this.store.dispatch(new CreateSectionAction(action.section));
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

    this.appStateService.sync('siteSections', data)
      .then((response: any) => {
        if (response.error_message) {
          // @TODO handle error message
          console.error(response.error_message);
        } else {
          const state = getState();

          if (field === 'title') {
            action.payload.name = response.section.name;
          }

          setState(state.map(section => {
            if (section.site_name !== action.section.site_name || section.order !== action.order) {
              return section;
            }
            /* Quick workaround for deep settings: */
            if (action.payload['@attributes']) {
              /** @todo rebuild this recursive */
              const attributes = {...section['@attributes'], ...action.payload['@attributes']};
              return {...section, ...action.payload, ...{'@attributes': attributes}};
            }
            return {...section, ...action.payload};  // Deep set must be done here for complex properties
          }));

          // Section related data rename
          if (field === 'title') {
            this.store.dispatch(new RenameSectionTagsAction(action.section.site_name, action.section, response.section.name));
            this.store.dispatch(new RenameSectionEntriesAction(action.section.site_name, action.section, response.section.name));
          }
        }
      });
  }

  @Action(RenameSiteSectionAction)
  renameSiteSection({ getState, setState }: StateContext<SiteSectionStateModel[]>, action: RenameSiteSectionAction) {
    this.store.dispatch(new UpdateSiteSectionAction(action.section, action.order, action.payload));
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
  deleteSiteSection({ getState, setState }: StateContext<SiteSectionStateModel[]>, action: DeleteSiteSectionAction) {
    const data = {
      site: action.section.site_name,
      section: action.section.name
    };

    this.appStateService.sync('siteSections', data, 'DELETE')
      .then((response: any) => {
        if (response.error_message) {
          // @TODO handle error message
          console.error(response.error_message);
        } else {
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
                    return {...section, ...{'order': order}};
                  }
                }
                return section;
              })
          );
          this.store.dispatch(new DeleteSectionTagsAction(action.section));
          this.store.dispatch(new DeleteSectionEntriesAction(action.section));
      }
    });
  }

  @Action(DeleteSiteSectionsAction)
  deleteSiteSections({ getState, setState }: StateContext<SiteSectionStateModel[]>, action: DeleteSiteSectionsAction) {
    const state = getState();
    setState(
      state.filter(section => section.site_name !== action.siteName)
    );
  }
}
