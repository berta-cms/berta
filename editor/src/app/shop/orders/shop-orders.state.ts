import {
  take,
  filter,
  switchMap,
  distinct,
  map,
  startWith,
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
import { AppState } from '../../app-state/app.state';
import {
  RenameShopOrdersSiteAction,
  DeleteShopOrdersSiteAction,
  ResetShopOrdersAction,
  InitShopOrdersAction,
} from './shop-orders.actions';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { combineLatest } from 'rxjs';
import { SwapContentsSitesAction } from 'src/app/sites/sites-state/sites.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface ShopOrdersModel {
  [site: string]: any[];
}

const defaultState: ShopOrdersModel = {};

@State<ShopOrdersModel>({
  name: 'shopOrders',
  defaults: defaultState,
})
@Injectable()
export class ShopOrdersState implements NgxsOnInit {
  @Selector([ShopOrdersState, AppState.getSite])
  static getCurrentSiteOrders(state: ShopOrdersModel, site: string) {
    return state[site];
  }

  private destroyRef = inject(DestroyRef);
  private counter = 0;

  constructor(
    private store$: Store,
    private stateService: ShopStateService,
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
        filter((site) => site !== null),
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
