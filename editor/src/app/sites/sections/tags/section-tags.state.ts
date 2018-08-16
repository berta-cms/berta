import { take } from 'rxjs/operators';
import { State, Action, StateContext, NgxsOnInit } from '@ngxs/store';

import { AppStateService } from '../../../app-state/app-state.service';
import { SectionTagsStateModel } from './section-tags-state.model';
import {
  DeleteSiteSectionsTagsAction,
  RenameSectionTagsSitenameAction,
  DeleteSectionTagsAction,
  RenameSectionTagsAction,
  AddSiteSectionsTagsAction,
  AddSectionTagsAction} from './section-tags.actions';

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
  renameSectionTags({ patchState, getState }: StateContext<SectionTagsStateModel>, action: RenameSectionTagsAction) {
    const state = getState();

    if (!state[action.section.site_name].section) {
      return;
    }

    patchState({
      [action.section.site_name]: {
        ...state[action.section.site_name],
        section: state[action.section.site_name].section.map(section => {

          if (section['@attributes'].name === action.section.name) {
            return {
              ...section,
              '@attributes': {
                ...section['@attributes'],
                name: action.newSectionName
              }
            };

          }
          return section;
        })
      }
    });
  }

  @Action(AddSectionTagsAction)
  addSectionTags({ patchState, getState }: StateContext<SectionTagsStateModel>, action: AddSectionTagsAction) {
    const state = getState();
    const newTags = {};

    if (state[action.siteName]) {
      newTags[action.siteName] = {section: state[action.siteName]['section'].concat(action.tags)};
    } else {
      newTags[action.siteName] = {section: action.tags};
    }
    patchState({...state, ...newTags});
  }

  @Action(AddSiteSectionsTagsAction)
  addSiteSectionsTags({ patchState, getState }: StateContext<SectionTagsStateModel>, action: AddSiteSectionsTagsAction) {
    const currentState = getState();
    const newTags = {};
    newTags[action.site.name] = action.tags;
    patchState({...currentState, ...newTags});
  }

  @Action(RenameSectionTagsSitenameAction)
  renameSectionTagsSitename({ setState, getState }: StateContext<SectionTagsStateModel>, action: RenameSectionTagsSitenameAction) {
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
  deleteSectionTags({ getState, patchState }: StateContext<SectionTagsStateModel[]>, action: DeleteSectionTagsAction) {
    const state = getState();

    if (!state[action.section.site_name].section) {
      return;
    }

    patchState({
      [action.section.site_name]: {
        ...state[action.section.site_name],
        section: state[action.section.site_name].section.filter(section => {
          return section['@attributes']['name'] !== action.section.name;
        })
      }
    });
  }

  @Action(DeleteSiteSectionsTagsAction)
  deleteSiteSectionsTags({ getState, setState }: StateContext<SectionTagsStateModel[]>, action: DeleteSiteSectionsTagsAction) {
    const newState = {...getState()};
    delete newState[action.siteName];
    setState(newState);
  }
}
