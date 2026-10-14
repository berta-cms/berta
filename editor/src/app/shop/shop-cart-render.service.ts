import { Injectable } from '@angular/core';
import { getImageItem, toHtmlAttributes } from '../shared/helpers';
import { SiteSectionStateModel } from '../sites/sections/sections-state/site-sections-state.model';
import { TwigTemplateRenderService } from '../render/twig-template-render.service';

interface EditableText {
  setting: string;
  default: string;
  caption: string;
  siteOnly?: boolean;
}

/**
 * The cart's texts the site owner edits in place, by view variable. A text shows the site
 * text `setting`, or `default` while that's empty; a `siteOnly` default isn't shown in the
 * editor, where an empty text shows its `caption` instead.
 */
const EDITABLE_TEXTS: Record<string, EditableText> = {
  emptyCart: {
    setting: 'cartTextEmpty',
    default: 'Shopping cart is empty',
    caption: 'Shopping cart empty',
  },
  expiredCart: {
    setting: 'cartTextExpired',
    default: 'Shopping cart is expired',
    caption: 'Shopping cart is expired',
  },
  tableHeadTitle: {
    setting: 'cartTextTitle',
    default: 'Title',
    caption: 'Title',
    siteOnly: true,
  },
  tableHeadQuantity: {
    setting: 'cartTextQuantity',
    default: 'Quantity',
    caption: 'Quantity',
    siteOnly: true,
  },
  tableHeadPrice: {
    setting: 'cartTextPrice',
    default: 'Price',
    caption: 'Price',
    siteOnly: true,
  },
  tableHeadSum: {
    setting: 'cartTextSum',
    default: 'Sum',
    caption: 'Sum',
    siteOnly: true,
  },
  promoCode: {
    setting: 'cartTextPromoCode',
    default: 'Promo code',
    caption: 'Promo code',
    siteOnly: true,
  },
  promoButton: {
    setting: 'cartTextPromoBtn',
    default: 'OK',
    caption: 'OK',
    siteOnly: true,
  },
  shippingTo: {
    setting: 'cartTextShippingTo',
    default: 'Shipping to',
    caption: 'Shipping to',
  },
  shippingTotal: {
    setting: 'shippingTotalText',
    default: 'Shipping',
    caption: 'Shipping',
  },
  discount: {
    setting: 'cartTextDiscount',
    default: 'Discount',
    caption: 'Discount',
    siteOnly: true,
  },
  total: {
    setting: 'cartTextTotal',
    default: 'Total',
    caption: 'Total',
    siteOnly: true,
  },
  includedVat: {
    setting: 'cartTextInclVat',
    default: 'Incl. VAT',
    caption: 'Incl vat',
    siteOnly: true,
  },
  billingAddress: {
    setting: 'cartTextBillAddr',
    default: 'Billing address',
    caption: 'Billing address',
  },
  legalPerson: {
    setting: 'cartTextLegalPerson',
    default: 'Legal person',
    caption: 'Legal person',
    siteOnly: true,
  },
  company: {
    setting: 'cartTextCompany',
    default: 'Company',
    caption: 'Company',
    siteOnly: true,
  },
  companyRegistrationNumber: {
    setting: 'cartTextCompanyRegNo',
    default: 'Company reg. no.',
    caption: 'Company reg. no.',
    siteOnly: true,
  },
  vatNumber: {
    setting: 'cartTextVatNo',
    default: 'VAT no.',
    caption: 'VAT no.',
    siteOnly: true,
  },
  legalAddress: {
    setting: 'cartTextLegalAddress',
    default: 'Legal address',
    caption: 'Legal address',
    siteOnly: true,
  },
  nameSurname: {
    setting: 'cartTextNameSurname',
    default: 'Name, surname',
    caption: 'Name surname',
    siteOnly: true,
  },
  address: {
    setting: 'cartTextAddress',
    default: 'Address',
    caption: 'Address',
    siteOnly: true,
  },
  phone: {
    setting: 'cartTextPhoneNumber',
    default: 'Phone',
    caption: 'Phone number',
    siteOnly: true,
  },
  email: {
    setting: 'cartTextEmail',
    default: 'Email',
    caption: 'Email',
    siteOnly: true,
  },
  comments: {
    setting: 'cartTextComments',
    default: 'Comments',
    caption: 'Comments',
    siteOnly: true,
  },
  deliverToBillingAddress: {
    setting: 'cartTextDeliverBilling',
    default: 'Deliver to billing address',
    caption: 'Deliver to billing_address',
    siteOnly: true,
  },
  shippingAddressHeader: {
    setting: 'cartTextShipAddr',
    default: 'Shipping address',
    caption: 'Shipping address',
    siteOnly: true,
  },
  receiveNews: {
    setting: 'cartTextReceiveNews',
    default: '',
    caption: 'Receive news and updates',
  },
  paymentHeader: {
    setting: 'cartTextCPM',
    default: 'Choose payment method',
    caption: 'Choose payment method',
  },
  paymentDescription: {
    setting: 'cartTextPaymentDescription',
    default: '',
    caption: 'Payment description',
  },
  cardPayment: {
    setting: 'cartTextCardPayment',
    default: 'Debit or credit card',
    caption: 'Debit or credit card',
    siteOnly: true,
  },
  paypalPayment: {
    setting: 'cartTextPaypalPayment',
    default: 'PayPal',
    caption: 'PayPal',
    siteOnly: true,
  },
  manualTransfer: {
    setting: 'cartManualTransfer',
    default: 'Bank transfer',
    caption: 'Bank transfer',
    siteOnly: true,
  },
  checkoutDescription: {
    setting: 'cartTextCheckoutDescription',
    default: '',
    caption: 'Checkout description',
  },
  terms: {
    setting: 'cartTextTerms',
    default: 'By purchasing our products you agree to the Terms of Service',
    caption: 'By purchasing our products you agree to the Terms of Service',
    siteOnly: true,
  },
  fillRequiredFields: {
    setting: 'cartTextFillRequiredFields',
    default: 'Please fill in all required fields',
    caption: 'Please fill in all required fields',
    siteOnly: true,
  },
  checkoutButton: {
    setting: 'cartTextCheckoutButton',
    default: 'Checkout and pay',
    caption: 'Checkout and pay',
    siteOnly: true,
  },
  returnToStore: {
    setting: 'cartTextReturnStore',
    default: 'Return to store',
    caption: 'Return to store',
    siteOnly: true,
  },
};

@Injectable({
  providedIn: 'root',
})
export class ShopCartRenderService {
  USED_IN_TEMPLATES = ['messy'];

  constructor(private twigTemplateRenderService: TwigTemplateRenderService) {}

  getCartLinkAttributes(siteSlug: string, siteSettings, isResponsive: boolean) {
    let styles: string[] = [];

    if (!isResponsive) {
      const [left, top] =
        siteSettings.siteTexts && siteSettings.siteTexts.shoppingCartXY
          ? siteSettings.siteTexts.shoppingCartXY.split(',')
          : [
              Math.floor(Math.random() * 960 + 1),
              Math.floor(Math.random() * 600 + 1),
            ];

      styles.push(`left:${left}px`);
      styles.push(`top:${top}px`);
    }

    return toHtmlAttributes({
      class: !isResponsive
        ? ['mess', 'xNgEditableDragXY', 'xProperty-shoppingCartXY'].join(' ')
        : null,
      style: styles.join(';'),
      'data-path': !isResponsive
        ? `${siteSlug}/settings/siteTexts/shoppingCartXY`
        : null,
    });
  }

  getCartLink(siteSlug: string, section: SiteSectionStateModel) {
    let urlParts: string[] = [];

    if (siteSlug) {
      urlParts.push(`site=${siteSlug}`);
    }

    urlParts.push(`section=${section.name}`);

    return `/engine/editor/?${urlParts.join('&')}`;
  }

  renderCartLink(
    siteSlug: string,
    siteSettings,
    shopSettings,
    sections: SiteSectionStateModel[],
    isResponsive: boolean,
  ) {
    const section = sections.find(
      (section) =>
        section['@attributes'] &&
        section['@attributes'].published === '1' &&
        section['@attributes'].type === 'shopping_cart',
    );

    if (!section || !shopSettings.group_price_item) {
      return '';
    }

    const viewData = {
      attributes: this.getCartLinkAttributes(
        siteSlug,
        siteSettings,
        isResponsive,
      ),
      link: this.getCartLink(siteSlug, section),
      title: section.title,
      image: shopSettings.group_price_item.cartImage
        ? getImageItem(siteSlug, shopSettings.group_price_item.cartImage, {
            alt: section.title,
          })
        : null,
    };

    try {
      return this.twigTemplateRenderService.render(
        'Shop/shoppingCartLink',
        viewData,
      );
    } catch (error) {
      console.error('Failed to render template:', error);
      return '';
    }
  }

  getEditableTextData(siteSlug: string, siteSettings, text: EditableText) {
    return {
      attributes: toHtmlAttributes({
        class: `xNgEditable xProperty-${text.setting} xCaption-${text.caption.replace(/ /g, '+')}`,
        'data-path': `${siteSlug}/settings/siteTexts/${text.setting}`,
        'data-empty-caption': text.caption,
      }),
      content:
        siteSettings.siteTexts[text.setting] ||
        (text.siteOnly ? '' : text.default),
    };
  }

  renderCart(
    siteSlug: string,
    siteSettings,
    templateName: string,
    section: SiteSectionStateModel,
    shopSettings,
    shippingRegions,
  ) {
    if (!this.USED_IN_TEMPLATES.includes(templateName)) {
      return '';
    }

    const editableTexts = Object.fromEntries(
      Object.entries(EDITABLE_TEXTS).map(([name, text]) => [
        name,
        this.getEditableTextData(siteSlug, siteSettings, text),
      ]),
    );
    const viewData = {
      ...editableTexts,
      config: shopSettings.group_config,
      currency: shopSettings.group_config.currency,
      isEditMode: true,
      cartTitle: section.title,
      // Only a code with a discount gives the customer something to enter
      discountAvailable:
        String(shopSettings.group_config.promoCode ?? '').trim() !== '' &&
        parseInt(shopSettings.group_config.promoCodeDiscount) > 0,
      shippingRegions: shippingRegions,
      isPaypalAvailable: ['paypal', 'both'].includes(
        shopSettings.group_config.paymentMethod,
      ),
      isManualTransferAvailable: ['bank', 'both'].includes(
        shopSettings.group_config.paymentMethod,
      ),
      totalLabel: siteSettings.siteTexts.cartTextTotal
        ? siteSettings.siteTexts.cartTextTotal
        : 'Total',
    };

    try {
      return this.twigTemplateRenderService.render(
        'Shop/shoppingCart',
        viewData,
      );
    } catch (error) {
      console.error('Failed to render template:', error);
      return '';
    }
  }
}
