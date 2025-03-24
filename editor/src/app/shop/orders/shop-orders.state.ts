import { concat } from 'rxjs';
import { take, pairwise, filter, switchMap } from 'rxjs/operators';
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
  AddShopOrdersSiteAction,
  ResetShopOrdersAction,
  InitShopOrdersAction,
} from './shop-orders.actions';
import { UserState } from '../../user/user.state';

interface ShopOrdersModel {
  [site: string]: any[];
}

const defaultState: ShopOrdersModel = {};

@State<ShopOrdersModel>({
  name: 'shopOrders',
  defaults: defaultState,
})
export class ShopOrdersState implements NgxsOnInit {
  @Selector([AppState.getSite])
  static getCurrentSiteOrders(state: ShopOrdersModel, site: string) {
    return state[site];
  }

  constructor(private store$: Store, private stateService: ShopStateService) {}

  ngxsOnInit({ dispatch }: StateContext<ShopOrdersModel>) {
    return concat(
      this.stateService.getInitialState('', 'orders').pipe(take(1)),
      /* LOGIN: */
      this.store$.select(UserState.isLoggedIn).pipe(
        pairwise(),
        filter(([wasLoggedIn, isLoggedIn]) => !wasLoggedIn && isLoggedIn),
        switchMap(() =>
          this.stateService.getInitialState('', 'orders').pipe(take(1))
        )
      )
    ).subscribe((orders) => {
      dispatch(new InitShopOrdersAction(orders));
    });
  }

  @Action(InitShopOrdersAction)
  initializeShopOrders(
    { setState }: StateContext<ShopOrdersModel>,
    action: InitShopOrdersAction
  ) {
    setState(action.payload);
  }

  @Action(RenameShopOrdersSiteAction)
  renameOrdersSite(
    { setState, getState }: StateContext<ShopOrdersModel>,
    action: RenameShopOrdersSiteAction
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
    action: DeleteShopOrdersSiteAction
  ) {
    const state = { ...getState() };
    delete state[action.payload];
    setState(state);
  }

  @Action(AddShopOrdersSiteAction)
  addOrdersSite(
    { patchState }: StateContext<ShopOrdersModel>,
    action: AddShopOrdersSiteAction
  ) {
    return this.stateService
      .getInitialState(action.payload, 'orders')
      .pipe(take(1))
      .subscribe((orders) => {
        patchState({ [action.payload]: orders[action.payload] });
      });
  }

  @Action(ResetShopOrdersAction)
  resetOrders({ setState }: StateContext<ShopOrdersModel>) {
    setState(defaultState);
  }
}
