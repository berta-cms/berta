import { ShopCartRenderService } from './shop-cart-render.service';
import { TwigTemplateRenderService } from '../render/twig-template-render.service';
import { SiteSectionStateModel } from '../sites/sections/sections-state/site-sections-state.model';

describe('ShopCartRenderService', () => {
  // The cart's editable texts in the editor while the site's texts are empty,
  // the same as the site's own renderer gives in editor mode
  const DEFAULT_TEXTS = {
    emptyCart: {
      attributes:
        ' class="xNgEditable xProperty-cartTextEmpty xCaption-Shopping+cart+empty" data-path="blog/settings/siteTexts/cartTextEmpty" data-empty-caption="Shopping cart empty"',
      content: 'Shopping cart is empty',
    },
    expiredCart: {
      attributes:
        ' class="xNgEditable xProperty-cartTextExpired xCaption-Shopping+cart+is+expired" data-path="blog/settings/siteTexts/cartTextExpired" data-empty-caption="Shopping cart is expired"',
      content: 'Shopping cart is expired',
    },
    tableHeadTitle: {
      attributes:
        ' class="xNgEditable xProperty-cartTextTitle xCaption-Title" data-path="blog/settings/siteTexts/cartTextTitle" data-empty-caption="Title"',
      content: '',
    },
    tableHeadQuantity: {
      attributes:
        ' class="xNgEditable xProperty-cartTextQuantity xCaption-Quantity" data-path="blog/settings/siteTexts/cartTextQuantity" data-empty-caption="Quantity"',
      content: '',
    },
    tableHeadPrice: {
      attributes:
        ' class="xNgEditable xProperty-cartTextPrice xCaption-Price" data-path="blog/settings/siteTexts/cartTextPrice" data-empty-caption="Price"',
      content: '',
    },
    tableHeadSum: {
      attributes:
        ' class="xNgEditable xProperty-cartTextSum xCaption-Sum" data-path="blog/settings/siteTexts/cartTextSum" data-empty-caption="Sum"',
      content: '',
    },
    promoCode: {
      attributes:
        ' class="xNgEditable xProperty-cartTextPromoCode xCaption-Promo+code" data-path="blog/settings/siteTexts/cartTextPromoCode" data-empty-caption="Promo code"',
      content: '',
    },
    promoButton: {
      attributes:
        ' class="xNgEditable xProperty-cartTextPromoBtn xCaption-OK" data-path="blog/settings/siteTexts/cartTextPromoBtn" data-empty-caption="OK"',
      content: '',
    },
    shippingTo: {
      attributes:
        ' class="xNgEditable xProperty-cartTextShippingTo xCaption-Shipping+to" data-path="blog/settings/siteTexts/cartTextShippingTo" data-empty-caption="Shipping to"',
      content: 'Shipping to',
    },
    shippingTotal: {
      attributes:
        ' class="xNgEditable xProperty-shippingTotalText xCaption-Shipping" data-path="blog/settings/siteTexts/shippingTotalText" data-empty-caption="Shipping"',
      content: 'Shipping',
    },
    discount: {
      attributes:
        ' class="xNgEditable xProperty-cartTextDiscount xCaption-Discount" data-path="blog/settings/siteTexts/cartTextDiscount" data-empty-caption="Discount"',
      content: '',
    },
    total: {
      attributes:
        ' class="xNgEditable xProperty-cartTextTotal xCaption-Total" data-path="blog/settings/siteTexts/cartTextTotal" data-empty-caption="Total"',
      content: '',
    },
    includedVat: {
      attributes:
        ' class="xNgEditable xProperty-cartTextInclVat xCaption-Incl+vat" data-path="blog/settings/siteTexts/cartTextInclVat" data-empty-caption="Incl vat"',
      content: '',
    },
    billingAddress: {
      attributes:
        ' class="xNgEditable xProperty-cartTextBillAddr xCaption-Billing+address" data-path="blog/settings/siteTexts/cartTextBillAddr" data-empty-caption="Billing address"',
      content: 'Billing address',
    },
    legalPerson: {
      attributes:
        ' class="xNgEditable xProperty-cartTextLegalPerson xCaption-Legal+person" data-path="blog/settings/siteTexts/cartTextLegalPerson" data-empty-caption="Legal person"',
      content: '',
    },
    company: {
      attributes:
        ' class="xNgEditable xProperty-cartTextCompany xCaption-Company" data-path="blog/settings/siteTexts/cartTextCompany" data-empty-caption="Company"',
      content: '',
    },
    companyRegistrationNumber: {
      attributes:
        ' class="xNgEditable xProperty-cartTextCompanyRegNo xCaption-Company+reg.+no." data-path="blog/settings/siteTexts/cartTextCompanyRegNo" data-empty-caption="Company reg. no."',
      content: '',
    },
    vatNumber: {
      attributes:
        ' class="xNgEditable xProperty-cartTextVatNo xCaption-VAT+no." data-path="blog/settings/siteTexts/cartTextVatNo" data-empty-caption="VAT no."',
      content: '',
    },
    legalAddress: {
      attributes:
        ' class="xNgEditable xProperty-cartTextLegalAddress xCaption-Legal+address" data-path="blog/settings/siteTexts/cartTextLegalAddress" data-empty-caption="Legal address"',
      content: '',
    },
    nameSurname: {
      attributes:
        ' class="xNgEditable xProperty-cartTextNameSurname xCaption-Name+surname" data-path="blog/settings/siteTexts/cartTextNameSurname" data-empty-caption="Name surname"',
      content: '',
    },
    address: {
      attributes:
        ' class="xNgEditable xProperty-cartTextAddress xCaption-Address" data-path="blog/settings/siteTexts/cartTextAddress" data-empty-caption="Address"',
      content: '',
    },
    phone: {
      attributes:
        ' class="xNgEditable xProperty-cartTextPhoneNumber xCaption-Phone+number" data-path="blog/settings/siteTexts/cartTextPhoneNumber" data-empty-caption="Phone number"',
      content: '',
    },
    email: {
      attributes:
        ' class="xNgEditable xProperty-cartTextEmail xCaption-Email" data-path="blog/settings/siteTexts/cartTextEmail" data-empty-caption="Email"',
      content: '',
    },
    comments: {
      attributes:
        ' class="xNgEditable xProperty-cartTextComments xCaption-Comments" data-path="blog/settings/siteTexts/cartTextComments" data-empty-caption="Comments"',
      content: '',
    },
    deliverToBillingAddress: {
      attributes:
        ' class="xNgEditable xProperty-cartTextDeliverBilling xCaption-Deliver+to+billing_address" data-path="blog/settings/siteTexts/cartTextDeliverBilling" data-empty-caption="Deliver to billing_address"',
      content: '',
    },
    shippingAddressHeader: {
      attributes:
        ' class="xNgEditable xProperty-cartTextShipAddr xCaption-Shipping+address" data-path="blog/settings/siteTexts/cartTextShipAddr" data-empty-caption="Shipping address"',
      content: '',
    },
    receiveNews: {
      attributes:
        ' class="xNgEditable xProperty-cartTextReceiveNews xCaption-Receive+news+and+updates" data-path="blog/settings/siteTexts/cartTextReceiveNews" data-empty-caption="Receive news and updates"',
      content: '',
    },
    paymentHeader: {
      attributes:
        ' class="xNgEditable xProperty-cartTextCPM xCaption-Choose+payment+method" data-path="blog/settings/siteTexts/cartTextCPM" data-empty-caption="Choose payment method"',
      content: 'Choose payment method',
    },
    paymentDescription: {
      attributes:
        ' class="xNgEditable xProperty-cartTextPaymentDescription xCaption-Payment+description" data-path="blog/settings/siteTexts/cartTextPaymentDescription" data-empty-caption="Payment description"',
      content: '',
    },
    cardPayment: {
      attributes:
        ' class="xNgEditable xProperty-cartTextCardPayment xCaption-Debit+or+credit+card" data-path="blog/settings/siteTexts/cartTextCardPayment" data-empty-caption="Debit or credit card"',
      content: '',
    },
    paypalPayment: {
      attributes:
        ' class="xNgEditable xProperty-cartTextPaypalPayment xCaption-PayPal" data-path="blog/settings/siteTexts/cartTextPaypalPayment" data-empty-caption="PayPal"',
      content: '',
    },
    manualTransfer: {
      attributes:
        ' class="xNgEditable xProperty-cartManualTransfer xCaption-Bank+transfer" data-path="blog/settings/siteTexts/cartManualTransfer" data-empty-caption="Bank transfer"',
      content: '',
    },
    checkoutDescription: {
      attributes:
        ' class="xNgEditable xProperty-cartTextCheckoutDescription xCaption-Checkout+description" data-path="blog/settings/siteTexts/cartTextCheckoutDescription" data-empty-caption="Checkout description"',
      content: '',
    },
    terms: {
      attributes:
        ' class="xNgEditable xProperty-cartTextTerms xCaption-By+purchasing+our+products+you+agree+to+the+Terms+of+Service" data-path="blog/settings/siteTexts/cartTextTerms" data-empty-caption="By purchasing our products you agree to the Terms of Service"',
      content: '',
    },
    fillRequiredFields: {
      attributes:
        ' class="xNgEditable xProperty-cartTextFillRequiredFields xCaption-Please+fill+in+all+required+fields" data-path="blog/settings/siteTexts/cartTextFillRequiredFields" data-empty-caption="Please fill in all required fields"',
      content: '',
    },
    checkoutButton: {
      attributes:
        ' class="xNgEditable xProperty-cartTextCheckoutButton xCaption-Checkout+and+pay" data-path="blog/settings/siteTexts/cartTextCheckoutButton" data-empty-caption="Checkout and pay"',
      content: '',
    },
    returnToStore: {
      attributes:
        ' class="xNgEditable xProperty-cartTextReturnStore xCaption-Return+to+store" data-path="blog/settings/siteTexts/cartTextReturnStore" data-empty-caption="Return to store"',
      content: '',
    },
  };

  function renderCartViewData(
    siteTexts: Record<string, string>,
    config: Record<string, string> = {},
  ) {
    const render = jasmine.createSpy('render').and.returnValue('');
    const service = new ShopCartRenderService({
      render,
    } as unknown as TwigTemplateRenderService);

    service.renderCart(
      'blog',
      { siteTexts },
      'messy',
      { name: 'cart', title: 'Cart' } as SiteSectionStateModel,
      {
        group_config: {
          currency: 'EUR',
          promoCode: 'SAVE10',
          promoCodeDiscount: '10',
          paymentMethod: 'both',
          ...config,
        },
      },
      [],
    );

    expect(render).toHaveBeenCalledWith(
      'Shop/shoppingCart',
      jasmine.anything(),
    );
    return render.calls.mostRecent().args[1];
  }

  function settingOf(attributes: string): string {
    return attributes.match(/siteTexts\/(\w+)"/)[1];
  }

  it('renders every editable text with its default', () => {
    const viewData = renderCartViewData({});

    for (const [name, text] of Object.entries(DEFAULT_TEXTS)) {
      expect(viewData[name]).withContext(name).toEqual(text);
    }
    expect(viewData.totalLabel).toBe('Total');
  });

  it("renders the site's own texts", () => {
    const siteTexts = Object.fromEntries(
      Object.values(DEFAULT_TEXTS).map(({ attributes }) => [
        settingOf(attributes),
        `Custom ${settingOf(attributes)}`,
      ]),
    );
    siteTexts.cartTextTotal = 'Custom cartTextTotal';

    const viewData = renderCartViewData(siteTexts);

    for (const [name, { attributes }] of Object.entries(DEFAULT_TEXTS)) {
      expect(viewData[name])
        .withContext(name)
        .toEqual({ attributes, content: `Custom ${settingOf(attributes)}` });
    }
    expect(viewData.totalLabel).toBe('Custom cartTextTotal');
  });

  it('shows the promo code entry only for a promo code with a discount', () => {
    expect(renderCartViewData({}).discountAvailable).toBeTrue();
    expect(
      renderCartViewData({}, { promoCode: '' }).discountAvailable,
    ).toBeFalse();
    expect(
      renderCartViewData({}, { promoCodeDiscount: '' }).discountAvailable,
    ).toBeFalse();
  });
});
