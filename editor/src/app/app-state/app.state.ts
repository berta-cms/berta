import { State, Action, StateContext, Selector, NgxsOnInit } from '@ngxs/store';
import { AppStateModel } from './app-state.interface';
import { AppShowOverlay, AppHideOverlay, AppShowLoading, AppHideLoading } from './app.actions';
import { Router, ActivationEnd } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { UserState } from '../user/user-state';
import { AppStateService } from './app-state.service';

const defaultState: AppStateModel = {
  showOverlay: false,
  isLoading: false,
  site: null,
  urls: []
};

@State<AppStateModel>({
  name: 'app',
  defaults: defaultState,
  children: [UserState]
})
export class AppState implements NgxsOnInit {

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

  constructor(private router: Router,
              private appStateService: AppStateService) {
  }

  ngxsOnInit({ patchState }: StateContext<AppStateModel>) {
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

    this.appStateService.getInitialState('').pipe(take(1)).subscribe({
      next: (response) => {
        patchState({urls: response.urls});
      },
      error: (error) => console.error(error)
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

  @Action(AppShowLoading)
  showLoading({ patchState }: StateContext<AppStateModel>) {
    patchState({ isLoading: true });
  }

  @Action(AppHideLoading)
  hideLoading({ patchState }: StateContext<AppStateModel>) {
    patchState({ isLoading: false });
  }
}
