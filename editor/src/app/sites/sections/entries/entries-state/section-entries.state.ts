import { State, Action, StateContext, NgxsOnInit } from '@ngxs/store';
import { take } from 'rxjs/operators';

import { AppStateService } from '../../../../app-state/app-state.service';
import { SectionEntriesStateModel } from './section-entries-state.model';
import {
  DeleteSiteSectionsEntriesAction,
  RenameSectionEntriesSitenameAction,
  DeleteSectionEntriesAction,
  RenameSectionEntriesAction } from './section-entries.actions';

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

  @Action(RenameSectionEntriesAction)
  renameSectionEntries({ patchState, getState }: StateContext<SectionEntriesStateModel>, action: RenameSectionEntriesAction) {
    const state = getState();

    patchState({
      [action.section.site_name]: state[action.section.site_name].map(entry => {

        if (entry.sectionName === action.section.name) {
          entry.sectionName = action.newSectionName;
        }
        return entry;
      })
    });
  }

  @Action(RenameSectionEntriesSitenameAction)
  renameSectionEntriesSitename({ setState, getState }: StateContext<SectionEntriesStateModel>, action: RenameSectionEntriesSitenameAction) {
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

  @Action(DeleteSectionEntriesAction)
  deleteSectionEntries({ setState, getState }: StateContext<SectionEntriesStateModel>, action: DeleteSectionEntriesAction) {
    const state = getState();
    const newState = cloneDeep(state);

    Object.keys(newState).map(siteName => {
      if (siteName === action.section.site_name) {
        newState[siteName] = newState[siteName].filter(entry => {
          return entry.sectionName !== action.section.name;
        });
      }
    });

    setState(newState);
  }

  @Action(DeleteSiteSectionsEntriesAction)
  deleteSiteSectionsEntries({ getState, setState }: StateContext<SectionEntriesStateModel[]>, action: DeleteSiteSectionsEntriesAction) {
    const newState = {...getState()};
    delete newState[action.siteName];
    setState(newState);
  }
}
