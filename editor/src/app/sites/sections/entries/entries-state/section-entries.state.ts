import { cloneDeep } from 'lodash';
import { State, Action, StateContext, Selector, NgxsOnInit  } from '@ngxs/store';
import { take } from 'rxjs/operators';

import { AppStateService } from '../../../../app-state/app-state.service';
import { SectionEntriesStateModel } from './section-entries-state.model';
import {
  DeleteSiteSectionsEntriesAction,
  RenameSectionEntriesSitenameAction,
  DeleteSectionEntriesAction,
  RenameSectionEntriesAction,
  AddSiteEntriesAction,
  AddSectionEntriesAction} from './section-entries.actions';

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

  @Action(AddSectionEntriesAction)
  addSectionEntries({ patchState, getState }: StateContext<SectionEntriesStateModel>, action: AddSectionEntriesAction) {
    const state = getState();
    patchState({[action.siteName]: [...state[action.siteName], ...action.entries]});
  }

  @Action(AddSiteEntriesAction)
  addSiteEntries({ patchState, getState }: StateContext<SectionEntriesStateModel>, action: AddSiteEntriesAction) {
    const currentState   = getState();
    const newEntries = {};
    newEntries[action.site.name] = action.entries;
    patchState({...currentState, ...newEntries});
  }

  @Action(RenameSectionEntriesAction)
  renameSectionEntries({ setState, getState }: StateContext<SectionEntriesStateModel>, action: RenameSectionEntriesAction) {
    const state = getState();
    const newState = cloneDeep(state);

    Object.keys(newState).map(siteName => {
      if (siteName === action.section.site_name) {
        newState[siteName] = newState[siteName].map(entry => {
          if (entry.sectionName === action.section.name) {
            entry.sectionName = action.newSectionName;
          }
          return entry;
        });
      }
    });

    setState(newState);
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
    const state = getState();
    const res = Object.assign({}, state);
    delete res[action.siteName];
    setState(res);
  }
}
