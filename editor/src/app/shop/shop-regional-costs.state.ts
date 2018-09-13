import { State, StateContext, NgxsOnInit, Selector } from '@ngxs/store';
import { ShopStateService } from './shop-state.service';
import { take } from 'rxjs/operators';
import { AppState } from '../app-state/app.state';
import { AppStateModel } from '../app-state/app-state.interface';

interface ShopRegionalCostsModel {
  [site: string]: any[];
}

const defaultState: ShopRegionalCostsModel = {};


@State<ShopRegionalCostsModel>({
  name: 'shopRegionalCosts',
  defaults: defaultState
})
export class ShopRegionalCostsState implements NgxsOnInit {

  @Selector([AppState])
  static getCurrentSiteRegionalCosts(state: ShopRegionalCostsModel, appState: AppStateModel) {
    return state[appState.site];
  }

  constructor(
    private stateService: ShopStateService) {
  }


  ngxsOnInit({ setState }: StateContext<ShopRegionalCostsModel>) {
    return this.stateService.getInitialState('', 'regionalCosts').pipe(
      take(1)
    ).subscribe((regionalCosts) => {
      setState(regionalCosts);
    });
  }
}
