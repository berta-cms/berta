import { State, Action, StateContext, Selector, NgxsOnInit } from '@ngxs/store';
import { SiteStateModel } from './site-state.model';
import { AppStateService } from '../../app-state/app-state.service';
import { take } from 'rxjs/operators';

@State<SiteStateModel[]>({
  name: 'sites',
  defaults: []
})
export class SitesState implements NgxsOnInit {

  // @Selector()
  // static getCurrentSite(state: SiteStateModel[]) {
  //   return state.showOverlay;
  // }

  constructor(
    private appStateService: AppStateService) {
  }


  ngxsOnInit({ setState }: StateContext<SiteStateModel[]>) {
    this.appStateService.getInitialState('', 'sites').pipe(take(1)).subscribe({
      next: (response) => {
        console.log('response: ', response);
        setState(response as SiteStateModel[]);
      },
      error: (error) => console.error(error)
    });
  }

  // @Action(AppShowOverlay)
  // showOverlay({ patchState }: StateContext<SiteStateModel[]>) {
  //   patchState({ showOverlay: true });
  // }

  // @Action(AppHideOverlay)
  // hideOverlay({ patchState }: StateContext<SiteStateModel[]>) {
  //   patchState({ showOverlay: false });
  // }

  // @Action(AppLogin)
  // login({ patchState }: StateContext<SiteStateModel[]>, action: AppLogin) {
  //   patchState({authToken: action.token});
  // }
}
