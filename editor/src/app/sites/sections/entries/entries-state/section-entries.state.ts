import { cloneDeep } from 'lodash';
import { State, Action, StateContext, Selector, NgxsOnInit  } from '@ngxs/store';
import { take } from 'rxjs/operators';

import { AppStateService } from '../../../../app-state/app-state.service';
import { SectionEntriesStateModel } from './section-entries-state.model';
import { DeleteSiteSectionsEntriesAction, RenameSectionEntriesSitenameAction } from './section-entries.actions';

@State<SectionEntriesStateModel>({
  name: 'sectionEntries',
  defaults: {}
})
export class SectionEntriesState implements NgxsOnInit {
  constructor(private appStateService: AppStateService) {}
  ngxsOnInit({ setState }: StateContext<SectionEntriesStateModel>) {
    this.appStateService.getInitialState('', 'sectionEntries').pipe(take(1)).subscribe((sections) => {
      setState(sections);
    });
  }

  @Action(RenameSectionEntriesSitenameAction)
  renameSectionEntriesSitename({ setState, getState }: StateContext<SectionEntriesStateModel>, action: RenameSectionEntriesSitenameAction) {
    const state = getState();
    const newState = cloneDeep(state);
    const keyVal = newState[action.site.name];
    delete newState[action.site.name];
    newState[action.siteName] = keyVal;
    setState(newState);
  }

  @Action(DeleteSiteSectionsEntriesAction)
  deleteSiteSectionsEntries({ getState, setState }: StateContext<SectionEntriesStateModel[]>, action: DeleteSiteSectionsEntriesAction) {
    const state = getState();
    const res = Object.assign({}, state);
    delete res[action.siteName];
    setState(res);
  }
}
