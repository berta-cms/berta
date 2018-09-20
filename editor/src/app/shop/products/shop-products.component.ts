import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ShopProductsState } from './shop-products.state';
import { UpdateProductAction } from './shop-products.actions';
import { UpdateInputFocus } from '../../app-state/app.actions';

@Component({
  selector: 'berta-shop-products',
  template: `
    <div *ngFor="let product of products$ | async">
      <berta-text-input [label]="product.name"
                        [value]="product.instock"
                        (update)="updateProducts('instock', $event, product.uniqid)"
                        (inputFocus)="updateInputFocus($event)"></berta-text-input>
      <p>Reservations: <span title="Reservations">{{product.reservation}}</span></p>
    </div>
  `,
  styles: [`
      p {
        font-size: 0.875em;
        text-align: right;
      }
  `]
})
export class ShopProductsComponent implements OnInit {
  @Select(ShopProductsState.getCurrentSiteProducts) products$;

  constructor(
    private store: Store) {
  }

  ngOnInit() {
  }

  updateProducts(field: string, value, uniqid: string) {
    this.store.dispatch(new UpdateProductAction(uniqid, {field, value}));
  }

  updateInputFocus(isFocused: boolean) {
    this.store.dispatch(new UpdateInputFocus(isFocused));
  }
}
