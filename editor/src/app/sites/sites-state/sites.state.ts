import { set } from 'lodash/fp';
import { State, Action, StateContext, NgxsOnInit } from '@ngxs/store';
import { SiteStateModel } from './site-state.model';
import { AppStateService } from '../../app-state/app-state.service';
import { take } from 'rxjs/operators';
import { CreateSiteAction, DeleteSiteAction, CloneSiteAction, UpdateSiteAction, RenameSiteAction } from './sites.actions';
import {
  DeleteSiteSectionsAction,
  RenameSiteSectionsSitenameAction,
  AddSiteSectionsAction } from '../sections/sections-state/site-sections.actions';
import { DeleteSiteSettingsAction, RenameSiteSettingsSitenameAction, CreateSiteSettingsAction } from '../settings/site-settings.actions';
import {
  DeleteSiteTemplateSettingsAction,
  RenameSiteTemplateSettingsSitenameAction,
  CreateSiteTemplateSettingsAction} from '../template-settings/site-template-settings.actions';
import {
  DeleteSiteSectionsTagsAction,
  RenameSectionTagsSitenameAction,
  AddSiteSectionsTagsAction } from '../sections/tags/section-tags.actions';
import {
  DeleteSiteSectionsEntriesAction,
  RenameSectionEntriesSitenameAction,
  AddSiteEntriesAction} from '../sections/entries/entries-state/section-entries.actions';

@State<SiteStateModel[]>({
  name: 'sites',
  defaults: []
})
export class SitesState implements NgxsOnInit {

  constructor(private appStateService: AppStateService) {
  }


  ngxsOnInit({ setState }: StateContext<SiteStateModel[]>) {
    this.appStateService.getInitialState('', 'sites').pipe(take(1)).subscribe({
      next: (response) => {
        setState(response as SiteStateModel[]);
      },
      error: (error) => console.error(error)
    });
  }


  @Action(CreateSiteAction)
  createSite({ setState, getState, dispatch }: StateContext<SiteStateModel[]>, action: CreateSiteAction) {
    const siteName = action.site ? (action.site.name === '' ? '0' : action.site.name) : '-1';
    this.appStateService.sync('sites', { site: siteName }, 'POST')
      .subscribe(response => {
        if (response.error_message) {
          // @TODO handle error message
          console.error(response.error_message);
        } else {
          const currentState = getState();
          const newSite: SiteStateModel = response.site;

          setState(
            [...currentState, newSite]
          );

          if (response.settings) {
            dispatch(new CreateSiteSettingsAction(newSite, response.settings));
          }

          if (response.siteTemplateSettings) {
            dispatch(new CreateSiteTemplateSettingsAction(newSite, response.siteTemplateSettings));
          }

          if (response.sections && response.sections.length) {
            dispatch(new AddSiteSectionsAction(response.sections));
          }

          if (response.entries && response.entries.length) {
            dispatch(new AddSiteEntriesAction(newSite, response.entries));
          }

          if (response.tags && response.tags.section) {
            dispatch(new AddSiteSectionsTagsAction(newSite, response.tags));
          }
        }
      });
  }


  @Action(UpdateSiteAction)
  updateSite({ setState, getState, dispatch }: StateContext<SiteStateModel[]>, action: UpdateSiteAction) {
    const currentState = getState();
    const path = 'site/' + action.site.order + '/' + action.field.split('.').join('/');
    const data = {
      path: path,
      value: action.value
    };

    this.appStateService.sync('sites', data).subscribe(response => {
      if (response.error_message) {
        // @TODO handle error message
        console.error(response.error_message);
      } else {
        setState(
          currentState.map((site) => {
            if (site.name === action.site.name) {
              return set(action.field, response.value, site);
            }
            return site;
          })
        );

        // Site related data rename
        if (action.field === 'name') {
          dispatch(new RenameSiteSectionsSitenameAction(action.site, response.value));
          dispatch(new RenameSiteSettingsSitenameAction(action.site, response.value));
          dispatch(new RenameSiteTemplateSettingsSitenameAction(action.site, response.value));
          dispatch(new RenameSectionTagsSitenameAction(action.site, response.value));
          dispatch(new RenameSectionEntriesSitenameAction(action.site, response.value));
        }
      }
    });
  }


  @Action(RenameSiteAction)
  renameSite({ dispatch }: StateContext<SiteStateModel[]>, action: RenameSiteAction) {
    dispatch(new UpdateSiteAction(action.site, 'name', action.value));
  }


  @Action(CloneSiteAction)
  cloneSite({ dispatch }: StateContext<SiteStateModel[]>, action: CloneSiteAction) {
    dispatch(new CreateSiteAction(action.site));
  }


  @Action(DeleteSiteAction)
  DeleteSite({ setState, getState, dispatch }: StateContext<SiteStateModel[]>, action: DeleteSiteAction) {
    this.appStateService.sync('sites', { site: action.site.name }, 'DELETE')
      .subscribe(response => {
        if (response.error_message) {
          // @TODO handle error message
          console.error(response.error_message);
        } else {
          const currentState = getState();
          const siteName = response.name;

          setState(
            currentState
              .filter(site => site.name !== siteName)
              // Update order
              .map((site, order) => {
                return set('order', order, site);
              })
          );
          dispatch(new DeleteSiteSectionsAction(siteName));
          dispatch(new DeleteSiteSettingsAction(siteName));
          dispatch(new DeleteSiteTemplateSettingsAction(siteName));
          dispatch(new DeleteSiteSectionsTagsAction(siteName));
          dispatch(new DeleteSiteSectionsEntriesAction(siteName));
        }
      });
  }
}
