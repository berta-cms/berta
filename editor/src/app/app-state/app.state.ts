import { Router, ActivationEnd, ChildActivationEnd, NavigationEnd } from '@angular/router';
import { concat } from 'rxjs';
import { filter, take, switchMap } from 'rxjs/operators';
import { State, Action, StateContext, Selector, NgxsOnInit, Actions, ofActionSuccessful } from '@ngxs/store';

import { AppStateModel } from './app-state.interface';
import {
  AppShowOverlay,
  AppHideOverlay,
  AppShowLoading,
  AppHideLoading,
  ResetAppStateAction,
  InitAppStateAction,
  UpdateInputFocus,
  UpdateAppStateAction
} from './app.actions';
import { AppStateService } from './app-state.service';
import { UserLoginAction } from '../user/user.actions';


const defaultState: AppStateModel = {
  showOverlay: false,
  isLoading: false,
  inputFocused: false,
  site: null,
  urls: {},
  forgotPasswordUrl: '',
  internalVersion: '',
  isBertaHosting: false,
  loginUrl: '',
  authenticateUrl: '',
  version: '',
  lastRoute: '/settings'
};


@State<AppStateModel>({
  name: 'app',
  defaults: defaultState
})
export class AppState implements NgxsOnInit {

  @Selector()
  static getInputFocus(state: AppStateModel) {
    return state.inputFocused;
  }

  @Selector()
  static getShowOverlay(state: AppStateModel) {
    return state.showOverlay;
  }

  @Selector()
  static getShowLoading(state: AppStateModel) {
    return state.isLoading;
  }

  @Selector()
  static getSite(state: AppStateModel) {
    return state.site;
  }

  @Selector()
  static getLastRoute(state: AppStateModel) {
    return state.lastRoute;
  }

  constructor(private router: Router,
              private actions$: Actions,
              private appStateService: AppStateService) {
  }

  ngxsOnInit({ patchState, dispatch }: StateContext<AppStateModel>) {
    this.router.events.pipe(
      filter(evt => evt instanceof ActivationEnd)
    ).subscribe((event: ActivationEnd) => {
      if (event.snapshot.queryParams['site']) {
        /** @todo: trigger actions here */
        patchState({site: event.snapshot.queryParams['site']});
      } else {
        patchState({site: ''});
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd && event.url !== '/' && event.url !== '/login')
    ).subscribe((event: NavigationEnd) => {
      dispatch(new UpdateAppStateAction({lastRoute: event.url}));
    });

    this.appStateService.getAppMetadata().pipe(take(1))
      .subscribe({
        next: (metadata) => {
          dispatch(new UpdateAppStateAction(metadata));
        },
        error: (error) => console.error(error)
      });

    concat(
      this.appStateService.getInitialState('').pipe(take(1)),
      // After each subsequent successful login, initialize the state
      this.actions$.pipe(
        ofActionSuccessful(UserLoginAction),
        switchMap(() => this.appStateService.getInitialState('').pipe(take(1)))
      )
    )
    .subscribe({
      next: (response) => {
        dispatch(new InitAppStateAction({urls: response.urls}));
      },
      error: (error) => console.error(error)
    });
  }

  @Action(UpdateInputFocus)
  updateInputFocus({ patchState }: StateContext<AppStateModel>, action: UpdateInputFocus) {
    patchState({ inputFocused: action.isFocused });
  }

  @Action(AppShowOverlay)
  showOverlay({ patchState }: StateContext<AppStateModel>) {
    patchState({ showOverlay: true });
  }

  @Action(AppHideOverlay)
  hideOverlay({ patchState }: StateContext<AppStateModel>) {
    patchState({ showOverlay: false });
  }

  @Action(AppShowLoading)
  showLoading({ patchState }: StateContext<AppStateModel>) {
    patchState({ isLoading: true });
  }

  @Action(AppHideLoading)
  hideLoading({ patchState }: StateContext<AppStateModel>) {
    patchState({ isLoading: false });
  }

  @Action(ResetAppStateAction)
  resetState({ getState, setState }: StateContext<AppStateModel>) {
    // Apply default state, not to remove the user, user will reset it self
    const state = {...getState()};

    // Reset to default state except metadata properties
    setState({
      ...defaultState,
      forgotPasswordUrl: state.forgotPasswordUrl,
      internalVersion: state.internalVersion,
      isBertaHosting: state.isBertaHosting,
      loginUrl: state.loginUrl,
      authenticateUrl: state.authenticateUrl,
      version: state.version
    });
  }

  @Action(InitAppStateAction)
  InitState({ patchState }: StateContext<AppStateModel>, action: InitAppStateAction) {
    patchState({ urls: action.payload.urls});
  }

  @Action(UpdateAppStateAction)
  updateState({ patchState }: StateContext<AppStateModel>, action: UpdateAppStateAction) {
    patchState(action.payload);
  }
}
