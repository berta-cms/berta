import { State, Action, StateContext, Selector, NgxsOnInit } from '@ngxs/store';
import { AppStateService } from '../../app-state/app-state.service';
import { take } from 'rxjs/operators';
import { SiteTemplatesStateModel } from './site-template-settings.interface';


@State<SiteTemplatesStateModel>({
  name: 'siteTemplates',
  defaults: {}
})
export class SiteTemplatesState implements NgxsOnInit {

  constructor(
    private appStateService: AppStateService) {
  }

  ngxsOnInit({ setState }: StateContext<SiteTemplatesStateModel>) {
    this.appStateService.getInitialState('', 'siteTemplates').pipe(
      take(1)
    ).subscribe({
      next: (siteSettingsConfig) => {
        setState(siteSettingsConfig);
      },
      error: (error) => console.error(error)
    });
  }

  // @Action(AppShowOverlay)
  // showOverlay({ patchState }: StateContext<SiteTemplatesStateModel>) {
  //   patchState({ showOverlay: true });
  // }

  // @Action(AppHideOverlay)
  // hideOverlay({ patchState }: StateContext<SiteTemplatesStateModel>) {
  //   patchState({ showOverlay: false });
  // }

  // @Action(AppLogin)
  // login({ patchState }: StateContext<SiteTemplatesStateModel>, action: AppLogin) {
  //   patchState({authToken: action.token});
  // }
}
