import { StateContext, Store } from '@ngxs/store';
import { BehaviorSubject, of } from 'rxjs';

import { AppState } from '../../app-state/app.state';
import { AppStateService } from '../../app-state/app-state.service';
import { ShopState } from '../shop.state';
import {
  ShopProduct,
  ShopProductsModel,
  ShopProductsState,
} from './shop-products.state';

describe('ShopProductsState', () => {
  const PRODUCTS: ShopProduct[] = [
    { id: '1', uniqid: 'abc', name: 'Poster', instock: 3, reservation: 1 },
  ];

  let urls$: BehaviorSubject<{ [sectionSlug: string]: string }>;
  let sync: jasmine.Spy;
  let context: StateContext<ShopProductsModel>;
  let state: ShopProductsState;

  beforeEach(() => {
    urls$ = new BehaviorSubject({ products: '/products' });
    sync = jasmine
      .createSpy('sync')
      .and.returnValue(of({ message: '', data: { blog: PRODUCTS } }));
    context = {
      patchState: jasmine.createSpy('patchState'),
    } as unknown as StateContext<ShopProductsModel>;
    const store = {
      selectSnapshot: (selector: unknown) =>
        selector === AppState.getSite ? 'blog' : undefined,
      select: (selector: unknown) =>
        selector === ShopState.getURLs ? urls$ : undefined,
    } as unknown as Store;

    state = new ShopProductsState(store, {
      sync,
    } as unknown as AppStateService);
  });

  it("replaces the current site's products with the loaded ones", () => {
    state.loadProducts(context).subscribe();

    expect(sync).toHaveBeenCalledWith('/products', { site: 'blog' }, 'GET');
    expect(context.patchState).toHaveBeenCalledWith({ blog: PRODUCTS });
  });

  it("loads the products once the shop's URLs have come", () => {
    urls$.next({});

    state.loadProducts(context).subscribe();

    expect(sync).not.toHaveBeenCalled();

    urls$.next({ products: '/products' });

    expect(sync).toHaveBeenCalledWith('/products', { site: 'blog' }, 'GET');
    expect(context.patchState).toHaveBeenCalledWith({ blog: PRODUCTS });
  });
});
