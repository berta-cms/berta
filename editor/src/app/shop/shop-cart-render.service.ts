import { Injectable } from '@angular/core';
import { getImageItem, toHtmlAttributes } from '../shared/helpers';
import { SiteSectionStateModel } from '../sites/sections/sections-state/site-sections-state.model';
import { TwigTemplateRenderService } from '../render/twig-template-render.service';

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
        ? ['mess', 'xEditableDragXY', 'xProperty-shoppingCartXY'].join(' ')
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

  getEmptyCartData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: [
          'xNgEditable',
          'xProperty-cartTextEmpty',
          'xCaption-shopping+cart+empty',
        ].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextEmpty`,
        'data-empty-caption': 'shopping cart empty',
      }),
      content: siteSettings.siteTexts.cartTextEmpty
        ? siteSettings.siteTexts.cartTextEmpty
        : 'shopping cart is empty',
    };
  }

  getExpiredCartData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: [
          'xNgEditable',
          'xProperty-cartTextExpired',
          'xCaption-shopping+cart+is+expired',
        ].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextExpired`,
        'data-empty-caption': 'shopping cart is expired',
      }),
      content: siteSettings.siteTexts.cartTextExpired
        ? siteSettings.siteTexts.cartTextExpired
        : 'shopping cart is expired',
    };
  }

  getTableHeadTitleData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: ['xNgEditable', 'xProperty-cartTextTitle', 'xCaption-title'].join(
          ' ',
        ),
        style: 'width: 100px',
        'data-path': `${siteSlug}/settings/siteTexts/cartTextTitle`,
        'data-empty-caption': 'title',
      }),
      content: siteSettings.siteTexts.cartTextTitle
        ? siteSettings.siteTexts.cartTextTitle
        : '',
    };
  }

  getTableHeadQuantityData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: [
          'xNgEditable',
          'xProperty-cartTextQuantity',
          'xCaption-quantity',
        ].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextQuantity`,
        'data-empty-caption': 'quantity',
      }),
      content: siteSettings.siteTexts.cartTextQuantity
        ? siteSettings.siteTexts.cartTextQuantity
        : '',
    };
  }

  getTableHeadPriceData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: ['xNgEditable', 'xProperty-cartTextPrice', 'xCaption-price'].join(
          ' ',
        ),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextPrice`,
        'data-empty-caption': 'price',
      }),
      content: siteSettings.siteTexts.cartTextPrice
        ? siteSettings.siteTexts.cartTextPrice
        : '',
    };
  }

  getTableHeadSumData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: ['xNgEditable', 'xProperty-cartTextSum', 'xCaption-sum'].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextSum`,
        'data-empty-caption': 'sum',
      }),
      content: siteSettings.siteTexts.cartTextSum
        ? siteSettings.siteTexts.cartTextSum
        : '',
    };
  }

  getPromoCodeData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: [
          'xNgEditable',
          'xProperty-cartTextPromoCode',
          'xCaption-Promo+code',
        ].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextPromoCode`,
        'data-empty-caption': 'Promo code',
      }),
      content: siteSettings.siteTexts.cartTextPromoCode
        ? siteSettings.siteTexts.cartTextPromoCode
        : '',
    };
  }

  getPromoButtonData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: ['xNgEditable', 'xProperty-cartTextPromoBtn', 'xCaption-OK'].join(
          ' ',
        ),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextPromoBtn`,
        'data-empty-caption': 'OK',
      }),
      content: siteSettings.siteTexts.cartTextPromoBtn
        ? siteSettings.siteTexts.cartTextPromoBtn
        : '',
    };
  }

  getShippingToData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: [
          'xNgEditable',
          'xProperty-cartTextShippingTo',
          'xCaption-shipping+to',
        ].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextShippingTo`,
        'data-empty-caption': 'shipping to',
      }),
      content: siteSettings.siteTexts.cartTextShippingTo
        ? siteSettings.siteTexts.cartTextShippingTo
        : 'shipping to',
    };
  }

  getShippingTotalData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: [
          'xNgEditable',
          'xProperty-shippingTotalText',
          'xCaption-Shipping',
        ].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/shippingTotalText`,
        'data-empty-caption': 'Shipping',
      }),
      content: siteSettings.siteTexts.shippingTotalText
        ? siteSettings.siteTexts.shippingTotalText
        : 'Shipping',
    };
  }

  getDiscountData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: [
          'xNgEditable',
          'xProperty-cartTextDiscount',
          'xCaption-discount',
        ].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextDiscount`,
        'data-empty-caption': 'discount',
      }),
      content: siteSettings.siteTexts.cartTextDiscount
        ? siteSettings.siteTexts.cartTextDiscount
        : '',
    };
  }

  getTotalData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: ['xNgEditable', 'xProperty-cartTextTotal', 'xCaption-total'].join(
          ' ',
        ),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextTotal`,
        'data-empty-caption': 'total',
      }),
      content: siteSettings.siteTexts.cartTextTotal
        ? siteSettings.siteTexts.cartTextTotal
        : '',
    };
  }

  getIncludedVatData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: [
          'xNgEditable',
          'xProperty-cartTextInclVat',
          'xCaption-incl+vat',
        ].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextInclVat`,
        'data-empty-caption': 'incl vat',
      }),
      content: siteSettings.siteTexts.cartTextInclVat
        ? siteSettings.siteTexts.cartTextInclVat
        : '',
    };
  }

  getBillingAddressData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: [
          'xNgEditable',
          'xProperty-cartTextBillAddr',
          'xCaption-billing+address',
        ].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextBillAddr`,
        'data-empty-caption': 'billing address',
      }),
      content: siteSettings.siteTexts.cartTextBillAddr
        ? siteSettings.siteTexts.cartTextBillAddr
        : 'Billing address',
    };
  }

  getLegalPersonData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: [
          'xNgEditable',
          'xProperty-cartTextLegalPerson',
          'xCaption-legal+person',
        ].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextLegalPerson`,
        'data-empty-caption': 'legal person',
      }),
      content: siteSettings.siteTexts.cartTextLegalPerson
        ? siteSettings.siteTexts.cartTextLegalPerson
        : '',
    };
  }

  getCompanyData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: [
          'xNgEditable',
          'xProperty-cartTextCompany',
          'xCaption-Company',
        ].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextCompany`,
        'data-empty-caption': 'Company',
      }),
      content: siteSettings.siteTexts.cartTextCompany
        ? siteSettings.siteTexts.cartTextCompany
        : '',
    };
  }

  getCompanyRegistrationNumberData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: [
          'xNgEditable',
          'xProperty-cartTextCompanyRegNo',
          'xCaption-Company+reg.+no.',
        ].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextCompanyRegNo`,
        'data-empty-caption': 'Company reg. no.',
      }),
      content: siteSettings.siteTexts.cartTextCompanyRegNo
        ? siteSettings.siteTexts.cartTextCompanyRegNo
        : '',
    };
  }

  getLegalAddressData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: [
          'xNgEditable',
          'xProperty-cartTextLegalAddress',
          'xCaption-Legal+address',
        ].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextLegalAddress`,
        'data-empty-caption': 'Legal address',
      }),
      content: siteSettings.siteTexts.cartTextLegalAddress
        ? siteSettings.siteTexts.cartTextLegalAddress
        : '',
    };
  }

  getNameSurnameData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: [
          'xNgEditable',
          'xProperty-cartTextNameSurname',
          'xCaption-name+surname',
        ].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextNameSurname`,
        'data-empty-caption': 'name surname',
      }),
      content: siteSettings.siteTexts.cartTextNameSurname
        ? siteSettings.siteTexts.cartTextNameSurname
        : '',
    };
  }

  getAddressData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: [
          'xNgEditable',
          'xProperty-cartTextAddress',
          'xCaption-address',
        ].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextAddress`,
        'data-empty-caption': 'address',
      }),
      content: siteSettings.siteTexts.cartTextAddress
        ? siteSettings.siteTexts.cartTextAddress
        : '',
    };
  }

  getPhoneData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: [
          'xNgEditable',
          'xProperty-cartTextPhoneNumber',
          'xCaption-phone+number',
        ].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextPhoneNumber`,
        'data-empty-caption': 'phone number',
      }),
      content: siteSettings.siteTexts.cartTextPhoneNumber
        ? siteSettings.siteTexts.cartTextPhoneNumber
        : '',
    };
  }

  getEmailData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: ['xNgEditable', 'xProperty-cartTextEmail', 'xCaption-email'].join(
          ' ',
        ),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextEmail`,
        'data-empty-caption': 'email',
      }),
      content: siteSettings.siteTexts.cartTextEmail
        ? siteSettings.siteTexts.cartTextEmail
        : '',
    };
  }

  getCommentsData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: [
          'xNgEditable',
          'xProperty-cartTextComments',
          'xCaption-comments',
        ].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextComments`,
        'data-empty-caption': 'comments',
      }),
      content: siteSettings.siteTexts.cartTextComments
        ? siteSettings.siteTexts.cartTextComments
        : '',
    };
  }

  getDeliverToBillingAddressData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: [
          'xNgEditable',
          'xProperty-cartTextDeliverBilling',
          'xCaption-deliver+to+billing_address',
        ].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextDeliverBilling`,
        'data-empty-caption': 'deliver to billing_address',
      }),
      content: siteSettings.siteTexts.cartTextDeliverBilling
        ? siteSettings.siteTexts.cartTextDeliverBilling
        : '',
    };
  }

  getShippingAddressHeaderData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: [
          'xNgEditable',
          'xProperty-cartTextShipAddr',
          'xCaption-shipping+address',
        ].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextShipAddr`,
        'data-empty-caption': 'shipping address',
      }),
      content: siteSettings.siteTexts.cartTextShipAddr
        ? siteSettings.siteTexts.cartTextShipAddr
        : '',
    };
  }

  getReceiveNewsData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: [
          'xNgEditable',
          'xProperty-cartTextReceiveNews',
          'xCaption-receive+news+and+updates',
        ].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextReceiveNews`,
        'data-empty-caption': 'receive news and updates',
      }),
      content: siteSettings.siteTexts.cartTextReceiveNews
        ? siteSettings.siteTexts.cartTextReceiveNews
        : '',
    };
  }

  getPaymentHeaderData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: [
          'xNgEditable',
          'xProperty-cartTextCPM',
          'xCaption-choose+payment+method',
        ].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextCPM`,
        'data-empty-caption': 'choose payment method',
      }),
      content: siteSettings.siteTexts.cartTextCPM
        ? siteSettings.siteTexts.cartTextCPM
        : 'Choose payment method',
    };
  }

  getPaymentDescriptionData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: [
          'xNgEditable',
          'xProperty-cartTextPaymentDescription',
          'xCaption-payment+description',
        ].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextPaymentDescription`,
        'data-empty-caption': 'payment description',
      }),
      content: siteSettings.siteTexts.cartTextPaymentDescription
        ? siteSettings.siteTexts.cartTextPaymentDescription
        : '',
    };
  }

  getManualTransferData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: [
          'xNgEditable',
          'xProperty-cartManualTransfer',
          'xCaption-Manual+transfer',
        ].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/cartManualTransfer`,
        'data-empty-caption': 'Manual transfer',
      }),
      content: siteSettings.siteTexts.cartManualTransfer
        ? siteSettings.siteTexts.cartManualTransfer
        : '',
    };
  }

  getCheckoutDescriptionData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: [
          'xNgEditable',
          'xProperty-cartTextCheckoutDescription',
          'xCaption-checkout+description',
        ].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextCheckoutDescription`,
        'data-empty-caption': 'checkout description',
      }),
      content: siteSettings.siteTexts.cartTextCheckoutDescription
        ? siteSettings.siteTexts.cartTextCheckoutDescription
        : '',
    };
  }

  getTermsData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: [
          'xNgEditable',
          'xProperty-cartTextTerms',
          'xCaption-By+purchasing+our+products+you+agree+to+the+Terms+of+Service',
        ].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextTerms`,
        'data-empty-caption': 'By purchasing our products you agree to the Terms of Service',
      }),
      content: siteSettings.siteTexts.cartTextTerms
        ? siteSettings.siteTexts.cartTextTerms
        : '',
    };
  }

  getFillRequiredFieldsData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: [
          'xNgEditable',
          'xProperty-cartTextFillRequiredFields',
          'xCaption-Please+fill+in+all+required+fields',
        ].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextFillRequiredFields`,
        'data-empty-caption': 'Please fill in all required fields',
      }),
      content: siteSettings.siteTexts.cartTextFillRequiredFields
        ? siteSettings.siteTexts.cartTextFillRequiredFields
        : '',
    };
  }

  getCheckoutButtonData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: [
          'xNgEditable',
          'xProperty-cartTextCheckoutButton',
          'xCaption-checkout+and+pay',
        ].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextCheckoutButton`,
        'data-empty-caption': 'checkout and pay',
      }),
      content: siteSettings.siteTexts.cartTextCheckoutButton
        ? siteSettings.siteTexts.cartTextCheckoutButton
        : '',
    };
  }

  getReturnToStoreData(siteSlug, siteSettings) {
    return {
      attributes: toHtmlAttributes({
        class: [
          'xNgEditable',
          'xProperty-cartTextReturnStore',
          'xCaption-return+to+store',
        ].join(' '),
        'data-path': `${siteSlug}/settings/siteTexts/cartTextReturnStore`,
        'data-empty-caption': 'return to store',
      }),
      content: siteSettings.siteTexts.cartTextReturnStore
        ? siteSettings.siteTexts.cartTextReturnStore
        : '',
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

    const viewData = {
      config: shopSettings.group_config,
      currency: shopSettings.group_config.currency,
      isEditMode: true,
      emptyCart: this.getEmptyCartData(siteSlug, siteSettings),
      cartTitle: section.title,
      expiredCart: this.getExpiredCartData(siteSlug, siteSettings),
      tableHeadTitle: this.getTableHeadTitleData(siteSlug, siteSettings),
      tableHeadQuantity: this.getTableHeadQuantityData(siteSlug, siteSettings),
      tableHeadPrice: this.getTableHeadPriceData(siteSlug, siteSettings),
      tableHeadSum: this.getTableHeadSumData(siteSlug, siteSettings),
      discountAvailable: shopSettings.group_config.promoCodeDiscount.length > 0,
      promoCode: this.getPromoCodeData(siteSlug, siteSettings),
      promoButton: this.getPromoButtonData(siteSlug, siteSettings),
      shippingTo: this.getShippingToData(siteSlug, siteSettings),
      shippingRegions: shippingRegions,
      shippingTotal: this.getShippingTotalData(siteSlug, siteSettings),
      discount: this.getDiscountData(siteSlug, siteSettings),
      total: this.getTotalData(siteSlug, siteSettings),
      includedVat: this.getIncludedVatData(siteSlug, siteSettings),
      billingAddress: this.getBillingAddressData(siteSlug, siteSettings),
      legalPerson: this.getLegalPersonData(siteSlug, siteSettings),
      company: this.getCompanyData(siteSlug, siteSettings),
      companyRegistrationNumber: this.getCompanyRegistrationNumberData(
        siteSlug,
        siteSettings,
      ),
      legalAddress: this.getLegalAddressData(siteSlug, siteSettings),
      nameSurname: this.getNameSurnameData(siteSlug, siteSettings),
      address: this.getAddressData(siteSlug, siteSettings),
      phone: this.getPhoneData(siteSlug, siteSettings),
      email: this.getEmailData(siteSlug, siteSettings),
      comments: this.getCommentsData(siteSlug, siteSettings),
      deliverToBillingAddress: this.getDeliverToBillingAddressData(
        siteSlug,
        siteSettings,
      ),
      shippingAddressHeader: this.getShippingAddressHeaderData(
        siteSlug,
        siteSettings,
      ),
      receiveNews: this.getReceiveNewsData(siteSlug, siteSettings),
      paymentHeader: this.getPaymentHeaderData(siteSlug, siteSettings),
      paymentDescription: this.getPaymentDescriptionData(
        siteSlug,
        siteSettings,
      ),
      isPaypalAvailable: ['paypal', 'both'].includes(
        shopSettings.group_config.paymentMethod,
      ),
      isManualTransferAvailable: ['bank', 'both'].includes(
        shopSettings.group_config.paymentMethod,
      ),
      manualTransfer: this.getManualTransferData(siteSlug, siteSettings),
      checkoutDescription: this.getCheckoutDescriptionData(
        siteSlug,
        siteSettings,
      ),
      totalLabel: siteSettings.siteTexts.cartTextTotal
        ? siteSettings.siteTexts.cartTextTotal
        : 'total',
      terms: this.getTermsData(siteSlug, siteSettings),
      fillRequiredFields: this.getFillRequiredFieldsData(
        siteSlug,
        siteSettings,
      ),
      checkoutButton: this.getCheckoutButtonData(siteSlug, siteSettings),
      returnToStore: this.getReturnToStoreData(siteSlug, siteSettings),
      returnUrl: location.origin,
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
