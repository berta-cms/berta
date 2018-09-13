import { State, StateContext, NgxsOnInit, Selector } from '@ngxs/store';
import { ShopStateService } from './shop-state.service';
import { take } from 'rxjs/operators';
import { AppState } from '../app-state/app.state';
import { AppStateModel } from '../app-state/app-state.interface';

interface ShopSettingsModel {
  [site: string]: any[];
}

const defaultState: ShopSettingsModel = {};


@State<ShopSettingsModel>({
  name: 'shopSettings',
  defaults: defaultState
})
export class ShopSettingsState implements NgxsOnInit {

  @Selector([AppState])
  static getCurrentSiteSettings(state: ShopSettingsModel, appState: AppStateModel) {
    return state[appState.site];
  }

  constructor(
    private stateService: ShopStateService) {
  }


  ngxsOnInit({ setState }: StateContext<ShopSettingsModel>) {
    return this.stateService.getInitialState('', 'settings').pipe(
      take(1)
    ).subscribe((settings) => {
      setState(settings);
    });
  }
}
