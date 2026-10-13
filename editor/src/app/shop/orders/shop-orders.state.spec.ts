import { TestBed } from '@angular/core/testing';
import { Actions, StateContext, Store } from '@ngxs/store';
import { of } from 'rxjs';

import {
  ShopOrdersModel,
  ShopOrdersPage,
  ShopOrdersState,
} from './shop-orders.state';
import { LoadShopOrdersPageAction } from './shop-orders.actions';
import { AppState } from '../../app-state/app.state';
import { AppStateService } from '../../app-state/app-state.service';
import { ShopStateService } from '../shop-state.service';

describe('ShopOrdersState', () => {
  const SECOND_PAGE: ShopOrdersPage = {
    orders: [{ id: 5, order_id: 'ORD-5', orders: [] }],
    page: 2,
    lastPage: 2,
    total: 21,
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
});
