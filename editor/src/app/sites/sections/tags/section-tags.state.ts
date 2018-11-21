import { concat } from 'rxjs';
import { take, switchMap, tap } from 'rxjs/operators';
import { State, Action, StateContext, NgxsOnInit, Actions, ofActionSuccessful, Selector } from '@ngxs/store';

import { AppState } from '../../../../app/app-state/app.state';
import { AppStateService } from '../../../app-state/app-state.service';
import { SectionTagsStateModel } from './section-tags-state.model';
import {
  DeleteSiteSectionsTagsAction,
  RenameSectionTagsSitenameAction,
  DeleteSectionTagsAction,
  RenameSectionTagsAction,
  AddSiteSectionsTagsAction,
  AddSectionTagsAction,
  ResetSiteSectionsTagsAction,
  InitSiteSectionsTagsAction,
  UpdateSectionTagsAction,
  OrderSectionTagsFromSyncAction} from './section-tags.actions';
import { UserLoginAction } from '../../../user/user.actions';


@State<SectionTagsStateModel>({
  name: 'sectionTags',
  defaults: {}
})
export class SectionTagsState implements NgxsOnInit {

  @Selector([AppState.getSite])
  static getCurrentSiteTags(state, site) {
    return state[site] ? state[site].section : [];
  }

  constructor(
    private actions$: Actions,
    private appStateService: AppStateService) {}

  ngxsOnInit({ dispatch }: StateContext<SectionTagsStateModel>) {
    concat(
      this.appStateService.getInitialState('', 'section_tags').pipe(take(1)),
      this.actions$.pipe(ofActionSuccessful(UserLoginAction), switchMap(() => {
        return this.appStateService.getInitialState('', 'section_tags').pipe(take(1));
      }))
    )
    .subscribe((sectionTags) => {
      dispatch(new InitSiteSectionsTagsAction(sectionTags));
    });
  }

  @Action(UpdateSectionTagsAction)
  updateSectionTags({ getState, patchState }: StateContext<SectionTagsStateModel>, action: UpdateSectionTagsAction) {
    const state = getState();

    if (!action.tags) {
      return;
    }

    if (state[action.siteName]) {
      patchState({
        [action.siteName]: {
          ...state[action.siteName],
          section: state[action.siteName].section.some(section => section['@attributes'].name === action.sectionName) ?
            state[action.siteName].section.map(section => {
              if (section['@attributes'].name === action.sectionName) {
                return action.tags;
              }
              return section;
            })
            :
            [...state[action.siteName].section, action.tags]
        }
      });
    } else {
      patchState({
        [action.siteName]: {
            section: [action.tags]
        }
      });
    }
  }

  @Action(RenameSectionTagsAction)
  renameSectionTags({ patchState, getState }: StateContext<SectionTagsStateModel>, action: RenameSectionTagsAction) {
    const state = getState();

    if (!state[action.section.site_name] || !state[action.section.site_name].section) {
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
  deleteSectionTags({ getState, patchState }: StateContext<SectionTagsStateModel>, action: DeleteSectionTagsAction) {
    const state = getState();

    if (!state[action.section.site_name] || !state[action.section.site_name].section) {
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
  deleteSiteSectionsTags({ getState, setState }: StateContext<SectionTagsStateModel>, action: DeleteSiteSectionsTagsAction) {
    const newState = {...getState()};
    delete newState[action.siteName];
    setState(newState);
  }

  @Action(ResetSiteSectionsTagsAction)
  resetSectionTags({ setState }: StateContext<SectionTagsStateModel>) {
    setState({});
  }

  @Action(InitSiteSectionsTagsAction)
  initSectionTags({ setState }: StateContext<SectionTagsStateModel>, action: InitSiteSectionsTagsAction) {
    setState(action.payload);
  }

  @Action(OrderSectionTagsFromSyncAction)
  orderSectionTagsFromSync({ getState, patchState }: StateContext<SectionTagsStateModel>, action: OrderSectionTagsFromSyncAction) {
    return this.appStateService.sync('sectionTags', {
      site: action.site,
      section: action.section,
      tag: action.tag,
      value: action.value
    }, 'PUT').pipe(
      tap(response => {
        if (response.error_message) {
          /* This should probably be handled in sync */
          console.error(response.error_message);
        } else {
          const currentState = getState();

          patchState({
            [action.site]: {section: currentState[action.site].section.map(section => {
              if (section['@attributes'].name !== action.section) {
                return section;
              }
              return {...section, tag: section.tag.map(tag => {
                return {...tag, order: response.order.indexOf(tag['@attributes'].name)};
              })};
            })}
          });
        }
      })
    );
  }
}
