import { take, tap, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { State, StateContext, NgxsOnInit, Selector, Action, Store } from '@ngxs/store';

import { ShopStateService } from '../shop-state.service';
import { AppState } from '../../app-state/app.state';
import { UpdateShopRegionAction, UpdateShopRegionCostAction, AddShopRegionAction } from './shop-regional-costs.actions';
import { ShopState } from '../shop.state';
import { AppStateService } from '../../app-state/app-state.service';


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
    private appStateService: AppStateService,
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
    const syncURLs = this.store.selectSnapshot(ShopState.getURLs);

    return this.appStateService.sync(syncURLs.regions, {
      path: `${site}/${action.id}/${action.payload.field}`,
      value: action.payload.value
    }, 'PATCH').pipe(
      tap((response: {message: string, data: any}) => {
        patchState({[site]: state[site].map(region => {
          if (region.id !== action.id) {
            return region;
          }
          return {...region, [action.payload.field]: response.data.value};
        })});
      }),
      catchError((error: HttpErrorResponse|Error) => {
        if (error instanceof HttpErrorResponse) {
          console.error(error.error.message);
        } else {
          console.error(error.message);
        }
        throw error;
      })
    );
  }

  @Action(AddShopRegionAction)
  AddShopRegion({getState, patchState}: StateContext<ShopRegionalCostsModel>, action: AddShopRegionAction) {
    const state = getState();
    const site = this.store.selectSnapshot(AppState.getSite);
    const syncURLs = this.store.selectSnapshot(ShopState.getURLs);

    return this.appStateService.sync(syncURLs.regions, {
      site: site,
      data: {vat: 0, ...action.payload}
    }, 'POST').pipe(
      tap((response: {message: string, data: any}) => {
        patchState({[site]: [...state[site], {
          id: +response.data.data.id,
          name: response.data.data.name,
          vat: +response.data.data.vat,
          costs: []
        }]});
      }),
      catchError((error: HttpErrorResponse|Error) => {
        if (error instanceof HttpErrorResponse) {
          console.error(error.error.message);
        } else {
          console.error(error.message);
        }
        throw error;
      })
    );
  }

  @Action(UpdateShopRegionCostAction)
  updateShopRegionalCost({getState, patchState}: StateContext<ShopRegionalCostsModel>, action: UpdateShopRegionCostAction) {
    const state = getState();
    const site = this.store.selectSnapshot(AppState.getSite);

    const syncURLs = this.store.selectSnapshot(ShopState.getURLs);

    return this.appStateService.sync(syncURLs.regionalCosts, {
      path: `${site}/${action.id}/${action.payload.field}`,
      value: action.payload.value
    }, 'PATCH').pipe(
      tap((response: {message: string, data: any}) => {
        patchState({[site]: state[site].map(region => {
          if (region.id !== action.id) {
            return region;
          }
          return {...region, costs: region.costs.map(cost => {
            if (cost.id !== action.costId) {
              return cost;
            }
            return {...cost, [action.payload.field]: response.data.value};
          })};
        })});
      }),
      catchError((error: HttpErrorResponse|Error) => {
        if (error instanceof HttpErrorResponse) {
          console.error(error.error.message);
        } else {
          console.error(error.message);
        }
        throw error;
      })
    );
  }
}
