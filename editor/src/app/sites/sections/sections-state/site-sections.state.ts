import { State, Action, StateContext, Selector, NgxsOnInit  } from '@ngxs/store';
import { SiteSectionStateModel } from './site-sections-state.model';
import { AppStateService } from '../../../app-state/app-state.service';
import { take } from 'rxjs/operators';
import { AppState } from '../../../app-state/app.state';

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
}
