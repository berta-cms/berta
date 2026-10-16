import { TestBed } from '@angular/core/testing';
import { Actions, StateContext, Store } from '@ngxs/store';
import { of } from 'rxjs';

import {
  ShopRegionalCostsModel,
  ShopRegionalCostsState,
} from './shop-regional-costs.state';
import { UpdateShopRegionCostAction } from './shop-regional-costs.actions';
import { AppState } from '../../app-state/app.state';
import { AppStateService } from '../../app-state/app-state.service';
import { ShopStateService } from '../shop-state.service';

describe('ShopRegionalCostsState', () => {
  // Cost ids that differ from their regions' ids, as in a shop with several regions
  const REGIONS: ShopRegionalCostsModel = {
    blog: [
      {
        id: 1,
        name: 'Latvia',
        vat: 21,
        costs: [
          { id: 3, weight: 500, price: 5 },
          { id: 4, weight: 1000, price: 8 },
        ],
      },
      {
        id: 2,
        name: 'Europe',
        vat: 21,
        costs: [
          { id: 5, weight: 500, price: 10 },
          { id: 6, weight: 1000, price: 15 },
        ],
      },
    ],
  };

  let sync: jasmine.Spy;
  let patchState: jasmine.Spy;
  let state: ShopRegionalCostsState;

  beforeEach(() => {
    sync = jasmine
      .createSpy('sync')
      .and.returnValue(of({ message: '', data: { value: '7' } }));
    patchState = jasmine.createSpy('patchState');
    const store = {
      selectSnapshot: (selector: unknown) =>
        selector === AppState.getSite
          ? 'blog'
          : { regionalCosts: '/regional-costs' },
    } as unknown as Store;

    state = TestBed.runInInjectionContext(
      () =>
        new ShopRegionalCostsState(
          store,
          { sync } as unknown as AppStateService,
          {} as ShopStateService,
          {} as Actions,
        ),
    );
  });

  it("saves a cost's price to that cost, not to its region's id", () => {
    const context = {
      getState: () => REGIONS,
      patchState,
    } as unknown as StateContext<ShopRegionalCostsModel>;

    state
      .updateShopRegionalCost(
        context,
        new UpdateShopRegionCostAction(2, 5, { field: 'price', value: '7' }),
      )
      .subscribe();

    expect(sync).toHaveBeenCalledWith(
      '/regional-costs',
      { path: 'blog/5/price', value: '7' },
      'PATCH',
    );

    const updated = patchState.calls.mostRecent().args[0].blog;
    expect(updated[1].costs).toEqual([
      { id: 5, weight: 500, price: '7' },
      { id: 6, weight: 1000, price: 15 },
    ]);
    expect(updated[0]).toBe(REGIONS['blog'][0]);
  });
});
