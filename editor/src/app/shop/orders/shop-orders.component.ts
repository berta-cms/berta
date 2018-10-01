import { Component, OnInit } from '@angular/core';
import { ShopOrdersState } from './shop-orders.state';
import { Select } from '@ngxs/store';

@Component({
  selector: 'berta-shop-orders',
  template: `
    <div *ngFor="let order of orders$ | async" class="setting">
      <p>{{order.id}}. <span>{{order.created_at}}</span></p>
    </div>
  `
})
export class ShopOrdersComponent implements OnInit {
  @Select(ShopOrdersState.getCurrentSiteOrders) orders$;

  constructor() { }

  ngOnInit() {
  }
}
