import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
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
                        (update)="updateProducts('instock', $event, product.uniqid)"
                        (inputFocus)="updateInputFocus($event)"></berta-text-input>
      <p>Reservations: <span>{{product.reservation}}</span></p>
    </div>
  `
})
export class ShopProductsComponent implements OnInit {
  @Select(ShopProductsState.getCurrentSiteProducts) products$;

  constructor(
    private store: Store) {
  }

  ngOnInit() {
  }

  updateProducts(field: string, value, uniqid: string) {
    this.store.dispatch(new UpdateShopProductAction(uniqid, {field, value}));
  }

  updateInputFocus(isFocused: boolean) {
    this.store.dispatch(new UpdateInputFocus(isFocused));
  }
}
