import { ShopCartRenderService } from './shop-cart-render.service';
import { TwigTemplateRenderService } from '../render/twig-template-render.service';
import { SiteSectionStateModel } from '../sites/sections/sections-state/site-sections-state.model';

describe('ShopCartRenderService', () => {
  // The cart's editable texts in the editor while the site's texts are empty,
  // the same as the site's own renderer gives in editor mode
  const DEFAULT_TEXTS = {
    emptyCart: {
      attributes:
        ' class="xNgEditable xProperty-cartTextEmpty xCaption-shopping+cart+empty" data-path="blog/settings/siteTexts/cartTextEmpty" data-empty-caption="shopping cart empty"',
      content: 'shopping cart is empty',
    },
    expiredCart: {
      attributes:
        ' class="xNgEditable xProperty-cartTextExpired xCaption-shopping+cart+is+expired" data-path="blog/settings/siteTexts/cartTextExpired" data-empty-caption="shopping cart is expired"',
      content: 'shopping cart is expired',
    },
    tableHeadTitle: {
      attributes:
        ' class="xNgEditable xProperty-cartTextTitle xCaption-title" style="width: 100px;" data-path="blog/settings/siteTexts/cartTextTitle" data-empty-caption="title"',
      content: '',
    },
    tableHeadQuantity: {
      attributes:
        ' class="xNgEditable xProperty-cartTextQuantity xCaption-quantity" data-path="blog/settings/siteTexts/cartTextQuantity" data-empty-caption="quantity"',
      content: '',
    },
    tableHeadPrice: {
      attributes:
        ' class="xNgEditable xProperty-cartTextPrice xCaption-price" data-path="blog/settings/siteTexts/cartTextPrice" data-empty-caption="price"',
      content: '',
    },
    tableHeadSum: {
      attributes:
        ' class="xNgEditable xProperty-cartTextSum xCaption-sum" data-path="blog/settings/siteTexts/cartTextSum" data-empty-caption="sum"',
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
        ' class="cCartShippingTo xNgEditable xProperty-cartTextShippingTo xCaption-shipping+to" data-path="blog/settings/siteTexts/cartTextShippingTo" data-empty-caption="shipping to"',
      content: 'shipping to',
    },
    shippingTotal: {
      attributes:
        ' class="xNgEditable xProperty-shippingTotalText xCaption-Shipping" data-path="blog/settings/siteTexts/shippingTotalText" data-empty-caption="Shipping"',
      content: 'Shipping',
    },
    discount: {
      attributes:
        ' class="xNgEditable xProperty-cartTextDiscount xCaption-discount" data-path="blog/settings/siteTexts/cartTextDiscount" data-empty-caption="discount"',
      content: '',
    },
    total: {
      attributes:
        ' class="xNgEditable xProperty-cartTextTotal xCaption-total" data-path="blog/settings/siteTexts/cartTextTotal" data-empty-caption="total"',
      content: '',
    },
    includedVat: {
      attributes:
        ' class="xNgEditable xProperty-cartTextInclVat xCaption-incl+vat" data-path="blog/settings/siteTexts/cartTextInclVat" data-empty-caption="incl vat"',
      content: '',
    },
    billingAddress: {
      attributes:
        ' class="xNgEditable xProperty-cartTextBillAddr xCaption-billing+address" data-path="blog/settings/siteTexts/cartTextBillAddr" data-empty-caption="billing address"',
      content: 'Billing address',
    },
    legalPerson: {
      attributes:
        ' class="xNgEditable xProperty-cartTextLegalPerson xCaption-legal+person" data-path="blog/settings/siteTexts/cartTextLegalPerson" data-empty-caption="legal person"',
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
    legalAddress: {
      attributes:
        ' class="xNgEditable xProperty-cartTextLegalAddress xCaption-Legal+address" data-path="blog/settings/siteTexts/cartTextLegalAddress" data-empty-caption="Legal address"',
      content: '',
    },
    nameSurname: {
      attributes:
        ' class="xNgEditable xProperty-cartTextNameSurname xCaption-name+surname" data-path="blog/settings/siteTexts/cartTextNameSurname" data-empty-caption="name surname"',
      content: '',
    },
    address: {
      attributes:
        ' class="xNgEditable xProperty-cartTextAddress xCaption-address" data-path="blog/settings/siteTexts/cartTextAddress" data-empty-caption="address"',
      content: '',
    },
    phone: {
      attributes:
        ' class="xNgEditable xProperty-cartTextPhoneNumber xCaption-phone+number" data-path="blog/settings/siteTexts/cartTextPhoneNumber" data-empty-caption="phone number"',
      content: '',
    },
    email: {
      attributes:
        ' class="xNgEditable xProperty-cartTextEmail xCaption-email" data-path="blog/settings/siteTexts/cartTextEmail" data-empty-caption="email"',
      content: '',
    },
    comments: {
      attributes:
        ' class="xNgEditable xProperty-cartTextComments xCaption-comments" data-path="blog/settings/siteTexts/cartTextComments" data-empty-caption="comments"',
      content: '',
    },
    deliverToBillingAddress: {
      attributes:
        ' class="xNgEditable xProperty-cartTextDeliverBilling xCaption-deliver+to+billing_address" data-path="blog/settings/siteTexts/cartTextDeliverBilling" data-empty-caption="deliver to billing_address"',
      content: '',
    },
    shippingAddressHeader: {
      attributes:
        ' class="xNgEditable xProperty-cartTextShipAddr xCaption-shipping+address" data-path="blog/settings/siteTexts/cartTextShipAddr" data-empty-caption="shipping address"',
      content: '',
    },
    receiveNews: {
      attributes:
        ' class="xNgEditable xProperty-cartTextReceiveNews xCaption-receive+news+and+updates" data-path="blog/settings/siteTexts/cartTextReceiveNews" data-empty-caption="receive news and updates"',
      content: '',
    },
    paymentHeader: {
      attributes:
        ' id="cartFromRightTitle" class="xNgEditable xProperty-cartTextCPM xCaption-choose+payment+method" data-path="blog/settings/siteTexts/cartTextCPM" data-empty-caption="choose payment method"',
      content: 'Choose payment method',
    },
    paymentDescription: {
      attributes:
        ' class="xNgEditable xProperty-cartTextPaymentDescription xCaption-payment+description" data-path="blog/settings/siteTexts/cartTextPaymentDescription" data-empty-caption="payment description"',
      content: '',
    },
    manualTransfer: {
      attributes:
        ' class="xNgEditable xProperty-cartManualTransfer xCaption-Manual+transfer" data-path="blog/settings/siteTexts/cartManualTransfer" data-empty-caption="Manual transfer"',
      content: '',
    },
    checkoutDescription: {
      attributes:
        ' class="xNgEditable xProperty-cartTextCheckoutDescription xCaption-checkout+description" data-path="blog/settings/siteTexts/cartTextCheckoutDescription" data-empty-caption="checkout description"',
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
        ' class="xNgEditable xProperty-cartTextCheckoutButton xCaption-checkout+and+pay" data-path="blog/settings/siteTexts/cartTextCheckoutButton" data-empty-caption="checkout and pay"',
      content: '',
    },
    returnToStore: {
      attributes:
        ' class="xNgEditable xProperty-cartTextReturnStore xCaption-return+to+store" data-path="blog/settings/siteTexts/cartTextReturnStore" data-empty-caption="return to store"',
      content: '',
    },
  };

  function renderCartViewData(siteTexts: Record<string, string>) {
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
          promoCodeDiscount: '10',
          paymentMethod: 'both',
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
    expect(viewData.totalLabel).toBe('total');
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
});
