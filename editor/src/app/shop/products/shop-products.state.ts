import {
  State,
  StateContext,
  NgxsOnInit,
  Selector,
  Action,
  Actions,
  Store,
  ofActionSuccessful,
} from '@ngxs/store';
import { ShopStateService } from '../shop-state.service';
import {
  take,
  tap,
  catchError,
  filter,
  switchMap,
  distinct,
  map,
  startWith,
} from 'rxjs/operators';
import { AppState } from '../../app-state/app.state';
import {
  UpdateShopProductAction,
  RenameShopProductSiteAction,
  DeleteShopProductSiteAction,
  ResetShopProductsAction,
  InitShopProductsAction,
} from './shop-products.actions';
import { UpdateSectionEntryFromSyncAction } from '../../sites/sections/entries/entries-state/section-entries.actions';
import { AppStateService } from '../../app-state/app-state.service';
import { ShopState } from '../shop.state';
import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { combineLatest } from 'rxjs';
import { SwapContentsSitesAction } from 'src/app/sites/sites-state/sites.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  defaults: defaultState,
})
@Injectable()
export class ShopProductsState implements NgxsOnInit {
  @Selector([ShopProductsState, AppState.getSite])
  static getCurrentSiteProducts(
    state: ShopProductsModel,
    site: string,
  ): Array<ShopProduct> {
    return state[site];
  }

  private destroyRef = inject(DestroyRef);
  private counter = 0;

  constructor(
    private store$: Store,
    private actions$: Actions,
    private appStateService: AppStateService,
    private stateService: ShopStateService,
  ) {}

  ngxsOnInit({ dispatch }: StateContext<ShopProductsModel>) {
    combineLatest([
      this.store$.select(AppState.getSite),
      this.actions$.pipe(
        ofActionSuccessful(
          UpdateSectionEntryFromSyncAction,
          SwapContentsSitesAction,
        ),
        filter((action) => {
          // Skip filter for SwapContentsSitesAction
          if (action instanceof SwapContentsSitesAction) {
            return true;
          }
          // Apply filter for UpdateSectionEntryFromSyncAction
          const actions = ['cartTitle', 'cartPrice', 'cartAttributes'];
          const prop = action.path.split('/').pop();
          return actions.indexOf(prop) > -1;
        }),
        startWith(null), // Emit initial value so combineLatest starts immediately
      ),
    ])
      .pipe(
        filter(([site]) => site !== null),
        map(([site, action]) => ({
          site,
          forceRefresh: action !== null,
        })),
        distinct(({ site, forceRefresh }) =>
          forceRefresh ? this.counter++ : site,
        ),
        switchMap(({ site, forceRefresh }) =>
          this.stateService
            .getInitialState(site, 'products', forceRefresh)
            .pipe(
              take(1),
              map((products) => ({ site, products })),
            ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ site, products }) => {
        dispatch(new InitShopProductsAction({ [site]: products[site] }));
      });
  }

  @Action(InitShopProductsAction)
  initShopProducts(
    { patchState }: StateContext<ShopProductsModel>,
    action: InitShopProductsAction,
  ) {
    patchState(action.payload);
  }

  @Action(UpdateShopProductAction)
  updateShopProduct(
    { getState, patchState }: StateContext<ShopProductsModel>,
    action: UpdateShopProductAction,
  ) {
    const currentSite = this.store$.selectSnapshot(AppState.getSite);
    const syncURLs = this.store$.selectSnapshot(ShopState.getURLs);
    const state = getState();

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
          patchState({
            [currentSite]: state[currentSite].map((product) => {
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
