import { startWith } from 'rxjs';
import {
  take,
  filter,
  switchMap,
  distinct,
  map,
  tap,
  catchError,
} from 'rxjs/operators';
import {
  State,
  StateContext,
  NgxsOnInit,
  Selector,
  Action,
  Store,
  Actions,
  ofActionSuccessful,
} from '@ngxs/store';
import { ShopStateService } from '../shop-state.service';
import { ShopState } from '../shop.state';
import { AppState } from '../../app-state/app.state';
import { AppStateService } from '../../app-state/app-state.service';
import {
  RenameShopOrdersSiteAction,
  DeleteShopOrdersSiteAction,
  ResetShopOrdersAction,
  InitShopOrdersAction,
  LoadShopOrdersPageAction,
} from './shop-orders.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { combineLatest } from 'rxjs';
import { SwapContentsSitesAction } from 'src/app/sites/sites-state/sites.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface ShopOrdersPage {
  orders: any[];
  page: number;
  lastPage: number;
  total: number;
}

export interface ShopOrdersModel {
  [site: string]: ShopOrdersPage;
}

const defaultState: ShopOrdersModel = {};

@State<ShopOrdersModel>({
  name: 'shopOrders',
  defaults: defaultState,
})
@Injectable()
export class ShopOrdersState implements NgxsOnInit {
  @Selector([ShopOrdersState, AppState.getSite])
  static getCurrentSiteOrdersPage(
    state: ShopOrdersModel,
    site: string,
  ): ShopOrdersPage {
    return state[site];
  }

  private destroyRef = inject(DestroyRef);
  private counter = 0;

  constructor(
    private store$: Store,
    private stateService: ShopStateService,
    private appStateService: AppStateService,
    private actions$: Actions,
  ) {}

  ngxsOnInit({ dispatch }: StateContext<ShopOrdersModel>) {
    combineLatest([
      this.store$.select(AppState.getSite),
      this.actions$.pipe(
        ofActionSuccessful(SwapContentsSitesAction),
        startWith(null), // Emit initial value so combineLatest starts immediately
      ),
    ])
      .pipe(
        filter(([site]) => site !== null),
        map(([site, action]) => ({
          site,
          isSwapSitesContentsAction: action !== null,
        })),
        distinct(({ site, isSwapSitesContentsAction }) =>
          isSwapSitesContentsAction ? this.counter++ : site,
        ),
        switchMap(({ site, isSwapSitesContentsAction }) =>
          this.stateService
            .getInitialState(site, 'orders', isSwapSitesContentsAction)
            .pipe(
              take(1),
              map((orders) => ({ site, orders })),
            ),
        ),
        takeUntilDestroyed(this.destroyRef),
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

  @Action(LoadShopOrdersPageAction)
  loadOrdersPage(
    { patchState }: StateContext<ShopOrdersModel>,
    action: LoadShopOrdersPageAction,
  ) {
    const site = this.store$.selectSnapshot(AppState.getSite);
    const syncURLs = this.store$.selectSnapshot(ShopState.getURLs);

    return this.appStateService
      .sync(syncURLs.orders, { site, page: action.page }, 'GET')
      .pipe(
        tap((response: { message: string; data: ShopOrdersModel }) => {
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
