import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { ShopProductsState } from './shop-products.state';

@Component({
  selector: 'berta-shop-products',
  template: `
    <div *ngFor="let product of products$ | async">
      <berta-text-input [label]="product.name" [value]="product.instock"></berta-text-input>
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

  constructor() { }

  ngOnInit() {
  }

}
