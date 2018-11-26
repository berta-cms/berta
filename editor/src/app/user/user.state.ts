import { Router, ActivatedRoute } from '@angular/router';
import { State, StateContext, NgxsOnInit, Action, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { UserStateModel } from './user.state.model';
import { UserLoginAction, UserLogoutAction, SetUserNextUrlAction } from './user.actions';
import { AppStateService } from '../app-state/app-state.service';
import { ResetAppStateAction } from '../app-state/app.actions';
import { ResetSectionEntriesAction } from '../sites/sections/entries/entries-state/section-entries.actions';
import { ResetSitesAction } from '../sites/sites-state/sites.actions';
import { ResetSiteSectionsAction } from '../sites/sections/sections-state/site-sections.actions';
import { ResetSiteSectionsTagsAction } from '../sites/sections/tags/section-tags.actions';
import { ResetSiteSettingsAction } from '../sites/settings/site-settings.actions';
import { ResetSiteSettingsConfigAction } from '../sites/settings/site-settings-config.actions';
import { ResetSiteTemplateSettingsAction } from '../sites/template-settings/site-template-settings.actions';
import { ResetSiteTemplatesAction } from '../sites/template-settings/site-templates.actions';


const defaultState: UserStateModel = {
  name: null,
  token: null,
  features: [],
  profileUrl: null
};

@State<UserStateModel>({
  name: 'user',
  defaults: defaultState
})
export class UserState implements NgxsOnInit {
  constructor(
    private appStateService: AppStateService,
    private router: Router,
    private route: ActivatedRoute) {}

  @Selector()
  static isLoggedIn(state: UserStateModel): boolean {
    return !!state.token;
  }

  ngxsOnInit({ patchState, dispatch }: StateContext<UserStateModel>) {
    const name = window.localStorage.getItem('name');
    const token = window.localStorage.getItem('token');
    const features = window.localStorage.getItem('features');
    const profileUrl = window.localStorage.getItem('profileUrl');

    this.route.queryParams.subscribe(params => {
      if (!token && params.token) {
        dispatch(new UserLoginAction({token: params.token}));
      }
    });

    patchState({
      name: name,
      token: token,
      features: JSON.parse(features),
      profileUrl: JSON.parse(profileUrl)
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
          profileUrl: resp.data.profileUrl
        });
      })
    );
  }

  @Action(UserLogoutAction)
  logout({ dispatch, setState }: StateContext<UserStateModel>, action: UserLogoutAction) {
    const newState = {...defaultState};

    this.appStateService.logout().subscribe({
      next: () => {},
      error: (error) => console.error(error)
    });

    /* Reset the state of app */
    dispatch(ResetAppStateAction);
    dispatch(ResetSitesAction);
    dispatch(ResetSiteSectionsAction);
    dispatch(ResetSiteSectionsTagsAction);
    dispatch(ResetSectionEntriesAction);
    dispatch(ResetSiteSettingsAction);
    dispatch(ResetSiteSettingsConfigAction);
    dispatch(ResetSiteTemplateSettingsAction);
    dispatch(ResetSiteTemplatesAction);

    if (action.saveNextUrl) {
      newState.nextUrl = this.router.url;
    }
    setState(newState);
  }

  @Action(SetUserNextUrlAction)
  setNextUrl({ patchState }: StateContext<UserStateModel>, action: SetUserNextUrlAction) {
    patchState({nextUrl: action.payload});
  }
}
