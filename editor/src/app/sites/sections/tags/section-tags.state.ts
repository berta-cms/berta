import { take } from 'rxjs/operators';
import { State, Action, StateContext, NgxsOnInit } from '@ngxs/store';

import { AppStateService } from '../../../app-state/app-state.service';
import { SectionTagsStateModel } from './section-tags-state.model';
import {
  DeleteSiteSectionsTagsAction,
  RenameSectionTagsSitenameAction,
  DeleteSectionTagsAction,
  RenameSectionTagsAction } from './section-tags.actions';

@State<SectionTagsStateModel>({
  name: 'sectionTags',
  defaults: {}
})
export class SectionTagsState implements NgxsOnInit {
  constructor(private appStateService: AppStateService) {}
  ngxsOnInit({ setState }: StateContext<SectionTagsStateModel>) {
    this.appStateService.getInitialState('', 'section_tags').pipe(take(1)).subscribe((sections) => {
      setState(sections);
    });
  }

  @Action(RenameSectionTagsAction)
  renameSectionTags({ setState, getState }: StateContext<SectionTagsStateModel>, action: RenameSectionTagsAction) {
    const state = getState();
    const newState = cloneDeep(state);

    Object.keys(newState).map(siteName => {
      if (siteName === action.section.site_name && newState[siteName]['section']) {
        newState[siteName]['section'] = newState[siteName]['section'].map(section => {
          if (section['@attributes']['name'] === action.section.name) {
            section['@attributes']['name'] = action.newSectionName;
          }
          return section;
        });
      }
    });

    setState(newState);
  }

  @Action(RenameSectionTagsSitenameAction)
  renameSiteSettingsSitename({ setState, getState }: StateContext<SectionTagsStateModel>, action: RenameSectionTagsSitenameAction) {
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

  @Action(DeleteSectionTagsAction)
  deleteSectionTags({ getState, setState }: StateContext<SectionTagsStateModel[]>, action: DeleteSectionTagsAction) {
    const state = getState();
    const newState = cloneDeep(state);

    Object.keys(newState).map(siteName => {
      if (siteName === action.section.site_name && newState[siteName]['section']) {
        newState[siteName]['section'] = newState[siteName]['section'].filter(section => {
          return section['@attributes']['name'] !== action.section.name;
        });
      }
    });

    setState(newState);
  }

  @Action(DeleteSiteSectionsTagsAction)
  deleteSiteSectionsTags({ getState, setState }: StateContext<SectionTagsStateModel[]>, action: DeleteSiteSectionsTagsAction) {
    const newState = {...getState()};
    delete newState[action.siteName];
    setState(newState);
  }
}
