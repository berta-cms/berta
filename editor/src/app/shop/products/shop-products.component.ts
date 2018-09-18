import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { ShopProductsState } from './shop-products.state';

@Component({
  selector: 'berta-shop-products',
  template: `
    <ul>
      <li *ngFor="let product of products$ | async"><b>{{product.name}}:</b>
        <span title="Reservations">{{product.reservation}}</span>/<span title="In Stock">{{product.instock}}</span></li>
    </ul>
  `,
  styles: []
})
export class ShopProductsComponent implements OnInit {
  @Select(ShopProductsState.getCurrentSiteProducts) products$;

  constructor() { }

  ngOnInit() {
  }

}
