import { State, StateContext, Selector, Action, Store } from '@ngxs/store';
import { take, tap, catchError, filter, switchMap } from 'rxjs/operators';
import { AppState } from '../../app-state/app.state';
import {
  UpdateShopProductAction,
  RenameShopProductSiteAction,
  DeleteShopProductSiteAction,
  ResetShopProductsAction,
  LoadShopProductsAction,
} from './shop-products.actions';
import { AppStateService } from '../../app-state/app-state.service';
import { ShopState } from '../shop.state';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface ShopProduct {
  id: string;
  uniqid: string;
  name: string;
  instock: number;
  reservation: number;
}

export interface ShopProductsModel {
  [site: string]: Array<ShopProduct>;
}

const defaultState: ShopProductsModel = {};

@State<ShopProductsModel>({
  name: 'shopProducts',
  defaults: defaultState,
})
@Injectable()
export class ShopProductsState {
  @Selector([ShopProductsState, AppState.getSite])
  static getCurrentSiteProducts(
    state: ShopProductsModel,
    site: string,
  ): Array<ShopProduct> {
    return state[site];
  }

  constructor(
    private store$: Store,
    private appStateService: AppStateService,
  ) {}

  /**
   * The products endpoint adds the rows of products for sale since, so new products are listed.
   * Cancels the load still running, so a slower earlier response can't replace the newer stock.
   */
  @Action(LoadShopProductsAction, { cancelUncompleted: true })
  loadProducts({ patchState }: StateContext<ShopProductsModel>) {
    const site = this.store$.selectSnapshot(AppState.getSite);

    // The shop's URLs come with its state, still loading in an editor just opened on the shop
    return this.store$.select(ShopState.getURLs).pipe(
      filter((urls) => !!urls.products),
      take(1),
      switchMap((urls) =>
        this.appStateService.sync(urls.products, { site }, 'GET'),
      ),
      tap((response: { message: string; data: ShopProductsModel }) => {
        patchState({ [site]: response.data[site] });
      }),
      catchError((error: HttpErrorResponse | Error) => {
        if (error instanceof HttpErrorResponse) {
          console.error(error.error.message);
        } else {
          console.error(error.message);
        }
        throw error;
      }),
    );
  }

  @Action(UpdateShopProductAction)
  updateShopProduct(
    { getState, patchState }: StateContext<ShopProductsModel>,
    action: UpdateShopProductAction,
  ) {
    const currentSite = this.store$.selectSnapshot(AppState.getSite);
    const syncURLs = this.store$.selectSnapshot(ShopState.getURLs);

    return this.appStateService
      .sync(
        syncURLs.products,
        {
          path: `${currentSite}/${action.id}/${action.payload.field}`,
          value: action.payload.value,
        },
        'PATCH',
      )
      .pipe(
        tap((response) => {
          // The products as they are now: a load may have replaced them during the save
          patchState({
            [currentSite]: getState()[currentSite].map((product) => {
              if (product.id !== action.id) {
                return product;
              }
              return {
                ...product,
                [action.payload.field]: response.data.value,
              };
            }),
          });
        }),
        catchError((error: HttpErrorResponse | Error) => {
          if (error instanceof HttpErrorResponse) {
            console.error(error.error.message);
          } else {
            console.error(error.message);
          }
          throw error;
        }),
      );
  }

  @Action(RenameShopProductSiteAction)
  renameProductsSite(
    { getState, setState }: StateContext<ShopProductsModel>,
    action: RenameShopProductSiteAction,
  ) {
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
  deleteProductsSite(
    { getState, setState }: StateContext<ShopProductsModel>,
    action: DeleteShopProductSiteAction,
  ) {
    const state = { ...getState() };
    delete state[action.payload];
    setState(state);
  }

  @Action(ResetShopProductsAction)
  resetProducts({ setState }: StateContext<ShopProductsModel>) {
    setState(defaultState);
  }
}
