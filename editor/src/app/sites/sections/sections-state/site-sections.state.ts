import { State, Action, StateContext, Selector, NgxsOnInit  } from '@ngxs/store';
import { SiteSectionStateModel } from './site-sections-state.model';
import { AppStateService } from '../../../app-state/app-state.service';
import { take } from 'rxjs/operators';
import { AppState } from '../../../app-state/app.state';
import { UpdateSiteSection, DeleteSiteSections } from './site-sections.actions';

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

  constructor(private appStateService: AppStateService) {}

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

  @Action(UpdateSiteSection)
  updateSiteSection({ getState, setState }: StateContext<SiteSectionStateModel[]>, action) {
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

  @Action(DeleteSiteSections)
  deleteSiteSections({ getState, setState }: StateContext<SiteSectionStateModel[]>, action: DeleteSiteSections) {
    const state = getState();
    setState(
      state.filter(section => section.site_name !== action.siteName)
    );
  }
}
