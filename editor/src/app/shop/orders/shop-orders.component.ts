import { Component, ElementRef } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { stringToCurrency } from '../../shared/helpers';
import { ShopSettingsState } from '../settings/shop-settings.state';
import { LoadShopOrdersPageAction } from './shop-orders.actions';
import { ShopOrdersPage, ShopOrdersState } from './shop-orders.state';

@Component({
  selector: 'berta-shop-orders',
  template: `
    @if (ordersPage$ | async; as ordersPage) {
      <div class="bt-sh-orders-toolbar">
        <p>{{ ordersPage.total }} orders</p>
        <button
          type="button"
          title="Load the newest orders"
          [disabled]="isLoading"
          (click)="goToPage(1)"
        >
          <bt-icon-refresh></bt-icon-refresh>
          {{ isLoading ? 'Refreshing…' : 'Refresh' }}
        </button>
      </div>
      @for (order of ordersPage.orders; track order.id) {
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
            <p>
              Shipping details
              <span>
                @if (order.ship_name) {
                  <span> {{ order.ship_name }}<br /> </span>
                }
                @if (order.ship_phone) {
                  <span> {{ order.ship_phone }}<br /> </span>
                }
                @if (order.ship_address) {
                  <span> {{ order.ship_address }}<br /> </span>
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
              >{{ currency$ | async }}
              {{ stringToCurrency(order.shipping) }}</span
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
      @if (ordersPage.lastPage > 1) {
        <div class="bt-sh-orders-pager">
          <button
            type="button"
            class="button"
            [disabled]="isLoading || ordersPage.page <= 1"
            (click)="goToPage(ordersPage.page - 1)"
          >
            ‹ Prev
          </button>
          <p>Page {{ ordersPage.page }} of {{ ordersPage.lastPage }}</p>
          <button
            type="button"
            class="button"
            [disabled]="isLoading || ordersPage.page >= ordersPage.lastPage"
            (click)="goToPage(ordersPage.page + 1)"
          >
            Next ›
          </button>
        </div>
      }
    }
  `,
  standalone: false,
})
export class ShopOrdersComponent {
  ordersPage$: Observable<ShopOrdersPage>;
  currency$: Observable<string>;
  isLoading = false;

  constructor(
    private store: Store,
    private elementRef: ElementRef<HTMLElement>,
  ) {
    this.ordersPage$ = this.store.select(
      ShopOrdersState.getCurrentSiteOrdersPage,
    );
    this.currency$ = this.store.select(ShopSettingsState.getCurrentCurrency);
  }

  goToPage(page: number) {
    this.isLoading = true;
    this.store
      .dispatch(new LoadShopOrdersPageAction(page))
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => {
        this.elementRef.nativeElement.scrollIntoView({ block: 'start' });
      });
  }

  stringToCurrency(price) {
    return stringToCurrency(price);
  }
}
