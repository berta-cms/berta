import { TestBed } from '@angular/core/testing';
import { Actions, StateContext, Store } from '@ngxs/store';
import { of } from 'rxjs';

import {
  ShopOrdersModel,
  ShopOrdersPage,
  ShopOrdersState,
} from './shop-orders.state';
import {
  LoadShopOrdersPageAction,
  UpdateShopOrderNotesAction,
  UpdateShopOrderStatusAction,
} from './shop-orders.actions';
import { AppState } from '../../app-state/app.state';
import { AppStateService } from '../../app-state/app-state.service';
import { ShopStateService } from '../shop-state.service';

describe('ShopOrdersState', () => {
  const SECOND_PAGE: ShopOrdersPage = {
    orders: [{ id: 5, order_id: 'ORD-5', status: null, orders: [] }],
    page: 2,
    lastPage: 2,
    total: 21,
    statusFilter: null,
  };

  let sync: jasmine.Spy;
  let patchState: jasmine.Spy;
  let state: ShopOrdersState;

  beforeEach(() => {
    sync = jasmine
      .createSpy('sync')
      .and.returnValue(of({ message: '', data: { blog: SECOND_PAGE } }));
    patchState = jasmine.createSpy('patchState');
    const store = {
      selectSnapshot: (selector: unknown) =>
        selector === AppState.getSite ? 'blog' : { orders: '/orders' },
    } as unknown as Store;

    state = TestBed.runInInjectionContext(
      () =>
        new ShopOrdersState(
          store,
          {} as ShopStateService,
          { sync } as unknown as AppStateService,
          {} as Actions,
        ),
    );
  });

  it("replaces the current site's orders with the requested page", () => {
    const context = { patchState } as unknown as StateContext<ShopOrdersModel>;

    state.loadOrdersPage(context, new LoadShopOrdersPageAction(2)).subscribe();

    expect(sync).toHaveBeenCalledWith(
      '/orders',
      { site: 'blog', page: 2 },
      'GET',
    );
    expect(patchState).toHaveBeenCalledWith({ blog: SECOND_PAGE });
  });

  it('requests the orders of the filtered status', () => {
    const context = { patchState } as unknown as StateContext<ShopOrdersModel>;

    state
      .loadOrdersPage(context, new LoadShopOrdersPageAction(1, 'paid'))
      .subscribe();

    expect(sync).toHaveBeenCalledWith(
      '/orders',
      { site: 'blog', page: 1, status: 'paid' },
      'GET',
    );
  });

  it('saves the status of an order and shows it on that order only', () => {
    sync.and.returnValue(of({ message: '', data: { value: 'shipped' } }));
    const orders = [
      { id: 6, order_id: 'ORD-6', status: 'paid' },
      { id: 5, order_id: 'ORD-5', status: 'paid' },
    ];
    const context = {
      getState: () => ({ blog: { ...SECOND_PAGE, orders } }),
      patchState,
    } as unknown as StateContext<ShopOrdersModel>;

    state
      .updateOrderStatus(context, new UpdateShopOrderStatusAction(5, 'shipped'))
      .subscribe();

    expect(sync).toHaveBeenCalledWith(
      '/orders',
      { path: 'blog/5/status', value: 'shipped' },
      'PATCH',
    );
    expect(patchState).toHaveBeenCalledWith({
      blog: {
        ...SECOND_PAGE,
        orders: [
          { id: 6, order_id: 'ORD-6', status: 'paid' },
          { id: 5, order_id: 'ORD-5', status: 'shipped' },
        ],
      },
    });
  });

  it('saves the private notes of an order and shows them on that order only', () => {
    sync.and.returnValue(
      of({ message: '', data: { value: 'Ships on Friday.' } }),
    );
    const orders = [
      { id: 6, order_id: 'ORD-6', admin_notes: null },
      { id: 5, order_id: 'ORD-5', admin_notes: null },
    ];
    const context = {
      getState: () => ({ blog: { ...SECOND_PAGE, orders } }),
      patchState,
    } as unknown as StateContext<ShopOrdersModel>;

    state
      .updateOrderNotes(
        context,
        new UpdateShopOrderNotesAction(5, 'Ships on Friday.'),
      )
      .subscribe();

    expect(sync).toHaveBeenCalledWith(
      '/orders',
      { path: 'blog/5/admin_notes', value: 'Ships on Friday.' },
      'PATCH',
    );
    expect(patchState).toHaveBeenCalledWith({
      blog: {
        ...SECOND_PAGE,
        orders: [
          { id: 6, order_id: 'ORD-6', admin_notes: null },
          { id: 5, order_id: 'ORD-5', admin_notes: 'Ships on Friday.' },
        ],
      },
    });
  });
});
