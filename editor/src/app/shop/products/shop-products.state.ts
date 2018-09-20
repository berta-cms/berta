import { State, StateContext, NgxsOnInit, Selector, Action, Store } from '@ngxs/store';
import { ShopStateService } from '../shop-state.service';
import { take } from 'rxjs/operators';
import { AppState } from '../../app-state/app.state';
import { UpdateProductAction } from './shop-products.actions';


interface ShopProduct {
  id: string;
  uniqid: string;
  name: string;
  instock: number;
  reservation: number;
}

interface ShopProductsModel {
  [site: string]: Array<ShopProduct>;
}


const defaultState: ShopProductsModel = {};


@State<ShopProductsModel>({
  name: 'shopProducts',
  defaults: defaultState
})
export class ShopProductsState implements NgxsOnInit {

  @Selector([AppState.getSite])
  static getCurrentSiteProducts(state: ShopProductsModel, site: string): Array<ShopProduct> {
    return state[site];
  }

  constructor(
    private store: Store,
    private stateService: ShopStateService) {
  }


  @Action(UpdateProductAction)
  updateShopProduct({ getState, patchState }: StateContext<ShopProductsModel>, action: UpdateProductAction) {
    const currentSite = this.store.selectSnapshot(AppState.getSite);
    const state = getState();

    patchState({[currentSite]: state[currentSite].map(product => {
        if (product.uniqid !== action.uniqid) {
          return product;
        }
        return {
          ... product,
          [action.payload.field]: action.payload.value
        };
      })
    });
  }


  ngxsOnInit({ setState }: StateContext<ShopProductsModel>) {
    return this.stateService.getInitialState('', 'products').pipe(
      take(1)
    ).subscribe((products) => {
      setState(products);
    });
  }
}
