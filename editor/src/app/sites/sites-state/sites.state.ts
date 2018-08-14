import { set } from 'lodash/fp';
import { Store, State, Action, StateContext, NgxsOnInit } from '@ngxs/store';
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
  CreateSiteTemplateSettingsAction} from '../template-settings/site-teplate-settings.actions';
import { DeleteSiteSectionsTagsAction, RenameSectionTagsSitenameAction } from '../sections/tags/section-tags.actions';
import {
  DeleteSiteSectionsEntriesAction,
  RenameSectionEntriesSitenameAction } from '../sections/entries/entries-state/section-entries.actions';

@State<SiteStateModel[]>({
  name: 'sites',
  defaults: []
})
export class SitesState implements NgxsOnInit {

  constructor(
    private appStateService: AppStateService,
    private store: Store) {
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
  createSite({ setState, getState }: StateContext<SiteStateModel[]>, action: CreateSiteAction) {
    const siteName = action.site ? action.site.name : '-1';
    this.appStateService.sync('sites', { site: siteName }, 'POST')
      .then((response: any) => {
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
            this.store.dispatch(new CreateSiteSettingsAction(newSite, response.settings));
          }

          if (response.siteTemplateSettings) {
            this.store.dispatch(new CreateSiteTemplateSettingsAction(newSite, response.siteTemplateSettings));
          }

          if (response.sections && response.sections.length) {
            this.store.dispatch(new AddSiteSectionsAction(response.sections));
          }
        }
      });
  }


  @Action(UpdateSiteAction)
  updateSite({ setState, getState }: StateContext<SiteStateModel[]>, action: UpdateSiteAction) {
    const currentState = getState();

    // @todo sync with backend, set returned `name` from server (already slugified and unique)
    setState(
      currentState.map((site) => {
        if (site.name === action.site.name) {
          return set(action.field, action.value, site);
        }
        return site;
      })
    );
  }


  @Action(RenameSiteAction)
  renameSite({ setState, getState }: StateContext<SiteStateModel[]>, action: RenameSiteAction) {
    const currentState = getState();

    // @todo sync with backend, validate and return from server
    this.store.dispatch(new UpdateSiteAction(action.site, 'name', action.value));

    this.store.dispatch(new RenameSiteSectionsSitenameAction(action.site, action.value));
    this.store.dispatch(new RenameSiteSettingsSitenameAction(action.site, action.value));
    this.store.dispatch(new RenameSiteTemplateSettingsSitenameAction(action.site, action.value));
    this.store.dispatch(new RenameSectionTagsSitenameAction(action.site, action.value));
    this.store.dispatch(new RenameSectionEntriesSitenameAction(action.site, action.value));
  }


  @Action(CloneSiteAction)
  cloneSite({ setState, getState }: StateContext<SiteStateModel[]>, action: CloneSiteAction) {
    this.store.dispatch(new CreateSiteAction(action.site));
  }


  @Action(DeleteSiteAction)
  DeleteSite({ setState, getState }: StateContext<SiteStateModel[]>, action: DeleteSiteAction) {
    this.appStateService.sync('sites', { site: action.site.name }, 'DELETE')
      .then((response: any) => {
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
          this.store.dispatch(new DeleteSiteSectionsAction(siteName));
          this.store.dispatch(new DeleteSiteSettingsAction(siteName));
          this.store.dispatch(new DeleteSiteTemplateSettingsAction(siteName));
          this.store.dispatch(new DeleteSiteSectionsTagsAction(siteName));
          this.store.dispatch(new DeleteSiteSectionsEntriesAction(siteName));
        }
      });
  }
}
