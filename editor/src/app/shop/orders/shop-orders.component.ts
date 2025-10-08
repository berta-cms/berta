import { Component } from '@angular/core';
import { Select } from '@ngxs/store';

import { stringToCurrency } from '../../shared/helpers';
import { ShopSettingsState } from '../settings/shop-settings.state';
import { ShopOrdersState } from './shop-orders.state';

@Component({
    selector: 'berta-shop-orders',
    template: `
    @for (order of orders$ | async; track order) {
      <div class="setting">
        <p>
          Order ID
          <span
            ><b>{{ order.order_id }}</b></span
            >
          </p>
          <p>
            Created <span>{{ order.created_at }}</span>
          </p>
          @if (order.company) {
            <p>
              Company <span>{{ order.company }}</span>
            </p>
          }
          @if (order.company_reg_no) {
            <p>
              Company reg. no. <span>{{ order.company_reg_no }}</span>
            </p>
          }
          @if (order.legal_address) {
            <p>
              Legal address <span>{{ order.legal_address }}</span>
            </p>
          }
          <p>
            Name <span>{{ order.name }}</span>
          </p>
          <p>
            Phone <span>{{ order.phone }}</span>
          </p>
          <p>
            Address <span>{{ order.address }}</span>
          </p>
          <p>
            Email <span>{{ order.email }}</span>
          </p>
          @if (
            order.ship_name ||
            order.ship_phone ||
            order.ship_address ||
            order.ship_email ||
            order.ship_notes
            ) {
            <p
              >
              Shipping details
              <span>
                @if (order.ship_name) {
                  <span> {{ order.ship_name }}<br /> </span>
                }
                @if (order.ship_phone) {
                  <span> {{ order.ship_phone }}<br /> </span>
                }
                @if (order.ship_address) {
                  <span>
                    {{ order.ship_address }}<br />
                  </span>
                }
                @if (order.ship_email) {
                  <span> {{ order.ship_email }}<br /> </span>
                }
                @if (order.ship_notes) {
                  <span> {{ order.ship_notes }}<br /> </span>
                }
              </span>
            </p>
          }
          @if (order.send_news) {
            <p>Send news <span>Yes</span></p>
          }
          @if (order.promo_code) {
            <p>
              Promo code <span>{{ order.promo_code }}</span>
            </p>
          }
          <p>
            VAT (%) <span>{{ order.vat }}</span>
          </p>
          <p>
            Shipment
            <span
              >{{ currency$ | async }} {{ stringToCurrency(order.shipping) }}</span
              >
            </p>
            <p>
              Total
              <span>
                <b
                  >{{ currency$ | async }}
                  {{ stringToCurrency(order.price_total) }}</b
                  >
                  @if (order.paypal) {
                    <span> (PayPal)</span>
                  }
                </span>
              </p>
              <div class="card">
                @if (order.orders && order.orders.length) {
                  <table>
                    <tr>
                      <th>Item name</th>
                      <th>Qty</th>
                      <th>Price ({{ currency$ | async }})</th>
                    </tr>
                    @for (item of order.orders; track item) {
                      <tr>
                        <td>{{ item.name }}</td>
                        <td>{{ item.qty }}</td>
                        <td>{{ stringToCurrency(item.sum_total) }}</td>
                      </tr>
                    }
                  </table>
                }
              </div>
            </div>
          }
    `,
    standalone: false
})
export class ShopOrdersComponent {
  @Select(ShopOrdersState.getCurrentSiteOrders) orders$;
  @Select(ShopSettingsState.getCurrentCurrency) currency$;

  stringToCurrency(price) {
    return stringToCurrency(price);
  }
}
