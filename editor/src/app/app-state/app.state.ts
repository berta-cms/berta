import { State, Action, StateContext, Selector, NgxsOnInit } from '@ngxs/store';
import { AppStateModel } from './app-state.interface';
import { AppShowOverlay, AppHideOverlay, AppLogin, AppLogout } from './app.actions';
import { Router, ActivationEnd } from '@angular/router';
import { filter, take } from 'rxjs/operators';

const defaultState: AppStateModel = {
  showOverlay: false,
  authToken: null,
  hasMultipage: true,  /** @todo: think about features */
  site: null
};

@State<AppStateModel>({
  name: 'app',
  defaults: defaultState
})
export class AppState implements NgxsOnInit {

  @Selector()
  static getShowOverlay(state: AppStateModel) {
    return state.showOverlay;
  }

  @Selector()
  static getSite(state: AppStateModel) {
    return state.site;
  }

  @Selector()
  static isLoggedIn(state: AppStateModel): boolean {
    return !!state.authToken;
  }

  constructor(private router: Router) {
  }

  ngxsOnInit({ patchState }: StateContext<AppStateModel>) {
    const token = window.localStorage.getItem('token');
    this.router.events.pipe(
      filter(evt => evt instanceof ActivationEnd),
      take(1)
    ).subscribe((event: ActivationEnd) => {
      if (event.snapshot.queryParams['site']) {
        patchState({site: event.snapshot.queryParams['site']});
      } else {
        patchState({site: ''});
      }
    });

    patchState({
      authToken: token,
    });
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

  @Action(AppLogout)
  logout({ setState }: StateContext<AppStateModel>) {
    setState(defaultState);
  }
}
