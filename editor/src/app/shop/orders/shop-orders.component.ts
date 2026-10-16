import {
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Actions, Store, ofActionSuccessful } from '@ngxs/store';
import { Observable, merge } from 'rxjs';
import { filter, finalize } from 'rxjs/operators';

import { AppState } from '../../app-state/app.state';
import { stringToCurrency } from '../../shared/helpers';
import { SwapContentsSitesAction } from '../../sites/sites-state/sites.actions';
import { RefreshIndicator } from '../../shared/refresh-indicator';
import { ShopSettingsState } from '../settings/shop-settings.state';
import { ShopStateService } from '../shop-state.service';
import { ShopState } from '../shop.state';
import {
  LoadShopOrdersPageAction,
  UpdateShopOrderNotesAction,
  UpdateShopOrderStatusAction,
} from './shop-orders.actions';
import { ShopOrdersPage, ShopOrdersState } from './shop-orders.state';

/** The statuses of ShopOrderStatus in the shop plugin */
const ORDER_STATUSES = [
  { value: 'awaiting_payment', title: 'Awaiting payment' },
  { value: 'paid', title: 'Paid' },
  { value: 'shipped', title: 'Shipped' },
  { value: 'cancelled', title: 'Cancelled' },
  { value: 'refunded', title: 'Refunded' },
];

/** The payment methods of ShopCheckoutService in the shop plugin */
const PAYMENT_METHODS: Record<string, string> = {
  bank_transfer: 'Bank transfer',
  paypal: 'PayPal',
  creditcard: 'Debit or credit card',
};

@Component({
  selector: 'berta-shop-orders',
  template: `
    @if (ordersPage$ | async; as ordersPage) {
      <div class="bt-sh-orders-toolbar">
        <p>
          {{ ordersPage.total }}
          {{ ordersPage.total === 1 ? 'order' : 'orders' }}
        </p>
        <div class="bt-sh-orders-actions">
          <button
            type="button"
            class="bt-sh-refresh"
            title="Load the newest orders"
            [class.bt-loading]="loading.showsLoading"
            (click)="goToPage(1, activeStatusFilter(ordersPage))"
          >
            <bt-icon-refresh></bt-icon-refresh>
            Refresh
          </button>
        </div>
        <div
          class="bt-sh-orders-filter"
          role="group"
          aria-label="Filter orders by status"
        >
          @for (chip of filterChips; track chip.title) {
            <button
              type="button"
              [class.bt-active]="activeStatusFilter(ordersPage) === chip.value"
              [attr.aria-pressed]="
                activeStatusFilter(ordersPage) === chip.value
              "
              (click)="goToPage(1, chip.value)"
            >
              {{ chip.title }}
            </button>
          }
        </div>
      </div>
      @if (ordersPage.statusFilter && !ordersPage.orders.length) {
        <div class="bt-sh-orders-empty"><p>No orders with this status.</p></div>
      }
      @for (order of ordersPage.orders; track order.id) {
        <div class="setting">
          <div class="bt-sh-order-header">
            <p>
              Order ID <b>{{ order.order_id }}</b>
            </p>
            <berta-select-input
              class="bt-sh-order-status"
              [attr.data-status]="order.status ?? 'none'"
              label=""
              placeholder="Set status"
              [value]="order.status"
              [values]="order.paypal ? paypalStatusOptions : statusOptions"
              [enabledOnUpdate]="true"
              (update)="updateStatus(order.id, $event)"
            ></berta-select-input>
          </div>
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
          @if (order.vat_no) {
            <p>
              VAT no. <span>{{ order.vat_no }}</span>
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
          @if (order.notes) {
            <p>
              Customer notes
              <span class="bt-sh-order-notes">{{ order.notes }}</span>
            </p>
          }
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
                  <span class="bt-sh-order-notes">{{ order.ship_notes }}</span>
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
            </span>
          </p>
          <p>
            Payment
            <span>{{ paymentMethodTitle(order) }}</span>
          </p>
          @if (order.payment_reference) {
            <p>
              PayPal transaction <span>{{ order.payment_reference }}</span>
            </p>
          }
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
          @if (invoicesEnabled$ | async) {
            <button
              type="button"
              class="bt-sh-order-download-invoice"
              [disabled]="invoiceLoadingFor.has(order.id)"
              (click)="downloadInvoice(order)"
            >
              <bt-icon-download></bt-icon-download>
              Download invoice
            </button>
          }
          @if (order.admin_notes || notesOpenedFor.has(order.id)) {
            <berta-long-text-input
              label="Private notes"
              [value]="order.admin_notes ?? ''"
              [autofocus]="!order.admin_notes"
              [enabledOnUpdate]="true"
              (update)="updateNotes(order.id, $event)"
              (focusout)="closeEmptyNotes(order.id, $event)"
            ></berta-long-text-input>
          } @else {
            <button
              type="button"
              class="bt-sh-order-add-notes"
              (click)="notesOpenedFor.add(order.id)"
            >
              <bt-icon-edit></bt-icon-edit>
              Add private notes
            </button>
          }
        </div>
      }
      @if (ordersPage.lastPage > 1) {
        <div class="bt-sh-orders-pager">
          <button
            type="button"
            class="button"
            [disabled]="ordersPage.page <= 1"
            (click)="goToPage(ordersPage.page - 1, ordersPage.statusFilter)"
          >
            ‹ Prev
          </button>
          <p>Page {{ ordersPage.page }} of {{ ordersPage.lastPage }}</p>
          <button
            type="button"
            class="button"
            [disabled]="ordersPage.page >= ordersPage.lastPage"
            (click)="goToPage(ordersPage.page + 1, ordersPage.statusFilter)"
          >
            Next ›
          </button>
        </div>
      }
    }
  `,
  host: {
    // The listed orders fade only while a slow load is still running
    '[class.bt-sh-orders-loading]': 'loading.isLoading && loading.showsLoading',
    '[attr.aria-busy]': 'loading.isLoading',
  },
  standalone: false,
})
export class ShopOrdersComponent implements OnInit, OnDestroy {
  ordersPage$: Observable<ShopOrdersPage>;
  currency$: Observable<string>;
  invoicesEnabled$: Observable<boolean>;
  readonly loading = new RefreshIndicator();
  private destroyRef = inject(DestroyRef);
  /** The status chosen while its orders load, undefined while none are loading */
  pendingStatusFilter: string | null | undefined;
  /** The orders without notes whose notes field the shop owner has opened */
  notesOpenedFor = new Set<number>();
  /** The orders whose invoice is being downloaded */
  invoiceLoadingFor = new Set<number>();

  // 'All' clears the filter; 'none' finds the orders placed before statuses existed
  readonly filterChips: { value: string | null; title: string }[] = [
    { value: null, title: 'All' },
    { value: 'none', title: 'No status' },
    ...ORDER_STATUSES,
  ];
  readonly statusOptions = ORDER_STATUSES;
  // A PayPal order is saved only once PayPal has taken the money
  readonly paypalStatusOptions = ORDER_STATUSES.filter(
    (status) => status.value !== 'awaiting_payment',
  );

  constructor(
    private store: Store,
    private actions$: Actions,
    private elementRef: ElementRef<HTMLElement>,
    private shopStateService: ShopStateService,
  ) {
    this.ordersPage$ = this.store.select(
      ShopOrdersState.getCurrentSiteOrdersPage,
    );
    this.currency$ = this.store.select(ShopSettingsState.getCurrentCurrency);
    this.invoicesEnabled$ = this.store.select(
      ShopSettingsState.getCurrentInvoicesEnabled,
    );
  }

  ngOnInit() {
    // Shoppers place orders while the editor is open: the newest orders of the chosen status load
    // as the shop opens, for each site it shows, and for the site whose contents were swapped in
    merge(
      this.store.select(AppState.getSite).pipe(filter((site) => site !== null)),
      this.actions$.pipe(ofActionSuccessful(SwapContentsSitesAction)),
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const ordersPage = this.store.selectSnapshot(
          ShopOrdersState.getCurrentSiteOrdersPage,
        );

        this.loadPage(1, ordersPage?.statusFilter ?? null).subscribe({
          // The service shows the error
          error: () => {},
        });
      });
  }

  ngOnDestroy() {
    this.loading.destroy();
  }

  /** The chosen status chip: the one clicked, before its orders have loaded */
  activeStatusFilter(ordersPage: ShopOrdersPage): string | null {
    return this.pendingStatusFilter !== undefined
      ? this.pendingStatusFilter
      : (ordersPage.statusFilter ?? null);
  }

  /** Shows a page of orders from its top */
  goToPage(page: number, statusFilter: string | null) {
    this.loadPage(page, statusFilter).subscribe({
      next: () => {
        this.elementRef.nativeElement.scrollIntoView({ block: 'start' });
      },
      // The service shows the error
      error: () => {},
    });
  }

  /** A load started while another runs cancels the other */
  private loadPage(page: number, statusFilter: string | null) {
    this.pendingStatusFilter = statusFilter;

    return this.loading.track(
      this.store.dispatch(new LoadShopOrdersPageAction(page, statusFilter)),
      () => (this.pendingStatusFilter = undefined),
    );
  }

  updateStatus(orderId: number, status: string) {
    this.store.dispatch(new UpdateShopOrderStatusAction(orderId, status));
  }

  updateNotes(orderId: number, notes: string) {
    this.store.dispatch(new UpdateShopOrderNotesAction(orderId, notes));
  }

  /**
   * Collapses an empty notes field back to its button. Runs after the textarea's blur has saved,
   * and reads the textarea rather than the store, so typed notes stay open while they're saved.
   */
  closeEmptyNotes(orderId: number, event: FocusEvent) {
    if (!(event.target as HTMLTextAreaElement).value.trim()) {
      this.notesOpenedFor.delete(orderId);
    }
  }

  /** Saves the order's invoice PDF. The shop's message is shown when it has none. */
  downloadInvoice(order: { id: number; order_id: string }) {
    const site = this.store.selectSnapshot(AppState.getSite);
    const ordersUrl = this.store.selectSnapshot(ShopState.getURLs).orders;

    this.invoiceLoadingFor.add(order.id);
    this.shopStateService
      .getOrderInvoice(ordersUrl, site, order.id)
      .pipe(finalize(() => this.invoiceLoadingFor.delete(order.id)))
      .subscribe({
        next: (pdf) => {
          const url = URL.createObjectURL(pdf);
          const link = document.createElement('a');
          link.href = url;
          link.download = `invoice-${order.order_id}.pdf`;
          link.click();
          // Once the browser has taken the file
          setTimeout(() => URL.revokeObjectURL(url));
        },
        // The service shows the error
        error: () => {},
      });
  }

  /**
   * Orders placed before the shop saved the payment method only know whether they went through
   * PayPal, which took card payments too
   */
  paymentMethodTitle(order: {
    payment_method?: string | null;
    paypal?: number | null;
  }) {
    return (
      PAYMENT_METHODS[order.payment_method] ??
      (order.paypal ? PAYMENT_METHODS.paypal : PAYMENT_METHODS.bank_transfer)
    );
  }

  stringToCurrency(price) {
    return stringToCurrency(price);
  }
}
