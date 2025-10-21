import { take, filter, switchMap, distinct, map } from 'rxjs/operators';
import {
  State,
  StateContext,
  NgxsOnInit,
  Selector,
  Action,
  Store,
} from '@ngxs/store';
import { ShopStateService } from '../shop-state.service';
import { AppState } from '../../app-state/app.state';
import {
  RenameShopOrdersSiteAction,
  DeleteShopOrdersSiteAction,
  ResetShopOrdersAction,
  InitShopOrdersAction,
} from './shop-orders.actions';
import { Injectable } from '@angular/core';

interface ShopOrdersModel {
  [site: string]: any[];
}

const defaultState: ShopOrdersModel = {};

@State<ShopOrdersModel>({
  name: 'shopOrders',
  defaults: defaultState,
})
@Injectable()
export class ShopOrdersState implements NgxsOnInit {
  @Selector([ShopOrdersState, AppState.getSite])
  static getCurrentSiteOrders(state: ShopOrdersModel, site: string) {
    return state[site];
  }

  constructor(
    private store$: Store,
    private stateService: ShopStateService,
  ) {}

  ngxsOnInit({ dispatch }: StateContext<ShopOrdersModel>) {
    this.store$
      .select(AppState.getSite)
      .pipe(
        filter((site) => site !== null),
        distinct((site) => site),
        switchMap((site) =>
          this.stateService.getInitialState(site, 'orders').pipe(
            take(1),
            map((orders) => ({ site, orders })),
          ),
        ),
      )
      .subscribe(({ site, orders }) => {
        dispatch(new InitShopOrdersAction({ [site]: orders[site] }));
      });
  }

  @Action(InitShopOrdersAction)
  initShopOrders(
    { patchState }: StateContext<ShopOrdersModel>,
    action: InitShopOrdersAction,
  ) {
    patchState(action.payload);
  }

  @Action(RenameShopOrdersSiteAction)
  renameOrdersSite(
    { setState, getState }: StateContext<ShopOrdersModel>,
    action: RenameShopOrdersSiteAction,
  ) {
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

  @Action(DeleteShopOrdersSiteAction)
  deleteOrdersSite(
    { getState, setState }: StateContext<ShopOrdersModel>,
    action: DeleteShopOrdersSiteAction,
  ) {
    const state = { ...getState() };
    delete state[action.payload];
    setState(state);
  }

  @Action(ResetShopOrdersAction)
  resetOrders({ setState }: StateContext<ShopOrdersModel>) {
    setState(defaultState);
  }
}
