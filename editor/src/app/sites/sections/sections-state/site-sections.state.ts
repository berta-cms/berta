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
    const state = getState();
    if (!state.some(section => section.site_name === action.siteName && section.order === action.order)) {
      console.log('section not found!!!', action);
      return;
    }

    setState(state.map(section => {
      if (section.site_name !== action.siteName || section.order !== action.order) {
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
  }

  @Action(RenameSiteSectionAction)
  renameSiteSection({ getState, setState }: StateContext<SiteSectionStateModel[]>, action: RenameSiteSectionAction) {

    // @todo sync and validate from server
    // @todo return new section name from server (unique and slugified)
    action.payload.name = slugify(action.payload.title);

    this.store.dispatch(new UpdateSiteSectionAction(action.section.site_name, action.order, action.payload));
    this.store.dispatch(new RenameSectionTagsAction(action.section, action.payload.name));
    this.store.dispatch(new RenameSectionEntriesAction(action.section, action.payload.name));
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
