import { set } from 'lodash/fp';
import { concat } from 'rxjs';
import { take, switchMap, tap } from 'rxjs/operators';
import {
  State,
  Action,
  StateContext,
  NgxsOnInit,
  ofActionSuccessful,
  Actions,
  Selector,
} from '@ngxs/store';

import { SiteStateModel } from './site-state.model';
import { AppState } from '../../app-state/app.state';
import { AppStateService } from '../../app-state/app-state.service';
import {
  CreateSiteAction,
  DeleteSiteAction,
  CloneSiteAction,
  UpdateSiteAction,
  RenameSiteAction,
  ResetSitesAction,
  InitSitesAction,
  ReOrderSitesAction,
  PreviewThemeSitesAction,
  ApplyThemeSitesAction,
} from './sites.actions';
import {
  DeleteSiteSectionsAction,
  RenameSiteSectionsSitenameAction,
  AddSiteSectionsAction,
} from '../sections/sections-state/site-sections.actions';
import {
  DeleteSiteSettingsAction,
  RenameSiteSettingsSitenameAction,
  CreateSiteSettingsAction,
} from '../settings/site-settings.actions';
import {
  DeleteSiteTemplateSettingsAction,
  RenameSiteTemplateSettingsSitenameAction,
  CreateSiteTemplateSettingsAction,
} from '../template-settings/site-template-settings.actions';
import {
  DeleteSiteSectionsTagsAction,
  RenameSectionTagsSitenameAction,
  AddSiteSectionsTagsAction,
} from '../sections/tags/section-tags.actions';
import {
  DeleteSiteSectionsEntriesAction,
  RenameSectionEntriesSitenameAction,
  AddSiteEntriesAction,
} from '../sections/entries/entries-state/section-entries.actions';
import { UserLoginAction } from '../../user/user.actions';
import { Injectable } from '@angular/core';

@State<SiteStateModel[]>({
  name: 'sites',
  defaults: [],
})
@Injectable()
export class SitesState implements NgxsOnInit {
  @Selector([SitesState, AppState.getSite])
  static getCurrentSite(sites: SiteStateModel[], siteSlug: string) {
    return sites.find((site) => site.name === siteSlug);
  }

  constructor(
    private appStateService: AppStateService,
    private actions$: Actions,
  ) {}

  ngxsOnInit({ setState, dispatch }: StateContext<SiteStateModel[]>) {
    concat(
      this.appStateService.getInitialState('', 'sites').pipe(take(1)),
      this.actions$.pipe(
        ofActionSuccessful(UserLoginAction),
        switchMap(() =>
          this.appStateService.getInitialState('', 'sites').pipe(take(1)),
        ),
      ),
    ).subscribe({
      next: (response) => {
        dispatch(new InitSitesAction(response as SiteStateModel[]));
      },
      error: (error) => console.error(error),
    });
  }

  @Action(CreateSiteAction)
  createSite(
    { setState, getState, dispatch }: StateContext<SiteStateModel[]>,
    action: CreateSiteAction,
  ) {
    const siteName = action.site
      ? action.site.name === ''
        ? '0'
        : action.site.name
      : '-1';
    return this.appStateService.sync('sites', { site: siteName }, 'POST').pipe(
      tap((response) => {
        if (response.error_message) {
          // @TODO handle error message
          console.error(response.error_message);
        } else {
          const currentState = getState();
          const newSite: SiteStateModel = response.site;

          setState([...currentState, newSite]);

          if (response.settings) {
            dispatch(new CreateSiteSettingsAction(newSite, response.settings));
          }

          if (response.siteTemplateSettings) {
            dispatch(
              new CreateSiteTemplateSettingsAction(
                newSite,
                response.siteTemplateSettings,
              ),
            );
          }

          if (response.sections && response.sections.length) {
            dispatch(new AddSiteSectionsAction(response.sections));
          }

          dispatch(new AddSiteEntriesAction(newSite, response.entries));

          dispatch(new AddSiteSectionsTagsAction(newSite, response.tags));
        }
      }),
    );
  }

  @Action(UpdateSiteAction)
  updateSite(
    { setState, getState, dispatch }: StateContext<SiteStateModel[]>,
    action: UpdateSiteAction,
  ) {
    const currentState = getState();
    const path =
      'site/' + action.site.order + '/' + action.field.split('.').join('/');
    const data = {
      path: path,
      value: action.value,
    };

    return this.appStateService.sync('sites', data).pipe(
      tap((response) => {
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
            }),
          );

          // Site related data rename
          if (action.field === 'name') {
            dispatch(
              new RenameSiteSectionsSitenameAction(action.site, response.value),
            );
            dispatch(
              new RenameSiteSettingsSitenameAction(action.site, response.value),
            );
            dispatch(
              new RenameSiteTemplateSettingsSitenameAction(
                action.site,
                response.value,
              ),
            );
            dispatch(
              new RenameSectionTagsSitenameAction(action.site, response.value),
            );
            dispatch(
              new RenameSectionEntriesSitenameAction(
                action.site,
                response.value,
              ),
            );
          }
        }
      }),
    );
  }

  @Action(RenameSiteAction)
  renameSite(
    { dispatch }: StateContext<SiteStateModel[]>,
    action: RenameSiteAction,
  ) {
    return dispatch(new UpdateSiteAction(action.site, 'name', action.value));
  }

  @Action(CloneSiteAction)
  cloneSite(
    { dispatch }: StateContext<SiteStateModel[]>,
    action: CloneSiteAction,
  ) {
    return dispatch(new CreateSiteAction(action.site));
  }

  @Action(DeleteSiteAction)
  deleteSite(
    { setState, getState, dispatch }: StateContext<SiteStateModel[]>,
    action: DeleteSiteAction,
  ) {
    return this.appStateService
      .sync('sites', { site: action.site.name }, 'DELETE')
      .pipe(
        tap((response) => {
          if (response.error_message) {
            // @TODO handle error message
            console.error(response.error_message);
          } else {
            const currentState = getState();
            const siteName = response.name;

            setState(
              currentState
                .filter((site) => site.name !== siteName)
                // Update order
                .map((site, order) => {
                  return set('order', order, site);
                }),
            );
            dispatch([
              new DeleteSiteSectionsAction(siteName),
              new DeleteSiteSettingsAction(siteName),
              new DeleteSiteTemplateSettingsAction(siteName),
              new DeleteSiteSectionsTagsAction(siteName),
              new DeleteSiteSectionsEntriesAction(siteName),
            ]);
          }
        }),
      );
  }

  @Action(ReOrderSitesAction)
  reOrderSites(
    { getState, setState }: StateContext<SiteStateModel[]>,
    action: ReOrderSitesAction,
  ) {
    const sitesToSort = [...getState()];
    const indexToSortBy =
      action.currentOrder < action.payload
        ? action.payload + 0.5
        : action.payload - 0.5;

    sitesToSort.sort((siteA, siteB) => {
      if (
        siteA.order !== action.currentOrder &&
        siteB.order !== action.currentOrder
      ) {
        return siteB.order > siteA.order ? -1 : 1;
      } else if (siteA.order === action.currentOrder) {
        return siteB.order > indexToSortBy ? -1 : 1;
      } else if (siteB.order === action.currentOrder) {
        return siteA.order < indexToSortBy ? -1 : 1;
      }
    });

    return this.appStateService
      .sync(
        'sites',
        sitesToSort.map((site) => site.name),
        'PUT',
      )
      .pipe(
        tap((response) => {
          if (response.error_message) {
            // @TODO handle error message
            console.error(response.error_message);
          } else {
            const sites = getState();

            setState(
              sites
                .map((site) => {
                  return {
                    ...site,
                    order: (<string[]>response).indexOf(site.name),
                  };
                })
                .sort((siteA, siteB) => (siteB.order > siteA.order ? -1 : 1)),
            );
          }
        }),
      );
  }

  @Action(ResetSitesAction)
  resetSites({ setState }: StateContext<SiteStateModel[]>) {
    setState([]);
  }

  @Action(InitSitesAction)
  initSites(
    { setState }: StateContext<SiteStateModel[]>,
    action: InitSitesAction,
  ) {
    setState(action.payload);
  }

  @Action(PreviewThemeSitesAction)
  PreviewThemeSites({}, action: PreviewThemeSitesAction) {
    return this.appStateService.sync(
      'siteThemePreview',
      action.payload,
      'POST',
    );
  }

  @Action(ApplyThemeSitesAction)
  ApplyThemeSites({}, action: ApplyThemeSitesAction) {
    // @TODO API should return new state and we should update state here
    // Current workaround is to reload window to get correct state
    return this.appStateService.sync('siteThemeApply', action.payload, 'PUT');
  }
}
