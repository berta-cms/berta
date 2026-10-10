import { Injectable } from '@angular/core';
import { getImageItem, toHtmlAttributes } from '../shared/helpers';
import { SiteSectionStateModel } from '../sites/sections/sections-state/site-sections-state.model';
import { TwigTemplateRenderService } from '../render/twig-template-render.service';

interface EditableText {
  setting: string;
  default: string;
  caption: string;
  siteOnly?: boolean;
  id?: string;
  class?: string;
  editorStyle?: string;
}

/**
 * The cart's texts the site owner edits in place, by view variable. A text shows the site
 * text `setting`, or `default` while that's empty; a `siteOnly` default isn't shown in the
 * editor, where an empty text shows its `caption` instead.
 */
const EDITABLE_TEXTS: Record<string, EditableText> = {
  emptyCart: {
    setting: 'cartTextEmpty',
    default: 'shopping cart is empty',
    caption: 'shopping cart empty',
  },
  expiredCart: {
    setting: 'cartTextExpired',
    default: 'shopping cart is expired',
    caption: 'shopping cart is expired',
  },
  tableHeadTitle: {
    setting: 'cartTextTitle',
    default: 'title',
    caption: 'title',
    siteOnly: true,
    editorStyle: 'width: 100px;',
  },
  tableHeadQuantity: {
    setting: 'cartTextQuantity',
    default: 'quantity',
    caption: 'quantity',
    siteOnly: true,
  },
  tableHeadPrice: {
    setting: 'cartTextPrice',
    default: 'price',
    caption: 'price',
    siteOnly: true,
  },
  tableHeadSum: {
    setting: 'cartTextSum',
    default: 'sum',
    caption: 'sum',
    siteOnly: true,
  },
  promoCode: {
    setting: 'cartTextPromoCode',
    default: 'promo code',
    caption: 'Promo code',
    siteOnly: true,
  },
  promoButton: {
    setting: 'cartTextPromoBtn',
    default: 'ok',
    caption: 'OK',
    siteOnly: true,
  },
  shippingTo: {
    setting: 'cartTextShippingTo',
    default: 'shipping to',
    caption: 'shipping to',
    class: 'cCartShippingTo',
  },
  shippingTotal: {
    setting: 'shippingTotalText',
    default: 'Shipping',
    caption: 'Shipping',
  },
  discount: {
    setting: 'cartTextDiscount',
    default: 'discount',
    caption: 'discount',
    siteOnly: true,
  },
  total: {
    setting: 'cartTextTotal',
    default: 'total',
    caption: 'total',
    siteOnly: true,
  },
  includedVat: {
    setting: 'cartTextInclVat',
    default: 'incl. VAT',
    caption: 'incl vat',
    siteOnly: true,
  },
  billingAddress: {
    setting: 'cartTextBillAddr',
    default: 'Billing address',
    caption: 'billing address',
  },
  legalPerson: {
    setting: 'cartTextLegalPerson',
    default: 'Legal person',
    caption: 'legal person',
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
  legalAddress: {
    setting: 'cartTextLegalAddress',
    default: 'Legal address',
    caption: 'Legal address',
    siteOnly: true,
  },
  nameSurname: {
    setting: 'cartTextNameSurname',
    default: 'Name, surname',
    caption: 'name surname',
    siteOnly: true,
  },
  address: {
    setting: 'cartTextAddress',
    default: 'Address',
    caption: 'address',
    siteOnly: true,
  },
  phone: {
    setting: 'cartTextPhoneNumber',
    default: 'Phone',
    caption: 'phone number',
    siteOnly: true,
  },
  email: {
    setting: 'cartTextEmail',
    default: 'Email',
    caption: 'email',
    siteOnly: true,
  },
  comments: {
    setting: 'cartTextComments',
    default: 'Comments',
    caption: 'comments',
    siteOnly: true,
  },
  deliverToBillingAddress: {
    setting: 'cartTextDeliverBilling',
    default: 'Deliver to billing address',
    caption: 'deliver to billing_address',
    siteOnly: true,
  },
  shippingAddressHeader: {
    setting: 'cartTextShipAddr',
    default: 'Shippping address',
    caption: 'shipping address',
    siteOnly: true,
  },
  receiveNews: {
    setting: 'cartTextReceiveNews',
    default: '',
    caption: 'receive news and updates',
  },
  paymentHeader: {
    setting: 'cartTextCPM',
    default: 'Choose payment method',
    caption: 'choose payment method',
    id: 'cartFromRightTitle',
  },
  paymentDescription: {
    setting: 'cartTextPaymentDescription',
    default: '',
    caption: 'payment description',
  },
  manualTransfer: {
    setting: 'cartManualTransfer',
    default: 'Manual transfer',
    caption: 'Manual transfer',
    siteOnly: true,
  },
  checkoutDescription: {
    setting: 'cartTextCheckoutDescription',
    default: '',
    caption: 'checkout description',
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
    default: 'checkout and pay',
    caption: 'checkout and pay',
    siteOnly: true,
  },
  returnToStore: {
    setting: 'cartTextReturnStore',
    default: 'return to store',
    caption: 'return to store',
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
        id: text.id,
        class: [
          ...(text.class ? [text.class] : []),
          'xNgEditable',
          `xProperty-${text.setting}`,
          `xCaption-${text.caption.replace(/ /g, '+')}`,
        ].join(' '),
        style: text.editorStyle,
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
      discountAvailable: shopSettings.group_config.promoCodeDiscount.length > 0,
      shippingRegions: shippingRegions,
      isPaypalAvailable: ['paypal', 'both'].includes(
        shopSettings.group_config.paymentMethod,
      ),
      isManualTransferAvailable: ['bank', 'both'].includes(
        shopSettings.group_config.paymentMethod,
      ),
      totalLabel: siteSettings.siteTexts.cartTextTotal
        ? siteSettings.siteTexts.cartTextTotal
        : 'total',
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
