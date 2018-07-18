import { State, Action, StateContext, Selector, NgxsOnInit } from '@ngxs/store';
import { AppStateModel } from './app-state.interface';
import { AppShowOverlay, AppHideOverlay, AppLogin } from './app.actions';

@State<AppStateModel>({
  name: 'app',
  defaults: {
    showOverlay: false,
    authToken: null,
    hasMultipage: true  /** @todo: think about features */
  }
})
export class AppState implements NgxsOnInit {

  @Selector()
  static getShowOverlay(state: AppStateModel) {
    return state.showOverlay;
  }

  @Selector()
  static isLoggedIn(state: AppStateModel): boolean {
    return !!state.authToken;
  }

  ngxsOnInit({ patchState }: StateContext<AppStateModel>) {
    const token = window.localStorage.getItem('token');
    patchState({authToken: token});
  }

  @Action(AppShowOverlay)
  showOverlay({ patchState }: StateContext<AppStateModel>) {
    patchState({ showOverlay: true });
  }

  @Action(AppHideOverlay)
  hideOverlay({ patchState }: StateContext<AppStateModel>) {
    patchState({ showOverlay: false });
  }

  @Action(AppLogin)
  login({ patchState }: StateContext<AppStateModel>, action: AppLogin) {
    patchState({authToken: action.token});
  }
}
