import { State, StateContext, NgxsOnInit, Selector, Action, Store } from '@ngxs/store';
import { ShopStateService } from '../shop-state.service';
import { take, tap, catchError } from 'rxjs/operators';
import { AppState } from '../../app-state/app.state';
import { UpdateShopProductAction, RenameShopProductSiteAction, DeleteShopProductSiteAction, AddShopProductSiteAction } from './shop-products.actions';
import { AppStateService } from '../../app-state/app-state.service';
import { ShopState } from '../shop.state';
import { HttpErrorResponse } from '@angular/common/http';


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
    private appStateService: AppStateService,
    private stateService: ShopStateService) {
  }


  @Action(UpdateShopProductAction)
  updateShopProduct({ getState, patchState }: StateContext<ShopProductsModel>, action: UpdateShopProductAction) {
    const currentSite = this.store.selectSnapshot(AppState.getSite);
    const syncURLs = this.store.selectSnapshot(ShopState.getURLs);
    const state = getState();

    return this.appStateService.sync(syncURLs.products, {
      path: `${currentSite}/${action.uniqid}/${action.payload.field}`,
      value: action.payload.value
    }, 'PATCH').pipe(
      tap(response => {
        patchState({
          [currentSite]: state[currentSite].map(product => {
            if (product.uniqid !== action.uniqid) {
              return product;
            }
            return {
              ... product,
              [action.payload.field]: response.data.value
            };
          })
        });
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


  ngxsOnInit({ setState }: StateContext<ShopProductsModel>) {
    return this.stateService.getInitialState('', 'products').pipe(
      take(1)
    ).subscribe((products) => {
      setState(products);
    });
  }

  @Action(RenameShopProductSiteAction)
  renameProductsSite({ getState, setState }: StateContext<ShopProductsModel>, action: RenameShopProductSiteAction) {
    const state = getState(),
          newState = {};

    for (const siteName in state) {
      if (siteName === action.siteName) {
        newState[action.payload] = state[siteName];
      } else {
        newState[siteName] = state[siteName];
      }
    }

    setState(newState);
  }

  @Action(DeleteShopProductSiteAction)
  deleteProductsSite({ getState, setState }: StateContext<ShopProductsModel>, action: DeleteShopProductSiteAction) {
    const state = {...getState()};
    delete state[action.payload];
    setState(state);
  }

  @Action(AddShopProductSiteAction)
  addProductsSite({ patchState }: StateContext<ShopProductsModel>, action: AddShopProductSiteAction) {
    patchState({[action.payload]: []});
  }
}
