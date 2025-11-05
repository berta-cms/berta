import { Router, ActivatedRoute } from '@angular/router';
import { State, StateContext, NgxsOnInit, Action, Selector } from '@ngxs/store';
import { tap, filter, take, catchError } from 'rxjs/operators';

import { UserStateModel } from './user.state.model';
import {
  UserLoginAction,
  UserLogoutAction,
  SetUserNextUrlAction,
} from './user.actions';
import { AppStateService } from '../app-state/app-state.service';
import {
  ResetAppStateAction,
  AppShowLoading,
  AppHideLoading,
} from '../app-state/app.actions';
import { ResetSectionEntriesAction } from '../sites/sections/entries/entries-state/section-entries.actions';
import { ResetSitesAction } from '../sites/sites-state/sites.actions';
import { ResetSiteSectionsAction } from '../sites/sections/sections-state/site-sections.actions';
import { ResetSiteSectionsTagsAction } from '../sites/sections/tags/section-tags.actions';
import { ResetSiteSettingsAction } from '../sites/settings/site-settings.actions';
import { ResetSiteSettingsConfigAction } from '../sites/settings/site-settings-config.actions';
import { ResetSiteTemplateSettingsAction } from '../sites/template-settings/site-template-settings.actions';
import { ResetSiteTemplatesAction } from '../sites/template-settings/site-templates.actions';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

const defaultState: UserStateModel = {
  name: null,
  token: null,
  features: [],
  profileUrl: null,
  intercom: null,
  helpcrunch: null,
};

@State<UserStateModel>({
  name: 'user',
  defaults: defaultState,
})
@Injectable()
export class UserState implements NgxsOnInit {
  constructor(
    private appStateService: AppStateService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  @Selector()
  static isLoggedIn(state: UserStateModel): boolean {
    return !!state.token;
  }

  @Selector([UserState, UserState.isLoggedIn])
  static hasFeatureShop(user: UserStateModel, isLoggedIn: boolean): boolean {
    return isLoggedIn && user.features.includes('shop');
  }

  @Selector([UserState, UserState.isLoggedIn])
  static hasFeatureMultisite(
    user: UserStateModel,
    isLoggedIn: boolean,
  ): boolean {
    return isLoggedIn && user.features.includes('multisite');
  }

  ngxsOnInit({ patchState, dispatch }: StateContext<UserStateModel>) {
    const name = window.localStorage.getItem('name');
    const token = window.localStorage.getItem('token');
    const features = window.localStorage.getItem('features');
    const profileUrl = window.localStorage.getItem('profileUrl');
    const intercom = window.localStorage.getItem('intercom');
    const helpcrunch = window.localStorage.getItem('helpcrunch');

    this.route.queryParams
      .pipe(
        filter((params) => !!params.token),
        take(1),
      )
      .subscribe((params) => {
        patchState(defaultState);
        dispatch(new AppShowLoading());
        dispatch(new UserLoginAction({ token: params.token }))
          .pipe(
            catchError(() => {
              // Handle login failure
              this.router.navigate(['/login'], {
                queryParams: { autherror: 1 },
              });
              return of(null);
            }),
          )
          .subscribe(() => {
            dispatch(new AppHideLoading());
          });
      });

    patchState({
      name: name,
      token: token,
      features: JSON.parse(features),
      profileUrl: JSON.parse(profileUrl),
      intercom: JSON.parse(intercom),
      helpcrunch: JSON.parse(helpcrunch),
    });
  }

  @Action(UserLoginAction)
  login({ patchState }: StateContext<UserStateModel>, action: UserLoginAction) {
    return this.appStateService.login(action.payload).pipe(
      tap((resp) => {
        patchState({
          name: resp.data.name,
          token: resp.data.token,
          features: resp.data.features,
          profileUrl: resp.data.profileUrl,
          intercom: resp.data.intercom,
          helpcrunch: resp.data.helpcrunch,
        });
      }),
    );
  }

  @Action(UserLogoutAction)
  logout(
    { dispatch, setState }: StateContext<UserStateModel>,
    action: UserLogoutAction,
  ) {
    const newState = { ...defaultState };

    this.appStateService.logout().subscribe({
      next: () => {},
      error: (error) => console.error(error),
    });

    /* Reset the state of app */
    dispatch([
      new ResetAppStateAction(),
      new ResetSitesAction(),
      new ResetSiteSectionsAction(),
      new ResetSiteSectionsTagsAction(),
      new ResetSectionEntriesAction(),
      new ResetSiteSettingsAction(),
      new ResetSiteSettingsConfigAction(),
      new ResetSiteTemplateSettingsAction(),
      new ResetSiteTemplatesAction(),
    ]);

    if (action.saveNextUrl) {
      newState.nextUrl = this.router.url;
    }
    setState(newState);
  }

  @Action(SetUserNextUrlAction)
  setNextUrl(
    { patchState }: StateContext<UserStateModel>,
    action: SetUserNextUrlAction,
  ) {
    patchState({ nextUrl: action.payload });
  }
}
