import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Actions, ActionStatus, Store } from '@ngxs/store';
import { BehaviorSubject, Subject, of } from 'rxjs';

import { AppState } from '../../app-state/app.state';
import { SitesSharedModule } from '../../sites/shared/sites-shared.module';
import { SwapContentsSitesAction } from '../../sites/sites-state/sites.actions';
import { ShopSettingsState } from '../settings/shop-settings.state';
import { ShopStateService } from '../shop-state.service';
import {
  LoadShopOrdersPageAction,
  UpdateShopOrderNotesAction,
} from './shop-orders.actions';
import { ShopOrdersComponent } from './shop-orders.component';
import { ShopOrdersPage, ShopOrdersState } from './shop-orders.state';

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
  /** The status the stored orders are filtered by */
  let statusFilter: string | null;
  let site$: BehaviorSubject<string>;
  let actions$: Subject<{ action: unknown; status: ActionStatus }>;

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
    statusFilter = null;
    site$ = new BehaviorSubject('second');
    actions$ = new Subject();
    const store = {
      select: (selector: unknown) => {
        if (selector === AppState.getSite) {
          return site$;
        }
        if (selector === ShopSettingsState.getCurrentCurrency) {
          return of('EUR');
        }
        if (selector === ShopSettingsState.getCurrentInvoicesEnabled) {
          return of(invoicesEnabled);
        }
        return of(ORDERS_PAGE);
      },
      selectSnapshot: (selector: unknown) => {
        if (selector === AppState.getSite) {
          return 'second';
        }
        if (selector === ShopOrdersState.getCurrentSiteOrdersPage) {
          return { ...ORDERS_PAGE, statusFilter };
        }
        return { orders: 'http://berta.test/_api/v1/plugin/shop/orders' };
      },
      dispatch,
    } as unknown as Store;

    await TestBed.configureTestingModule({
      imports: [SitesSharedModule],
      declarations: [ShopOrdersComponent],
      providers: [
        { provide: Store, useValue: store },
        { provide: Actions, useValue: actions$ },
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
    expect(dispatch).not.toHaveBeenCalledWith(
      jasmine.any(UpdateShopOrderNotesAction),
    );
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

  describe('opening', () => {
    let scrollIntoView: jasmine.Spy;

    beforeEach(() => {
      dispatch.calls.reset();
      scrollIntoView = spyOn(HTMLElement.prototype, 'scrollIntoView');
    });

    it('loads the newest orders of the chosen status as the shop opens, without scrolling to them', () => {
      statusFilter = 'paid';
      createComponent();

      expect(dispatch.calls.allArgs()).toEqual([
        [new LoadShopOrdersPageAction(1, 'paid')],
      ]);
      expect(scrollIntoView).not.toHaveBeenCalled();
    });

    it('loads the newest orders of the site switched to, and of the site whose contents were swapped in', () => {
      site$.next('third');
      actions$.next({
        action: new SwapContentsSitesAction({
          siteSlugFrom: 'second',
          siteSlugTo: 'third',
        }),
        status: ActionStatus.Successful,
      });

      expect(dispatch.calls.allArgs()).toEqual([
        [new LoadShopOrdersPageAction(1, null)],
        [new LoadShopOrdersPageAction(1, null)],
      ]);
    });
  });

  describe('loading', () => {
    let load: Subject<void>;

    const refreshButton = (): HTMLButtonElement =>
      fixture.nativeElement.querySelector('.bt-sh-orders-actions button');
    const chip = (title: string) =>
      Array.from<HTMLButtonElement>(
        fixture.nativeElement.querySelectorAll('.bt-sh-orders-filter button'),
      ).find((button) => button.textContent.trim() === title);
    const spins = () => refreshButton().classList.contains('bt-loading');
    const fades = () =>
      fixture.nativeElement.classList.contains('bt-sh-orders-loading');

    /** Lets time pass, then renders */
    const wait = (ms: number) => {
      tick(ms);
      fixture.detectChanges();
    };
    const finishLoad = () => {
      load.next();
      load.complete();
      fixture.detectChanges();
    };

    beforeEach(() => {
      load = new Subject<void>();
      dispatch.and.returnValue(load);
      spyOn(HTMLElement.prototype, 'scrollIntoView');
    });

    it('chooses the clicked status chip before its orders have loaded', fakeAsync(() => {
      chip('Paid').click();
      fixture.detectChanges();

      expect(dispatch).toHaveBeenCalledWith(
        new LoadShopOrdersPageAction(1, 'paid'),
      );
      expect(chip('Paid').getAttribute('aria-pressed')).toBe('true');
      expect(chip('All').getAttribute('aria-pressed')).toBe('false');

      load.error(new Error('Offline'));
      fixture.detectChanges();

      expect(chip('All').getAttribute('aria-pressed')).toBe('true');
    }));

    it('shows nothing during a quick load', fakeAsync(() => {
      refreshButton().click();
      wait(250);
      finishLoad();
      wait(1000);

      expect(spins()).toBeFalse();
      expect(fades()).toBeFalse();
      expect(refreshButton().textContent.trim()).toBe('Refresh');
    }));

    it('spins the icon and fades the orders during a slow load, then stops the icon on a half turn', fakeAsync(() => {
      refreshButton().click();
      wait(299);

      expect(spins()).toBeFalse();
      expect(fades()).toBeFalse();
      expect(fixture.nativeElement.getAttribute('aria-busy')).toBe('true');

      wait(1);
      expect(spins()).toBeTrue();
      expect(fades()).toBeTrue();
      expect(refreshButton().disabled).toBeFalse();

      wait(600);
      finishLoad();

      expect(fades()).toBeFalse();
      expect(spins()).toBeTrue();
      expect(fixture.nativeElement.getAttribute('aria-busy')).toBe('false');

      wait(399);
      expect(spins()).toBeTrue();

      wait(1);
      expect(spins()).toBeFalse();
    }));

    it('keeps the icon spinning through a load started as the last one ends', fakeAsync(() => {
      refreshButton().click();
      wait(400);
      finishLoad();
      wait(100);

      load = new Subject<void>();
      dispatch.and.returnValue(load);
      chip('Paid').click();
      wait(1000);

      expect(spins()).toBeTrue();
      expect(fades()).toBeTrue();
    }));
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
