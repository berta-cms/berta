import { take, tap, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import {
  State,
  StateContext,
  NgxsOnInit,
  Selector,
  Action,
  Store} from '@ngxs/store';

import { ShopStateService } from '../shop-state.service';
import { AppState } from '../../app-state/app.state';
import {
  UpdateShopRegionAction,
  UpdateShopRegionCostAction,
  AddShopRegionAction,
  AddShopRegionCostAction,
  DeleteShopRegionAction,
  DeleteShopRegionCostAction,
  RenameShopRegionSiteAction,
  DeleteShopRegionSiteAction,
  AddShopRegionSiteAction} from './shop-regional-costs.actions';
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
  addShopRegion({getState, patchState}: StateContext<ShopRegionalCostsModel>, action: AddShopRegionAction) {
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

  @Action(DeleteShopRegionAction)
  deleteShopRegion({getState, patchState}: StateContext<ShopRegionalCostsModel>, action: DeleteShopRegionAction) {
    const state = getState();
    const site = this.store.selectSnapshot(AppState.getSite);
    const syncURLs = this.store.selectSnapshot(ShopState.getURLs);

    return this.appStateService.sync(syncURLs.regions + `/${(site || 0)}/${action.payload.id}`, {}, 'DELETE').pipe(
      tap(() => {
        patchState({ [site]: state[site].filter(region => +region.id !== +action.payload.id) });
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

  @Action(AddShopRegionCostAction)
  addShopRegionalCost({getState, patchState}: StateContext<ShopRegionalCostsModel>, action: AddShopRegionCostAction) {
    const state = getState();
    const site = this.store.selectSnapshot(AppState.getSite);

    const syncURLs = this.store.selectSnapshot(ShopState.getURLs);

    return this.appStateService.sync(syncURLs.regionalCosts, {
      site: site,
      data: { id_region: action.regionId, ...action.payload }
    }, 'POST').pipe(
      tap((response: {message: string, data: any}) => {
        patchState({[site]: state[site].map(region => {
          if (region.id !== action.regionId) {
            return region;
          }
          return {...region, costs: [...region.costs, {
            id: response.data.data.id,
            weight: response.data.data.weight,
            price: response.data.data.price
          }]};
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

  @Action(DeleteShopRegionCostAction)
  deleteShopRegionalCost({getState, patchState}: StateContext<ShopRegionalCostsModel>, action: DeleteShopRegionCostAction) {
    const state = getState();
    const site = this.store.selectSnapshot(AppState.getSite);
    const syncURLs = this.store.selectSnapshot(ShopState.getURLs);

    return this.appStateService.sync(syncURLs.regionalCosts + `/${(site || 0)}/${action.payload.id}`, {}, 'DELETE').pipe(
      tap(() => {
        patchState({[site]: state[site].map(region => {
          if (region.id !== action.regionId) {
            return region;
          }
          return {
            ...region,
            costs: region.costs.filter(cost => {
              /** @todo: make sure state holds correct value types */
              return +cost.id !== +action.payload.id;
            })
          };
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

  @Action(RenameShopRegionSiteAction)
  renameShopRegionsSitename(
    { setState, getState }: StateContext<ShopRegionalCostsModel>,
    action: RenameShopRegionSiteAction) {
    const state = getState();
    const newState = {};

    /* Using the loop to retain the element order in the map */
    for (const siteName in state) {
      if (siteName === action.siteName) {
        newState[action.payload] = state[siteName];
      } else {
        newState[siteName] = state[siteName];
      }
    }

    setState(newState);
  }

  @Action(DeleteShopRegionSiteAction)
  deleteShopRegionsSitename(
    { setState, getState }: StateContext<ShopRegionalCostsModel>,
    action: DeleteShopRegionSiteAction) {
    const state = getState();
    const newState = {};

    /* Using the loop to retain the element order in the map */
    for (const siteName in state) {
      if (siteName !== action.payload) {
        newState[siteName] = state[siteName];
      }
    }

    setState(newState);
  }

  @Action(AddShopRegionSiteAction)
  addShopRegionsSitename(
    { patchState }: StateContext<ShopRegionalCostsModel>,
    action: AddShopRegionSiteAction) {

    return this.stateService.getInitialState(action.payload, 'regionalCosts').pipe(
      take(1)
    ).subscribe((regionalCosts) => {
      patchState({[action.payload]: regionalCosts[action.payload]});
    });
  }
}
