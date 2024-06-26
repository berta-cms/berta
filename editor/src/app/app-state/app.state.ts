import { Router, ActivationEnd, NavigationEnd } from '@angular/router';
import { concat } from 'rxjs';
import { filter, take, switchMap, map } from 'rxjs/operators';
import {
  State,
  Action,
  StateContext,
  Selector,
  NgxsOnInit,
  Actions,
  ofActionSuccessful,
} from '@ngxs/store';

import { AppStateModel } from './app-state.interface';
import {
  AppShowOverlay,
  AppHideOverlay,
  AppShowLoading,
  AppHideLoading,
  ResetAppStateAction,
  InitAppStateAction,
  UpdateInputFocus,
  UpdateAppStateAction,
} from './app.actions';
import { AppStateService } from './app-state.service';
import { UserLoginAction } from '../user/user.actions';

const defaultState: AppStateModel = {
  setup: false,
  showOverlay: false,
  isLoading: false,
  inputFocused: false,
  site: null,
  section: null,
  tag: null,
  urls: {},
  forgotPasswordUrl: '',
  isBertaHosting: false,
  plans: [],
  loginUrl: '',
  authenticateUrl: '',
  version: '',
  lastRoute: '/settings',
  themes: [],
  socialMediaIcons: {},
  rowGalleryImageLimit: {},
  gridImagePrefix: '',
};

@State<AppStateModel>({
  name: 'app',
  defaults: defaultState,
})
export class AppState implements NgxsOnInit {
  @Selector()
  static isSetup(state: AppStateModel) {
    return state.setup;
  }

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
  static getSection(state: AppStateModel) {
    return state.section;
  }

  @Selector()
  static getTag(state: AppStateModel) {
    return state.tag;
  }

  @Selector()
  static getActiveNav(state: AppStateModel) {
    return {
      site: state.site,
      section: state.section,
      tag: state.tag,
    };
  }

  @Selector()
  static getLastRoute(state: AppStateModel) {
    return state.lastRoute;
  }

  constructor(
    private router: Router,
    private actions$: Actions,
    private appStateService: AppStateService
  ) {}

  ngxsOnInit({ getState, dispatch }: StateContext<AppStateModel>) {
    this.router.events
      .pipe(filter((evt) => evt instanceof ActivationEnd))
      .subscribe((event: ActivationEnd) => {
        const state = { ...getState() };
        const newSiteName = event.snapshot.queryParams['site'] || '';
        const newSectionName = !event.snapshot.queryParams['section']
          ? null
          : event.snapshot.queryParams['section'];
        const newTagName = !event.snapshot.queryParams['tag']
          ? null
          : event.snapshot.queryParams['tag'];

        // Set current site and section
        if (
          state.site !== newSiteName ||
          state.section !== newSectionName ||
          state.tag !== newTagName
        ) {
          dispatch(
            new UpdateAppStateAction({
              site: newSiteName,
              section: newSectionName,
              tag: newTagName,
            })
          );
        }
      });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event: NavigationEnd) => event.url.split('?')[0]),
        filter((url) => url !== '/' && url !== '/login')
      )
      .subscribe((url: string) => {
        dispatch(new UpdateAppStateAction({ lastRoute: url }));
      });

    this.appStateService
      .getAppMetadata()
      .pipe(take(1))
      .subscribe({
        next: (metadata) => {
          dispatch(new UpdateAppStateAction(metadata));
        },
        error: (error) => console.error(error),
      });

    concat(
      this.appStateService.getInitialState('').pipe(take(1)),
      // After each subsequent successful login, initialize the state
      this.actions$.pipe(
        ofActionSuccessful(UserLoginAction),
        switchMap(() => this.appStateService.getInitialState('').pipe(take(1)))
      )
    ).subscribe({
      next: (response) => {
        dispatch(new InitAppStateAction({ urls: response.urls }));
      },
      error: (error) => console.error(error),
    });
  }

  @Action(UpdateInputFocus)
  updateInputFocus(
    { patchState }: StateContext<AppStateModel>,
    action: UpdateInputFocus
  ) {
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
    const state = { ...getState() };

    // Reset to default state except metadata properties
    setState({
      ...defaultState,
      forgotPasswordUrl: state.forgotPasswordUrl,
      isBertaHosting: state.isBertaHosting,
      plans: state.plans,
      loginUrl: state.loginUrl,
      authenticateUrl: state.authenticateUrl,
      version: state.version,
      socialMediaIcons: state.socialMediaIcons,
      rowGalleryImageLimit: state.rowGalleryImageLimit,
      gridImagePrefix: state.gridImagePrefix,
    });
  }

  @Action(InitAppStateAction)
  InitState(
    { patchState }: StateContext<AppStateModel>,
    action: InitAppStateAction
  ) {
    patchState({ urls: action.payload.urls });
  }

  @Action(UpdateAppStateAction)
  updateState(
    { patchState }: StateContext<AppStateModel>,
    action: UpdateAppStateAction
  ) {
    patchState(action.payload);
  }
}
