import { take } from 'rxjs/operators';
import { State, Action, StateContext, NgxsOnInit } from '@ngxs/store';

import { AppStateService } from '../../../app-state/app-state.service';
import { SectionTagsStateModel } from './section-tags-state.model';
import { DeleteSiteSectionsTagsAction, RenameSectionTagsSitenameAction } from './section-tags.actions';

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

  @Action(DeleteSiteSectionsTagsAction)
  deleteSiteSectionsTags({ getState, setState }: StateContext<SectionTagsStateModel[]>, action: DeleteSiteSectionsTagsAction) {
    const newState = {...getState()};
    delete newState[action.siteName];
    setState(newState);
  }
}
