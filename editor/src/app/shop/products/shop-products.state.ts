import { State, StateContext, NgxsOnInit, Selector, Action, Actions, Store, ofActionSuccessful } from '@ngxs/store';
import { ShopStateService } from '../shop-state.service';
import { take, tap, catchError, pairwise, filter, switchMap } from 'rxjs/operators';
import { AppState } from '../../app-state/app.state';
import {
  UpdateShopProductAction,
  RenameShopProductSiteAction,
  DeleteShopProductSiteAction,
  AddShopProductSiteAction,
  ResetShopProductsAction,
  InitShopProductsAction} from './shop-products.actions';
import { UpdateSectionEntryFromSyncAction } from '../../sites/sections/entries/entries-state/section-entries.actions';
import { AppStateService } from '../../app-state/app-state.service';
import { ShopState } from '../shop.state';
import { HttpErrorResponse } from '@angular/common/http';
import { concat } from 'rxjs';
import { UserState } from '../../user/user.state';


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
    private store$: Store,
    private actions$: Actions,
    private appStateService: AppStateService,
    private stateService: ShopStateService) {
  }

  ngxsOnInit({ dispatch }: StateContext<ShopProductsModel>) {
    concat(
      this.stateService.getInitialState('', 'products').pipe(take(1)),
      /* LOGIN: */
      this.store$.select(UserState.isLoggedIn).pipe(
        pairwise(),
        filter(([wasLoggedIn, isLoggedIn]) => !wasLoggedIn && isLoggedIn),
        switchMap(() => this.stateService.getInitialState('', 'products').pipe(take(1)))
      )
    ).subscribe((products) => {
      // console.log('yo!');
      dispatch(new InitShopProductsAction(products));
    });

    // Update products from server on entry update (name, attribute, instock, reservations)
    this.actions$.pipe(
      ofActionSuccessful(UpdateSectionEntryFromSyncAction),
      filter(action => {
        const actions = ['cartTitle', 'cartPrice', 'cartAttributes'];
        const prop = action.path.split('/').pop();
        return actions.indexOf(prop) > -1;
      }),
      switchMap(() => this.stateService.getInitialState('', 'products', true).pipe(take(1)))

    ).subscribe((products) => {
      dispatch(new InitShopProductsAction(products));
    });
  }


  @Action(InitShopProductsAction)
  initializeShopOrders({ setState }: StateContext<ShopProductsModel>, action: InitShopProductsAction) {
    setState(action.payload);
  }

  @Action(UpdateShopProductAction)
  updateShopProduct({ getState, patchState }: StateContext<ShopProductsModel>, action: UpdateShopProductAction) {
    const currentSite = this.store$.selectSnapshot(AppState.getSite);
    const syncURLs = this.store$.selectSnapshot(ShopState.getURLs);
    const state = getState();

    return this.appStateService.sync(syncURLs.products, {
      path: `${currentSite}/${action.id}/${action.payload.field}`,
      value: action.payload.value
    }, 'PATCH').pipe(
      tap(response => {
        patchState({
          [currentSite]: state[currentSite].map(product => {
            if (product.id !== action.id) {
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
    return this.stateService.getInitialState(action.payload, 'products').pipe(
      take(1)
    ).subscribe((products) => {
      patchState({[action.payload]: products[action.payload]});
    });
  }

  @Action(ResetShopProductsAction)
  resetProducts({ setState }: StateContext<ShopProductsModel>) {
    setState(defaultState);
  }
}
