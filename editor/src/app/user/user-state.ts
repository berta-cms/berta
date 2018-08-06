import { State, StateContext, NgxsOnInit, Action, Selector  } from '@ngxs/store';
import { UserStateModel } from './user.state.model';
import { UserLogin, UserLogout } from './user-actions';

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
  constructor() {}

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

  @Action(UserLogin)
  login({ patchState }: StateContext<UserStateModel>, action: UserLogin) {
    patchState({
      name: action.name,
      token: action.token,
      features: action.features,
      profileUrl: action.profileUrl
    });
  }

  @Action(UserLogout)
  logout({ patchState }: StateContext<UserStateModel>, action: UserLogout) {
    patchState(defaultState);
  }
}