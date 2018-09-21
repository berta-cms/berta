import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ShopProductsState } from './shop-products.state';
import { UpdateShopProductAction } from './shop-products.actions';
import { UpdateInputFocus } from '../../app-state/app.actions';

@Component({
  selector: 'berta-shop-products',
  template: `
    <div *ngFor="let product of products$ | async">
      <berta-text-input [label]="product.name"
                        [value]="product.instock"
                        (update)="updateProducts('instock', $event, product.uniqid)"
                        (inputFocus)="updateInputFocus($event)"></berta-text-input>
      <p>reservations: <span title="Reservations">{{product.reservation}}</span></p>
    </div>
  `,
  styles: [`
    :host > div {
      border-top: 1px solid #ebebeb;
      padding-top: 20px;
    }
    :host > div:first-child {
      border-top: none;
      padding-top: 0;
    }
    p {
      font-size: 0.875em;
      color: #9b9b9b;
      display: flex;
      justify-content: space-between;
    }
    p > span {
      width: 50%;
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
    this.store.dispatch(new UpdateShopProductAction(uniqid, {field, value}));
  }

  updateInputFocus(isFocused: boolean) {
    this.store.dispatch(new UpdateInputFocus(isFocused));
  }
}
