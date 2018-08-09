import { cloneDeep, map as _map } from 'lodash';
import { State, Action, StateContext, Selector, NgxsOnInit  } from '@ngxs/store';

import { AppStateService } from '../../../app-state/app-state.service';
import { take } from 'rxjs/operators';
import { SectionTagsStateModel } from './section-tags-state.model';
import { DeleteSiteSectionsTagsAction, RenameSectionTagsSitenameAction, DeleteSectionTagsAction } from './section-tags.actions';

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
    const newState = cloneDeep(state);
    const keyVal = newState[action.site.name];
    delete newState[action.site.name];
    newState[action.siteName] = keyVal;
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
    const state = getState();
    const res = Object.assign({}, state);
    delete res[action.siteName];
    setState(res);
  }
}
