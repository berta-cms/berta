import { Component } from '@angular/core';
import { Select } from '@ngxs/store';

import { stringToCurrency } from '../../shared/helpers';
import { ShopSettingsState } from '../settings/shop-settings.state';
import { ShopOrdersState } from './shop-orders.state';

@Component({
  selector: 'berta-shop-orders',
  template: `
    <div *ngFor="let order of orders$ | async" class="setting">
      <p>Order ID <span><b>{{order.order_id}}</b></span></p>
      <p>Created <span>{{order.created_at}}</span></p>
      <p *ngIf="order.company">Company <span>{{order.company}}</span></p>
      <p *ngIf="order.company_reg_no">Company reg. no. <span>{{order.company_reg_no}}</span></p>
      <p *ngIf="order.legal_address">Legal address <span>{{order.legal_address}}</span></p>
      <p>Name <span>{{order.name}}</span></p>
      <p>Phone <span>{{order.phone}}</span></p>
      <p>Address <span>{{order.address}}</span></p>
      <p>Email <span>{{order.email}}</span></p>
      <p *ngIf="(order.ship_name || order.ship_phone || order.ship_address || order.ship_email || order.ship_notes)">
        Shipping details
        <span>
          <span *ngIf="order.ship_name">
            {{order.ship_name}}<br>
          </span>
          <span *ngIf="order.ship_phone">
            {{order.ship_phone}}<br>
          </span>
          <span *ngIf="order.ship_address">
            {{order.ship_address}}<br>
          </span>
          <span *ngIf="order.ship_email">
            {{order.ship_email}}<br>
          </span>
          <span *ngIf="order.ship_notes">
            {{order.ship_notes}}<br>
          </span>
        </span>
      </p>
      <p *ngIf="order.send_news">Send news <span>Yes</span></p>
      <p *ngIf="order.promo_code">Promo code <span>{{order.promo_code}}</span></p>
      <p>VAT (%) <span>{{order.vat}}</span></p>
      <p>Shipment <span>{{currency$ | async}} {{stringToCurrency(order.shipping)}}</span></p>
      <p>
        Total
        <span>
          <b>{{currency$ | async}} {{stringToCurrency(order.price_total)}}</b>
          <span *ngIf="order.paypal"> (PayPal)</span>
        </span>
      </p>

      <div class="card">
        <table *ngIf="(order.orders && order.orders.length)">
          <tr>
            <th>Item name</th>
            <th>Qty</th>
            <th>Price ({{currency$ | async}})</th>
          </tr>
          <tr *ngFor="let item of order.orders">
            <td>{{item.name}}</td>
            <td>{{item.qty}}</td>
            <td>{{stringToCurrency(item.sum_total)}}</td>
          </tr>
        </table>
      </div>
    </div>
  `
})
export class ShopOrdersComponent {
  @Select(ShopOrdersState.getCurrentSiteOrders) orders$;
  @Select(ShopSettingsState.getCurrentCurrency) currency$;

  stringToCurrency(price) {
    return stringToCurrency(price);
  }
}
