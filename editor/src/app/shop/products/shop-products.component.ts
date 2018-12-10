import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { SiteSectionsState } from '../../sites/sections/sections-state/site-sections.state';
import { SectionTagsState } from '../../sites/sections/tags/section-tags.state';
import { SectionEntriesState } from '../../sites/sections/entries/entries-state/section-entries.state';
import { ShopProductsState } from './shop-products.state';
import { UpdateShopProductAction } from './shop-products.actions';
import { UpdateInputFocus } from '../../app-state/app.actions';

@Component({
  selector: 'berta-shop-products',
  template: `
    <div *ngFor="let product of products$ | async" class="setting">
      <berta-text-input [value]="product.instock"
                        [label]="product.name"
                        [title]="'In stock'"
                        (update)="updateProducts('instock', $event, product.id)"
                        (inputFocus)="updateInputFocus($event)"></berta-text-input>
      <p>Reservations: <span>{{product.reservation}}</span></p>
    </div>
  `
})
export class ShopProductsComponent implements OnInit {
  @Select(ShopProductsState.getCurrentSiteProducts) products$;

  productsData$: Observable<any>;  // <- @TODO create interface

  constructor(
    private store: Store) {
  }

  ngOnInit() {
    this.productsData$ = combineLatest(
      this.store.select(SiteSectionsState.getCurrentSiteShopSections),
      this.store.select(SectionTagsState.getCurrentSiteTags),
      this.store.select(SectionEntriesState.getCurrentSiteEntries),
      this.products$
    );

    this.productsData$.subscribe(([sections, tags, entries, products]) => {
      console.log('sections', sections);
      console.log('tags', tags);
      console.log('entries', entries);
      console.log('products', products);
    });

  }

  updateProducts(field: string, value, id: string) {
    this.store.dispatch(new UpdateShopProductAction(id, {field, value}));
  }

  updateInputFocus(isFocused: boolean) {
    this.store.dispatch(new UpdateInputFocus(isFocused));
  }
}
