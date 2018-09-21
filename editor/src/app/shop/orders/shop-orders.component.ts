import { Component, OnInit } from '@angular/core';
import { ShopOrdersState } from './shop-orders.state';
import { Select } from '@ngxs/store';

@Component({
  selector: 'berta-shop-orders',
  template: `
    <div *ngFor="let order of orders$ | async">
      <p>{{order.id}}. <span>{{order.created_at}}</span></p>
    </div>
  `,
  styles: [`
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
export class ShopOrdersComponent implements OnInit {
  @Select(ShopOrdersState.getCurrentSiteOrders) orders$;

  constructor() { }

  ngOnInit() {
  }

}
