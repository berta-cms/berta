import { State, StateContext, NgxsOnInit, Selector } from '@ngxs/store';
import { ShopStateService } from '../shop-state.service';
import { take } from 'rxjs/operators';
import { AppState } from '../../app-state/app.state';

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
}
