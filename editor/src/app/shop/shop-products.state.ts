import { State, StateContext, NgxsOnInit, Selector } from '@ngxs/store';
import { ShopStateService } from './shop-state.service';
import { take } from 'rxjs/operators';
import { AppState } from '../app-state/app.state';
import { AppStateModel } from '../app-state/app-state.interface';

interface ShopProductsModel {
  [site: string]: any[];
}

const defaultState: ShopProductsModel = {};


@State<ShopProductsModel>({
  name: 'shopProducts',
  defaults: defaultState
})
export class ShopProductsState implements NgxsOnInit {

  @Selector([AppState])
  static getCurrentSiteProducts(state: ShopProductsModel, appState: AppStateModel): Array<string> {
    return state[appState.site];
  }

  constructor(
    private stateService: ShopStateService) {
  }


  ngxsOnInit({ setState }: StateContext<ShopProductsModel>) {
    return this.stateService.getInitialState('', 'products').pipe(
      take(1)
    ).subscribe((products) => {
      setState(products);
    });
  }
}
