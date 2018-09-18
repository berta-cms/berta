import { State, StateContext, NgxsOnInit, Selector } from '@ngxs/store';
import { ShopStateService } from './shop-state.service';
import { take } from 'rxjs/operators';
import { AppState } from '../app-state/app.state';
import { AppStateModel } from '../app-state/app-state.interface';

interface ShopSettingsModel {
  [site: string]: {
    group_config: {[k: string]: string};
    [k: string]: any;
  };
}

const defaultState: ShopSettingsModel = {};


@State<ShopSettingsModel>({
  name: 'shopSettings',
  defaults: defaultState
})
export class ShopSettingsState implements NgxsOnInit {

  @Selector([AppState.getSite])
  static getCurrentSiteSettings(state: ShopSettingsModel, site: string) {
    return state[site];
  }

  @Selector([ShopSettingsState.getCurrentSiteSettings])
  static getCurrentWeightUnit(_, currentSiteSettings) {
    return currentSiteSettings ? currentSiteSettings.group_config.weightUnit : '';
  }

  @Selector([ShopSettingsState.getCurrentSiteSettings])
  static getCurrentCurrency(_, currentSiteSettings) {
    return currentSiteSettings ? currentSiteSettings.group_config.currency : '';
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
