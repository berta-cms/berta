import { tap, catchError, filter, take, switchMap } from 'rxjs/operators';
import { State, StateContext, Selector, Action, Store } from '@ngxs/store';
import { ShopState } from '../shop.state';
import { AppState } from '../../app-state/app.state';
import { AppStateService } from '../../app-state/app-state.service';
import {
  RenameShopOrdersSiteAction,
  DeleteShopOrdersSiteAction,
  ResetShopOrdersAction,
  LoadShopOrdersPageAction,
  UpdateShopOrderStatusAction,
  UpdateShopOrderNotesAction,
} from './shop-orders.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface ShopOrdersPage {
  orders: any[];
  page: number;
  lastPage: number;
  total: number;
  /** The status the orders are filtered by, null for all orders */
  statusFilter: string | null;
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
export class ShopOrdersState {
  @Selector([ShopOrdersState, AppState.getSite])
  static getCurrentSiteOrdersPage(
    state: ShopOrdersModel,
    site: string,
  ): ShopOrdersPage {
    return state[site];
  }

  constructor(
    private store$: Store,
    private appStateService: AppStateService,
  ) {}

  /** Cancels the load still running, so a slower earlier response can't replace the newer page */
  @Action(LoadShopOrdersPageAction, { cancelUncompleted: true })
  loadOrdersPage(
    { patchState }: StateContext<ShopOrdersModel>,
    action: LoadShopOrdersPageAction,
  ) {
    const site = this.store$.selectSnapshot(AppState.getSite);

    // The shop's URLs come with its state, still loading in an editor just opened on the shop
    return this.store$.select(ShopState.getURLs).pipe(
      filter((urls) => !!urls.orders),
      take(1),
      switchMap((urls) =>
        this.appStateService.sync(
          urls.orders,
          {
            site,
            page: action.page,
            ...(action.statusFilter ? { status: action.statusFilter } : {}),
          },
          'GET',
        ),
      ),
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

  /**
   * An order whose new status doesn't match the filter stays listed until the next load,
   * so the list doesn't jump while the shop owner works through it
   */
  @Action(UpdateShopOrderStatusAction)
  updateOrderStatus(
    context: StateContext<ShopOrdersModel>,
    action: UpdateShopOrderStatusAction,
  ) {
    return this.saveOrderField(context, action.id, 'status', action.status);
  }

  @Action(UpdateShopOrderNotesAction)
  updateOrderNotes(
    context: StateContext<ShopOrdersModel>,
    action: UpdateShopOrderNotesAction,
  ) {
    return this.saveOrderField(context, action.id, 'admin_notes', action.notes);
  }

  /** Saves one field of an order and shows the saved value on that order */
  private saveOrderField(
    { getState, patchState }: StateContext<ShopOrdersModel>,
    id: number,
    field: 'status' | 'admin_notes',
    value: string,
  ) {
    const site = this.store$.selectSnapshot(AppState.getSite);
    const syncURLs = this.store$.selectSnapshot(ShopState.getURLs);

    return this.appStateService
      .sync(syncURLs.orders, { path: `${site}/${id}/${field}`, value }, 'PATCH')
      .pipe(
        tap((response: { message: string; data: { value: string | null } }) => {
          const ordersPage = getState()[site];

          patchState({
            [site]: {
              ...ordersPage,
              orders: ordersPage.orders.map((order) =>
                order.id === id
                  ? { ...order, [field]: response.data.value }
                  : order,
              ),
            },
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
