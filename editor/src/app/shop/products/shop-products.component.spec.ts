import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Actions, ActionStatus, Store } from '@ngxs/store';
import { BehaviorSubject, Subject, of } from 'rxjs';

import { AppState } from '../../app-state/app.state';
import { SiteSectionsState } from '../../sites/sections/sections-state/site-sections.state';
import { SectionTagsState } from '../../sites/sections/tags/section-tags.state';
import { SectionEntriesState } from '../../sites/sections/entries/entries-state/section-entries.state';
import {
  UpdateSectionEntryAction,
  UpdateSectionEntryFromSyncAction,
} from '../../sites/sections/entries/entries-state/section-entries.actions';
import { SitesSharedModule } from '../../sites/shared/sites-shared.module';
import { SwapContentsSitesAction } from '../../sites/sites-state/sites.actions';
import { LoadShopProductsAction } from './shop-products.actions';
import { ShopProductsComponent } from './shop-products.component';
import { ShopProduct, ShopProductsState } from './shop-products.state';

describe('ShopProductsComponent', () => {
  const PRODUCTS: ShopProduct[] = [
    { id: '1', uniqid: 'abc', name: 'Poster', instock: 3, reservation: 1 },
  ];

  let fixture: ComponentFixture<ShopProductsComponent>;
  let dispatch: jasmine.Spy;
  let site$: BehaviorSubject<string>;
  let products$: BehaviorSubject<ShopProduct[] | undefined>;
  let actions$: Subject<{ action: unknown; status: ActionStatus }>;

  const refreshButton = (): HTMLButtonElement =>
    fixture.nativeElement.querySelector('.bt-sh-refresh');
  const loadCount = () =>
    dispatch.calls
      .allArgs()
      .filter(([action]) => action instanceof LoadShopProductsAction).length;
  const succeed = (action: unknown) =>
    actions$.next({ action, status: ActionStatus.Successful });

  beforeEach(async () => {
    dispatch = jasmine.createSpy('dispatch').and.returnValue(of(undefined));
    site$ = new BehaviorSubject('blog');
    products$ = new BehaviorSubject(PRODUCTS);
    actions$ = new Subject();
    const selected = new Map<unknown, unknown>([
      [AppState.getSite, site$],
      [
        SiteSectionsState.getCurrentSiteShopSections,
        of([{ name: 'shop', title: 'Shop' }]),
      ],
      [SectionTagsState.getCurrentSiteTags, of([])],
      [
        SectionEntriesState.getCurrentSiteEntries,
        of([
          {
            uniqid: 'abc',
            sectionName: 'shop',
            content: { cartTitle: 'Poster' },
          },
        ]),
      ],
      [ShopProductsState.getCurrentSiteProducts, products$],
    ]);
    const store = {
      select: (selector: unknown) => selected.get(selector),
      dispatch,
    } as unknown as Store;

    await TestBed.configureTestingModule({
      imports: [SitesSharedModule],
      declarations: [ShopProductsComponent],
      providers: [
        { provide: Store, useValue: store },
        { provide: Actions, useValue: actions$ },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShopProductsComponent);
    fixture.detectChanges();
  });

  it('loads the products as they open, and the products of the site switched to', () => {
    expect(loadCount()).toBe(1);

    site$.next('second');

    expect(loadCount()).toBe(2);
  });

  it("loads the products again as an entry's cart fields change", () => {
    succeed(
      new UpdateSectionEntryAction('blog/entry/shop/1/content/cartPrice', '25'),
    );
    succeed(
      new UpdateSectionEntryFromSyncAction(
        'blog/entry/shop/1/content/cartAttributes',
        'S, M',
      ),
    );
    succeed(
      new SwapContentsSitesAction({ siteSlugFrom: 'blog', siteSlugTo: '' }),
    );

    expect(loadCount()).toBe(4);

    succeed(
      new UpdateSectionEntryAction(
        'blog/entry/shop/1/content/description',
        'A poster',
      ),
    );

    expect(loadCount()).toBe(4);
  });

  it('refreshes the stock from the button shown while products are listed', () => {
    expect(refreshButton().textContent.trim()).toBe('Refresh stock');

    refreshButton().click();

    expect(loadCount()).toBe(2);

    products$.next([]);
    fixture.detectChanges();

    expect(refreshButton()).toBeNull();
  });

  it('lists nothing before the products have loaded', () => {
    products$.next(undefined);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.setting')).toBeNull();
    expect(refreshButton()).toBeNull();
  });
});
