import { Router } from '@angular/router';
import { State, StateContext, NgxsOnInit, Action, Selector } from '@ngxs/store';
import { UserStateModel } from './user.state.model';
import { UserLoginAction, UserLogoutAction, ResetUserAction, UpdateUserAction, SetUserNextUrlAction } from './user-actions';
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
    private router: Router
  ) {}

  @Selector()
  static isLoggedIn(state: UserStateModel): boolean {
    return !!state.token;
  }

  ngxsOnInit({ patchState }: StateContext<UserStateModel>) {
    const name = window.localStorage.getItem('name');
    const token = window.localStorage.getItem('token');
    const features = window.localStorage.getItem('features');
    const profileUrl = window.localStorage.getItem('profileUrl');

    patchState({
      name: name,
      token: token,
      features: JSON.parse(features),
      profileUrl: JSON.parse(profileUrl)
    });
  }

  @Action(UserLoginAction)
  login({ patchState }: StateContext<UserStateModel>, action: UserLoginAction) {
    patchState({
      name: action.name,
      token: action.token,
      features: action.features,
      profileUrl: action.profileUrl
    });
  }

  @Action(UserLogoutAction)
  logout({ dispatch }: StateContext<UserStateModel>, action: UserLogoutAction) {
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
    dispatch(ResetUserAction);

    if (action.saveNextUrl) {
      dispatch(new SetUserNextUrlAction(this.router.url));
      console.log('saving current url: ', this.router.url);
    }
    this.router.navigate(['/login']);
  }

  @Action(ResetUserAction)
  resetUser({ setState }: StateContext<UserStateModel>) {
    setState(defaultState);
  }

  @Action(SetUserNextUrlAction)
  setNextUrl({ patchState }: StateContext<UserStateModel>, action: SetUserNextUrlAction) {
    patchState({nextUrl: action.payload});
  }
}
