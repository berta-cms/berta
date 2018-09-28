import { State, StateContext, NgxsOnInit, Selector, Action } from '@ngxs/store';
import { ShopStateService } from '../shop-state.service';
import { take } from 'rxjs/operators';
import { AppState } from '../../app-state/app.state';
import { RenameShopOrdersSiteAction, DeleteShopOrdersSiteAction, AddShopOrdersSiteAction } from './shop-orders.actions';


interface ShopOrdersModel {
  [site: string]: any[];
}

const defaultState: ShopOrdersModel = {};


@State<ShopOrdersModel>({
  name: 'shopOrders',
  defaults: defaultState
})
export class ShopOrdersState implements NgxsOnInit {

  @Selector([AppState.getSite])
  static getCurrentSiteOrders(state: ShopOrdersModel, site: string) {
    return state[site];
  }

  constructor(
    private stateService: ShopStateService) {
  }


  ngxsOnInit({ setState }: StateContext<ShopOrdersModel>) {
    return this.stateService.getInitialState('', 'orders').pipe(
      take(1)
    ).subscribe((orders) => {
      setState(orders);
    });
  }

  @Action(RenameShopOrdersSiteAction)
  renameOrdersSite({ setState, getState }: StateContext<ShopOrdersModel>, action: RenameShopOrdersSiteAction) {
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
  deleteOrdersSite({ getState, setState }: StateContext<ShopOrdersModel>, action: DeleteShopOrdersSiteAction) {
    const state = {...getState()};
    delete state[action.payload];
    setState(state);
  }

  @Action(AddShopOrdersSiteAction)
  addOrdersSite({ patchState }: StateContext<ShopOrdersModel>, action: AddShopOrdersSiteAction) {
    patchState({[action.payload]: []});
  }
}
