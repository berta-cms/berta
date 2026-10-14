import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';

import { AppState } from '../../app-state/app.state';
import { SitesSharedModule } from '../../sites/shared/sites-shared.module';
import { ShopSettingsState } from '../settings/shop-settings.state';
import { ShopStateService } from '../shop-state.service';
import { UpdateShopOrderNotesAction } from './shop-orders.actions';
import { ShopOrdersComponent } from './shop-orders.component';
import { ShopOrdersPage } from './shop-orders.state';

describe('ShopOrdersComponent', () => {
  const ORDERS_PAGE: ShopOrdersPage = {
    orders: [
      {
        id: 6,
        order_id: 'ORD-6',
        admin_notes: 'Ships on Friday.',
        paypal: 1,
        payment_method: 'creditcard',
        orders: [],
      },
      // Placed before the shop saved the payment method
      { id: 5, order_id: 'ORD-5', admin_notes: null, paypal: 1, orders: [] },
    ],
    page: 1,
    lastPage: 1,
    total: 2,
    statusFilter: null,
  };

  let fixture: ComponentFixture<ShopOrdersComponent>;
  let dispatch: jasmine.Spy;
  let getOrderInvoice: jasmine.Spy;
  let invoicesEnabled: boolean;

  const orderCards = () =>
    Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('.setting'));
  const addNotesButton = (card: HTMLElement) =>
    card.querySelector<HTMLButtonElement>('.bt-sh-order-add-notes');
  const notesTextarea = (card: HTMLElement) => card.querySelector('textarea');
  const invoiceButton = (card: HTMLElement) =>
    card.querySelector<HTMLButtonElement>('.bt-sh-order-download-invoice');
  const paymentMethod = (card: HTMLElement) =>
    Array.from(card.querySelectorAll('p'))
      .find((row) => row.textContent.trim().startsWith('Payment'))
      .querySelector('span')
      .textContent.trim();

  /** The events a browser fires when the textarea loses focus */
  const leave = (textarea: HTMLTextAreaElement) => {
    textarea.dispatchEvent(new FocusEvent('blur'));
    textarea.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    fixture.detectChanges();
  };

  const openNotes = async (card: HTMLElement) => {
    addNotesButton(card).click();
    fixture.detectChanges();
    await fixture.whenStable();

    return notesTextarea(card);
  };

  const createComponent = () => {
    fixture?.nativeElement.remove();
    fixture = TestBed.createComponent(ShopOrdersComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    dispatch = jasmine.createSpy('dispatch').and.returnValue(of(undefined));
    getOrderInvoice = jasmine.createSpy('getOrderInvoice');
    invoicesEnabled = true;
    const store = {
      select: (selector: unknown) => {
        if (selector === ShopSettingsState.getCurrentCurrency) {
          return of('EUR');
        }
        if (selector === ShopSettingsState.getCurrentInvoicesEnabled) {
          return of(invoicesEnabled);
        }
        return of(ORDERS_PAGE);
      },
      selectSnapshot: (selector: unknown) =>
        selector === AppState.getSite
          ? 'second'
          : { orders: 'http://berta.test/_api/v1/plugin/shop/orders' },
      dispatch,
    } as unknown as Store;

    await TestBed.configureTestingModule({
      imports: [SitesSharedModule],
      declarations: [ShopOrdersComponent],
      providers: [
        { provide: Store, useValue: store },
        { provide: ShopStateService, useValue: { getOrderInvoice } },
      ],
    }).compileComponents();

    createComponent();
  });

  afterEach(() => {
    fixture.nativeElement.remove();
  });

  it('shows how an order was paid, and PayPal for an older order paid through PayPal', () => {
    const [cardOrder, olderOrder] = orderCards();

    expect(paymentMethod(cardOrder)).toBe('Debit or credit card');
    expect(paymentMethod(olderOrder)).toBe('PayPal');
  });

  it('shows the notes of an order that has them, and a button on one without', () => {
    const [withNotes, withoutNotes] = orderCards();

    expect(notesTextarea(withNotes).value).toBe('Ships on Friday.');
    expect(addNotesButton(withNotes)).toBeNull();
    expect(notesTextarea(withoutNotes)).toBeNull();
    expect(addNotesButton(withoutNotes).textContent.trim()).toBe(
      'Add private notes',
    );
  });

  it('opens a focused notes field from the button', async () => {
    const textarea = await openNotes(orderCards()[1]);

    expect(textarea).not.toBeNull();
    expect(document.activeElement).toBe(textarea);
  });

  it('closes an opened notes field left empty, without saving', async () => {
    const card = orderCards()[1];
    const textarea = await openNotes(card);

    leave(textarea);

    expect(notesTextarea(card)).toBeNull();
    expect(addNotesButton(card)).not.toBeNull();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('saves typed notes and keeps the notes field open', async () => {
    const card = orderCards()[1];
    const textarea = await openNotes(card);

    textarea.value = 'Gift wrap';
    leave(textarea);

    expect(dispatch).toHaveBeenCalledWith(
      new UpdateShopOrderNotesAction(5, 'Gift wrap'),
    );
    expect(notesTextarea(card)).toBe(textarea);
  });

  it('offers the invoice of each order only while the shop makes invoices', () => {
    expect(orderCards().map((card) => !!invoiceButton(card))).toEqual([
      true,
      true,
    ]);

    invoicesEnabled = false;
    createComponent();

    expect(orderCards().map((card) => !!invoiceButton(card))).toEqual([
      false,
      false,
    ]);
  });

  it("saves an order's invoice as a PDF named by the order's number", () => {
    getOrderInvoice.and.returnValue(
      of(new Blob(['%PDF-'], { type: 'application/pdf' })),
    );
    const click = spyOn(HTMLAnchorElement.prototype, 'click');

    invoiceButton(orderCards()[0]).click();

    expect(getOrderInvoice).toHaveBeenCalledWith(
      'http://berta.test/_api/v1/plugin/shop/orders',
      'second',
      6,
    );
    expect(click).toHaveBeenCalledTimes(1);
    const link = click.calls.mostRecent().object as HTMLAnchorElement;
    expect(link.download).toBe('invoice-ORD-6.pdf');
    expect(link.href).toMatch(/^blob:/);
  });
});
