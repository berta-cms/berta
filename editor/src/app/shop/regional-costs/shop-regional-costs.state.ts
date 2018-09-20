import { State, StateContext, NgxsOnInit, Selector, Action, Store } from '@ngxs/store';
import { take } from 'rxjs/operators';
import { ShopStateService } from '../shop-state.service';
import { AppState } from '../../app-state/app.state';
import { UpdateShopRegionAction, UpdateShopRegionCostAction } from './shop-regional-costs.actions';


interface ShopRegion {
  id: number;
  name: string;
  vat: number;
  costs: ShopRegionalCost[];
}

interface ShopRegionalCost {
  id: number;
  weight: number;
  price: number;
}

interface ShopRegionalCostsModel {
  [site: string]: ShopRegion[];
}

const defaultState: ShopRegionalCostsModel = {};


@State<ShopRegionalCostsModel>({
  name: 'shopRegionalCosts',
  defaults: defaultState
})
export class ShopRegionalCostsState implements NgxsOnInit {

  @Selector([AppState.getSite])
  static getCurrentSiteRegionalCosts(state: ShopRegionalCostsModel, site: string) {
    return state[site];
  }

  constructor(
    private store: Store,
    private stateService: ShopStateService) {
  }


  ngxsOnInit({ setState }: StateContext<ShopRegionalCostsModel>) {
    return this.stateService.getInitialState('', 'regionalCosts').pipe(
      take(1)
    ).subscribe((regionalCosts) => {
      setState(regionalCosts);
    });
  }

  @Action(UpdateShopRegionAction)
  updateShopRegion({getState, patchState}: StateContext<ShopRegionalCostsModel>, action: UpdateShopRegionAction) {
    const state = getState();
    const site = this.store.selectSnapshot(AppState.getSite);

    patchState({[site]: state[site].map(region => {
      if (region.id !== action.id) {
        return region;
      }
      return {...region, [action.payload.field]: action.payload.value};
    })});
  }

  @Action(UpdateShopRegionCostAction)
  updateShopRegionalCost({getState, patchState}: StateContext<ShopRegionalCostsModel>, action: UpdateShopRegionCostAction) {
    const state = getState();
    const site = this.store.selectSnapshot(AppState.getSite);

    patchState({[site]: state[site].map(region => {
      if (region.id !== action.id) {
        return region;
      }
      return {...region, costs: region.costs.map(cost => {
        if (cost.id !== action.costId) {
          return cost;
        }
        return {...cost, [action.payload.field]: action.payload.value};
      })};
    })});
  }
}
