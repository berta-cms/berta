import { State, Action, StateContext, Selector, NgxsOnInit } from '@ngxs/store';
import { AppStateService } from '../../app-state/app-state.service';
import { take } from 'rxjs/operators';
import { SiteSettingsConfigStateModel } from './site-settings.interface';


@State<SiteSettingsConfigStateModel>({
  name: 'siteSettingsConfig',
  defaults: {}
})
export class SiteSettingsConfigState implements NgxsOnInit {

  constructor(
    private appStateService: AppStateService) {
  }

  ngxsOnInit({ setState }: StateContext<SiteSettingsConfigStateModel>) {
    this.appStateService.getInitialState('', 'siteSettingsConfig').pipe(
      take(1)
    ).subscribe({
      next: (siteSettingsConfig) => {
        setState(siteSettingsConfig);
      },
      error: (error) => console.error(error)
    });
  }

  // @Action(AppShowOverlay)
  // showOverlay({ patchState }: StateContext<SiteSettingsModel>) {
  //   patchState({ showOverlay: true });
  // }

  // @Action(AppHideOverlay)
  // hideOverlay({ patchState }: StateContext<SiteSettingsModel>) {
  //   patchState({ showOverlay: false });
  // }

  // @Action(AppLogin)
  // login({ patchState }: StateContext<SiteSettingsModel>, action: AppLogin) {
  //   patchState({authToken: action.token});
  // }
}
