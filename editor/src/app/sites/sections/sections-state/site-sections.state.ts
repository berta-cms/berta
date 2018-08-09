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
  CreateSectionAction} from './site-sections.actions';
import { DeleteSectionTagsAction } from '../tags/section-tags.actions';
import { DeleteSectionEntriesAction } from '../entries/entries-state/section-entries.actions';

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
    const state = getState();
    const site = this.store.selectSnapshot(AppState.getSite);

    // @todo sync with backend and return section data
    if (action.section) {
      // clone section, pass section to backend for cloning
    }

    const newSection: SiteSectionStateModel = {
      // @todo get unique name from backend
      name: 'untitled-' + Math.random().toString(36).substr(2, 9),
      title: '',
      site_name: site,
      order: state.filter(section => section.site_name === site).length,
      '@attributes': {
        published: 1,
        tags_behavior: 'invisible'
      }
    };

    setState(
      [...state, newSection]
    );

    // @todo add cloned section entries and tags if exists
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
    const state = getState();
    let order = -1;

    setState(
      state
        .filter(section => !(section.site_name === action.section.site_name && section.name === action.section.name))
        // Update order
        .map(section => {
          if (section.site_name === action.section.site_name) {
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

  @Action(DeleteSiteSectionsAction)
  deleteSiteSections({ getState, setState }: StateContext<SiteSectionStateModel[]>, action: DeleteSiteSectionsAction) {
    const state = getState();
    setState(
      state.filter(section => section.site_name !== action.siteName)
    );
  }
}
