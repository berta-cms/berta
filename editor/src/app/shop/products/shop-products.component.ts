import {
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, combineLatest, merge } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Actions, Store, ofActionSuccessful } from '@ngxs/store';

import { AppState } from '../../app-state/app.state';
import { SiteSectionsState } from '../../sites/sections/sections-state/site-sections.state';
import { SectionTagsState } from '../../sites/sections/tags/section-tags.state';
import { SectionEntriesState } from '../../sites/sections/entries/entries-state/section-entries.state';
import {
  UpdateSectionEntryAction,
  UpdateSectionEntryFromSyncAction,
} from '../../sites/sections/entries/entries-state/section-entries.actions';
import { SwapContentsSitesAction } from '../../sites/sites-state/sites.actions';
import { RefreshIndicator } from '../../shared/refresh-indicator';
import { ShopProductsState } from './shop-products.state';
import {
  LoadShopProductsAction,
  UpdateShopProductAction,
} from './shop-products.actions';
import { UpdateInputFocus } from '../../app-state/app.actions';
import { SiteSectionStateModel } from '../../sites/sections/sections-state/site-sections-state.model';
import { SectionTagsInterface } from '../../sites/sections/tags/section-tags-state.model';
import { SectionEntry } from '../../sites/sections/entries/entries-state/section-entries-state.model';

/** The entry fields a product is made of: its price makes it one, its title and attributes name it */
const CART_FIELDS = ['cartTitle', 'cartPrice', 'cartAttributes'];

interface ProductGroup {
  name: string;
  title: string;
  isTag: boolean;
  hasProducts: boolean;
  products: any[];
}

@Component({
  selector: 'berta-shop-products',
  template: `
    @if (productGroups$ | async; as productGroups) {
      @if (hasProducts(productGroups)) {
        <div class="bt-sh-products-toolbar">
          <button
            type="button"
            class="bt-sh-refresh"
            title="Load the current stock and reservations"
            [class.bt-loading]="loading.showsLoading"
            (click)="loadProducts()"
          >
            <bt-icon-refresh></bt-icon-refresh>
            Refresh stock
          </button>
        </div>
      }
      @for (group of productGroups; track group) {
        <div class="setting" [class.bt-is-empty]="group.products.length === 0">
          <h4 [class.is-tag]="group.isTag">{{ group.title }}</h4>
          @for (product of group.products; track product) {
            <div class="product">
              <berta-text-input
                [value]="product.instock"
                [label]="product.name"
                [title]="'In stock'"
                (update)="updateProducts('instock', $event, product.id)"
                (inputFocus)="updateInputFocus($event)"
              ></berta-text-input>
              <p>
                Reservations: <span>{{ product.reservation }}</span>
              </p>
            </div>
          }
        </div>
      }
    }
  `,
  host: {
    // The listed products fade only while a slow load is still running
    '[class.bt-sh-products-loading]':
      'loading.isLoading && loading.showsLoading',
    '[attr.aria-busy]': 'loading.isLoading',
  },
  standalone: false,
})
export class ShopProductsComponent implements OnInit, OnDestroy {
  productGroups$: Observable<ProductGroup[]>;
  readonly loading = new RefreshIndicator();
  private destroyRef = inject(DestroyRef);

  constructor(
    private store: Store,
    private actions$: Actions,
  ) {}

  ngOnInit() {
    // Shoppers change the stock, and entries added or edited since make new products: the
    // products load as the shop opens, for each site it shows, and as an entry's cart fields change
    merge(
      this.store.select(AppState.getSite).pipe(filter((site) => site !== null)),
      this.actions$.pipe(
        ofActionSuccessful(
          UpdateSectionEntryFromSyncAction,
          UpdateSectionEntryAction,
          SwapContentsSitesAction,
        ),
        filter(
          (action) =>
            action instanceof SwapContentsSitesAction ||
            CART_FIELDS.includes(action.path.split('/').pop()),
        ),
      ),
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadProducts());

    this.productGroups$ = combineLatest([
      this.store.select(SiteSectionsState.getCurrentSiteShopSections),
      this.store.select(SectionTagsState.getCurrentSiteTags),
      this.store.select(SectionEntriesState.getCurrentSiteEntries),
      this.store.select(ShopProductsState.getCurrentSiteProducts),
    ]).pipe(
      map(
        ([sections, tags, entries, products]: [
          SiteSectionStateModel[],
          SectionTagsInterface[],
          SectionEntry[],
          any,
        ]) => {
          // None until the site's products have loaded
          let leftOverProducts = [...(products ?? [])];

          // 1. Add entry data to products
          let productData: any[] = entries.reduce((_productData, entry) => {
            leftOverProducts = leftOverProducts.reduce((_prodRef, product) => {
              const attributes =
                entry.content && entry.content.cartAttributes
                  ? entry.content.cartAttributes.split(/,\s*/i)
                  : [];
              const name = (entry.content && entry.content.cartTitle) || '';

              if (product.uniqid === entry.uniqid) {
                if (
                  (attributes.length === 0 && product.name === name) ||
                  attributes
                    .map(
                      (attribute) =>
                        name + (name.length ? ' ' : '') + attribute,
                    )
                    .indexOf(product.name) > -1
                ) {
                  _productData.push({
                    ...product,
                    entry: entry, // make this more precise, we don't need all the properties of entry here
                  });
                } else {
                  // Ignore any products with this ID and not matching attributes, because they're "deleted"
                }
              } else {
                _prodRef.push(product);
              }

              return _prodRef;
            }, []);

            return _productData;
          }, []);

          // 2. Group products according to entry location in Sections and Tags
          const groups = sections.reduce((_groups, section) => {
            let sectionProducts, sectionTagProducts;

            [sectionProducts, sectionTagProducts, productData] =
              productData.reduce(
                (
                  [_groupProducts, _sectionTagProducts, leftOverProductData],
                  product,
                ) => {
                  if (product.entry.sectionName === section.name) {
                    if (
                      !product.entry.tags ||
                      product.entry.tags.tag.length === 0
                    ) {
                      _groupProducts.push(product);
                    } else {
                      _sectionTagProducts.push(product);
                    }
                  } else {
                    leftOverProductData.push(product);
                  }

                  return [
                    _groupProducts,
                    _sectionTagProducts,
                    leftOverProductData,
                  ];
                },
                [[], [], []],
              );

            // Add section as entry group
            const sectionTags = tags.find(
              (tag) =>
                tag['@attributes'].name === section.name && tag.tag.length > 0,
            );
            _groups.push({
              isTag: false,
              name: section.name,
              title: section.title,
              products: sectionProducts,
              hasProducts: sectionTags && sectionTagProducts.length > 0,
            });

            if (sectionTags) {
              const tagGroups = [...sectionTags.tag]
                .sort((tagA, tagB) => tagA.order - tagB.order)
                .map((tag) => {
                  const tagProducts = sectionTagProducts.filter((product) => {
                    return product.entry.tags.tag.some(
                      (entryTag) => entryTag === tag['@value'],
                    );
                  });

                  return {
                    isTag: true,
                    name: tag['@attributes'].name,
                    title: tag['@value'],
                    products: tagProducts,
                    hasProducts: tagProducts.length > 0,
                  };
                });

              return [..._groups, ...tagGroups];
            }

            return _groups;
          }, []);

          return groups.filter(
            (group) => group.products.length > 0 || group.hasProducts,
          );
        },
      ),
    );
  }

  ngOnDestroy() {
    this.loading.destroy();
  }

  hasProducts(productGroups: ProductGroup[]): boolean {
    return productGroups.some((group) => group.products.length > 0);
  }

  /** A load started while another runs cancels the other */
  loadProducts() {
    this.loading
      .track(this.store.dispatch(new LoadShopProductsAction()))
      // The service shows the error
      .subscribe({ error: () => {} });
  }

  updateProducts(field: string, value, id: string) {
    this.store.dispatch(new UpdateShopProductAction(id, { field, value }));
  }

  updateInputFocus(isFocused: boolean) {
    this.store.dispatch(new UpdateInputFocus(isFocused));
  }
}
