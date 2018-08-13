import { State, Action, StateContext, Selector, NgxsOnInit } from '@ngxs/store';
import { AppStateModel } from './app-state.interface';
import { AppShowOverlay, AppHideOverlay, AppShowLoading, AppHideLoading } from './app.actions';
import { Router, ActivationEnd } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { UserState } from '../user/user-state';

const defaultState: AppStateModel = {
  showOverlay: false,
  isLoading: false,
  site: null
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

  constructor(private router: Router) {
  }

  ngxsOnInit({ patchState }: StateContext<AppStateModel>) {
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
