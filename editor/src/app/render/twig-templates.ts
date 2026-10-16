// Auto-generated file - do not edit manually

export const TWIG_TEMPLATES: Record<string, string> = {
  'Shop/shoppingCart': `{#
  The shop's cart, which shop.js loads from the cart section (?shopping_cart=1) into its dialog. The site has no page
  of its own for the cart section, the editor shows it to edit the cart's texts.

  \`cart-*\` classes style the cart, \`js-cart-*\` classes are shop.js's hooks and carry no styles. In the editor the
  same markup shows every part of the cart, with its texts editable in place.
#}
{% macro text(text, caption, isEditMode, tag) %}
  {%- set tag = tag ?: 'span' -%}
  <{{ tag }}{{ text.attributes|raw }}>
    {%- if text.content %}{{ text.content }}{% elseif isEditMode %}<span class="xEmpty">&nbsp;{{ caption }}&nbsp;</span>{% endif -%}
  </{{ tag }}>
{%- endmacro %}
{% import _self as cart %}
{# A shop with PayPal's REST credentials gets PayPal's buttons, which start with these #}
<div id="shoppingCartOuter" class="cart"
  {%- if paypalButtons %} data-paypal-client-id="{{ paypalButtons.client_id }}" data-paypal-sdk-url="{{ paypalButtons.sdk_url }}" data-paypal-currency="{{ paypalButtons.currency }}"{% endif %}>
  <h1 id="shoppingCartTitle" class="cart-title">{{ cartTitle }}</h1>

  <div id="shoppingCartEmpty" class="cart-title{% if not isEditMode %} hidden{% endif %}">
    {{ cart.text(emptyCart, 'Shopping cart empty', isEditMode, 'div') }}
  </div>

  <div class="cart-notice cart-expired js-cart-expired{% if not isEditMode %} hidden{% endif %}">
    {{ cart.text(expiredCart, 'Shopping cart is expired', isEditMode, 'div') }}
  </div>

  <div class="cart-order-placed js-cart-order-placed hidden">
    <h2 class="cart-order-placed-headline js-cart-order-placed-headline"></h2>
    <p class="cart-order-placed-next-step js-cart-order-placed-next-step"></p>
    <p class="cart-notice js-cart-order-number"></p>
    <button type="button" class="cart-button cart-button--primary" onclick="closeShoppingCart();">{{ returnToStore.content }}</button>
  </div>

  <div class="cart-contents js-cart-contents">
    <div class="cart-lines-head">
      <div class="cart-line-name">{{ cart.text(tableHeadTitle, 'Title', isEditMode) }}</div>
      <div class="cart-line-quantity">{{ cart.text(tableHeadQuantity, 'Quantity', isEditMode) }}</div>
      <div class="cart-line-price">{{ cart.text(tableHeadPrice, 'Price', isEditMode) }}</div>
      <div class="cart-line-sum">{{ cart.text(tableHeadSum, 'Sum', isEditMode) }} ({{ currency }})</div>
    </div>

    <ul class="cart-lines js-cart-lines"></ul>

    {# Each product in the cart gets a copy of this line #}
    <template class="js-cart-line-template">
      <li class="cart-line js-cart-line">
        <div class="cart-line-image js-cart-line-image hidden"></div>
        <div class="cart-line-name js-cart-line-name"></div>
        <div class="cart-line-quantity cart-stepper">
          <button type="button" class="cart-stepper-button js-cart-quantity-decrease" aria-label="Remove one">
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3.5 8h9" /></svg>
          </button>
          <span class="cart-stepper-value js-cart-line-quantity"></span>
          <button type="button" class="cart-stepper-button js-cart-quantity-increase" aria-label="Add one">
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3.5 8h9M8 3.5v9" /></svg>
          </button>
        </div>
        <div class="cart-line-price js-cart-line-price"></div>
        <div class="cart-line-sum js-cart-line-sum"></div>
      </li>
    </template>

    <div class="cart-options">
      {% if discountAvailable %}
        <div class="cart-field">
          <label class="cart-label" for="promo_code">{{ cart.text(promoCode, 'Promo code', isEditMode) }}</label>
          <div class="cart-input-group">
            <input class="cart-input" type="text" name="promo_code" id="promo_code" autocomplete="off">
            {% if isEditMode %}
              <div class="cart-button cart-button--secondary">{{ cart.text(promoButton, 'OK', isEditMode) }}</div>
            {% else %}
              <button type="button" class="cart-button cart-button--secondary">{{ promoButton.content }}</button>
            {% endif %}
          </div>
        </div>
      {% endif %}

      <div class="cart-field">
        <label class="cart-label" for="shipping_select">{{ cart.text(shippingTo, 'Shipping to', isEditMode) }}</label>
        <select class="cart-select" id="shipping_select">
          {% for region in shippingRegions %}
            <option value="{{ region.id }}">{{ region.name }}</option>
          {% endfor %}
        </select>
      </div>
    </div>

    <dl class="cart-totals">
      <div class="cart-totals-row">
        <dt>{{ cart.text(shippingTotal, 'Shipping', isEditMode) }}</dt>
        <dd><span class="js-cart-shipping-sum"></span> {{ currency }}</dd>
      </div>
      <div class="cart-totals-row js-cart-discount{% if not isEditMode %} hidden{% endif %}">
        <dt>{{ cart.text(discount, 'Discount', isEditMode) }}</dt>
        <dd class="js-cart-discount-percent"></dd>
      </div>
      <div class="cart-totals-row cart-totals-row--total">
        <dt>{{ cart.text(total, 'Total', isEditMode) }}</dt>
        <dd><span class="js-cart-total"></span> {{ currency }}</dd>
      </div>
      <div class="cart-totals-row cart-totals-row--vat js-cart-vat{% if not isEditMode %} hidden{% endif %}">
        <dt>{{ cart.text(includedVat, 'Incl vat', isEditMode) }} (<span class="js-cart-vat-rate"></span>%)</dt>
        <dd><span class="js-cart-vat-amount"></span> {{ currency }}</dd>
      </div>
    </dl>
  </div>

  <div class="cart-checkout js-cart-checkout">
    <section class="cart-section">
      <h2 class="cart-section-title">{{ cart.text(billingAddress, 'Billing address', isEditMode) }}</h2>

      <label class="cart-check">
        <input type="checkbox" id="cartTextLegalPerson" value="1">
        {{ cart.text(legalPerson, 'Legal person', isEditMode) }}
      </label>

      <div class="cart-fields">
        <div class="cart-field cart-field--wide cart-field--required js-cart-field js-cart-company-field{% if not isEditMode %} hidden{% endif %}">
          <label class="cart-label" for="company">{{ cart.text(company, 'Company', isEditMode) }}</label>
          <input class="cart-input" type="text" name="company" id="company" autocomplete="billing organization" aria-required="true">
        </div>

        <div class="cart-field cart-field--required js-cart-field js-cart-company-field{% if not isEditMode %} hidden{% endif %}">
          <label class="cart-label" for="company_reg_no">{{ cart.text(companyRegistrationNumber, 'Company reg. no.', isEditMode) }}</label>
          <input class="cart-input" type="text" name="company_reg_no" id="company_reg_no" autocomplete="off" aria-required="true">
        </div>

        <div class="cart-field js-cart-field js-cart-company-field{% if not isEditMode %} hidden{% endif %}">
          <label class="cart-label" for="vat_no">{{ cart.text(vatNumber, 'VAT no.', isEditMode) }}</label>
          <input class="cart-input" type="text" name="vat_no" id="vat_no" autocomplete="off">
        </div>

        <div class="cart-field cart-field--wide cart-field--required js-cart-field js-cart-company-field{% if not isEditMode %} hidden{% endif %}">
          <label class="cart-label" for="legal_address">{{ cart.text(legalAddress, 'Legal address', isEditMode) }}</label>
          <input class="cart-input" type="text" name="legal_address" id="legal_address" autocomplete="off" aria-required="true">
        </div>

        <div class="cart-field cart-field--wide cart-field--required js-cart-field">
          <label class="cart-label" for="name">{{ cart.text(nameSurname, 'Name surname', isEditMode) }}</label>
          <input class="cart-input" type="text" name="name" id="name" autocomplete="billing name" aria-required="true">
        </div>

        <div class="cart-field cart-field--wide cart-field--required js-cart-field">
          <label class="cart-label" for="address">{{ cart.text(address, 'Address', isEditMode) }}</label>
          <input class="cart-input" type="text" name="address" id="address" autocomplete="billing street-address" aria-required="true">
        </div>

        <div class="cart-field cart-field--required js-cart-field">
          <label class="cart-label" for="phone">{{ cart.text(phone, 'Phone number', isEditMode) }}</label>
          <input class="cart-input" type="tel" name="phone" id="phone" autocomplete="billing tel" aria-required="true">
        </div>

        <div class="cart-field cart-field--required js-cart-field">
          <label class="cart-label" for="email">{{ cart.text(email, 'Email', isEditMode) }}</label>
          <input class="cart-input" type="email" name="email" id="email" autocomplete="billing email" aria-required="true">
        </div>

        <div class="cart-field cart-field--wide js-cart-field">
          <label class="cart-label" for="notes">{{ cart.text(comments, 'Comments', isEditMode) }}</label>
          <textarea class="cart-input" rows="3" name="notes" id="notes"></textarea>
        </div>
      </div>

      <label class="cart-check">
        <input type="checkbox" id="deliver_billing_addr" checked="checked">
        {{ cart.text(deliverToBillingAddress, 'Deliver to billing_address', isEditMode) }}
      </label>
    </section>

    <section class="cart-section js-cart-shipping-address{% if not isEditMode %} hidden{% endif %}">
      <h2 class="cart-section-title">{{ cart.text(shippingAddressHeader, 'Shipping address', isEditMode) }}</h2>

      <div class="cart-fields">
        <div class="cart-field cart-field--wide cart-field--required js-cart-field">
          <label class="cart-label" for="ship_name">{{ cart.text(nameSurname, 'Name surname', isEditMode) }}</label>
          <input class="cart-input" type="text" name="ship_name" id="ship_name" autocomplete="shipping name" aria-required="true">
        </div>

        <div class="cart-field cart-field--wide cart-field--required js-cart-field">
          <label class="cart-label" for="ship_address">{{ cart.text(address, 'Address', isEditMode) }}</label>
          <input class="cart-input" type="text" name="ship_address" id="ship_address" autocomplete="shipping street-address" aria-required="true">
        </div>

        <div class="cart-field cart-field--required js-cart-field">
          <label class="cart-label" for="ship_phone">{{ cart.text(phone, 'Phone number', isEditMode) }}</label>
          <input class="cart-input" type="tel" name="ship_phone" id="ship_phone" autocomplete="shipping tel" aria-required="true">
        </div>

        <div class="cart-field js-cart-field">
          <label class="cart-label" for="ship_email">{{ cart.text(email, 'Email', isEditMode) }}</label>
          <input class="cart-input" type="email" name="ship_email" id="ship_email" autocomplete="shipping email">
        </div>

        <div class="cart-field cart-field--wide js-cart-field">
          <label class="cart-label" for="ship_notes">{{ cart.text(comments, 'Comments', isEditMode) }}</label>
          <textarea class="cart-input" rows="3" name="ship_notes" id="ship_notes"></textarea>
        </div>
      </div>
    </section>

    {% if isEditMode or receiveNews.content %}
      <label class="cart-check cart-check--news">
        <input type="checkbox" id="receive_news_updates">
        {{ cart.text(receiveNews, 'Receive news and updates', isEditMode) }}
      </label>
    {% endif %}

    <section class="cart-section">
      <h2 class="cart-section-title" id="shoppingCartPaymentTitle">{{ cart.text(paymentHeader, 'Choose payment method', isEditMode) }}</h2>

      {% if isEditMode or paymentDescription.content %}
        <p class="cart-note">{{ cart.text(paymentDescription, 'Payment description', isEditMode) }}</p>
      {% endif %}

      <div class="cart-payment-methods" role="radiogroup" aria-labelledby="shoppingCartPaymentTitle">
        {% if isPaypalAvailable %}
          <label class="cart-payment-option">
            <input type="radio" name="payment_method" value="creditcard" id="pm_creditcard" checked="checked">
            <span class="cart-payment-option-name">{{ cart.text(cardPayment, 'Debit or credit card', isEditMode) }}</span>
            <span class="cart-payment-option-marks" aria-hidden="true">
              <svg class="cart-payment-mark" viewBox="0 4 24 16" focusable="false"><path fill="#1A1F71" d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z" /></svg>
              <svg class="cart-payment-mark" viewBox="0 0 24 15" focusable="false"><circle cx="8.5" cy="7.5" r="7" fill="#EB001B" /><circle cx="15.5" cy="7.5" r="7" fill="#F79E1B" /><path fill="#FF5F00" d="M12 1.44a7 7 0 0 1 0 12.12a7 7 0 0 1 0-12.12z" /></svg>
            </span>
          </label>

          <label class="cart-payment-option">
            <input type="radio" name="payment_method" value="paypal" id="pm_paypal">
            <span class="cart-payment-option-name">{{ cart.text(paypalPayment, 'PayPal', isEditMode) }}</span>
            <span class="cart-payment-option-marks" aria-hidden="true">
              <svg class="cart-payment-mark" viewBox="0 0 24 24" focusable="false"><path fill="#003087" d="M7.016 19.198h-4.2a.562.562 0 0 1-.555-.65L5.093.584A.692.692 0 0 1 5.776 0h7.222c3.417 0 5.904 2.488 5.846 5.5-.006.25-.027.5-.066.747A6.794 6.794 0 0 1 12.071 12H8.743a.69.69 0 0 0-.682.583l-.325 2.056-.013.083-.692 4.39-.015.087zM19.79 6.142c-.01.087-.01.175-.023.261a7.76 7.76 0 0 1-7.695 6.598H9.007l-.283 1.795-.013.083-.692 4.39-.134.843-.014.088H6.86l-.497 3.15a.562.562 0 0 0 .555.65h3.612c.34 0 .63-.249.683-.585l.952-6.031a.692.692 0 0 1 .683-.584h2.126a6.793 6.793 0 0 0 6.707-5.752c.306-1.95-.466-3.744-1.89-4.906z" /></svg>
            </span>
          </label>
        {% endif %}

        {% if isManualTransferAvailable %}
          <label class="cart-payment-option">
            <input type="radio" name="payment_method" value="bank_transfer" id="pm_bank_transfer"{% if config.paymentMethod == 'bank' or not isPaypalAvailable %} checked="checked"{% endif %}>
            <span class="cart-payment-option-name">{{ cart.text(manualTransfer, 'Bank transfer', isEditMode) }}</span>
            <span class="cart-payment-option-marks" aria-hidden="true">
              <svg class="cart-payment-mark cart-payment-mark--icon" viewBox="0 0 24 24" focusable="false"><path d="M3 9.5 12 4l9 5.5M4.5 10v8M9.5 10v8M14.5 10v8M19.5 10v8M3 20.5h18" /></svg>
            </span>
          </label>
        {% endif %}
      </div>
    </section>

    <div class="cart-pay">
      {% if isEditMode or checkoutDescription.content %}
        <p class="cart-note">{{ cart.text(checkoutDescription, 'Checkout description', isEditMode) }}</p>
      {% endif %}

      <div class="cart-pay-total">
        <span>{{ totalLabel }}</span>
        <span><span class="js-cart-total"></span> {{ currency }}</span>
      </div>

      {% if config.termsLink %}
        <p class="cart-terms">
          {% if isEditMode %}
            {{ cart.text(terms, 'By purchasing our products you agree to the Terms of Service', isEditMode) }}
          {% else %}
            <a href="{{ config.termsLink }}" target="_blank" rel="noopener">{{ terms.content }}</a>
          {% endif %}
        </p>
      {% endif %}

      <p class="cart-message cart-message--error js-cart-required-message{% if not isEditMode %} hidden{% endif %}" role="alert">
        {{ cart.text(fillRequiredFields, 'Please fill in all required fields', isEditMode) }}
      </p>

      {# How a PayPal payment went when it didn't go through #}
      <p class="cart-message cart-message--error js-cart-payment-message hidden" role="alert"></p>

      <div class="cart-pay-button js-cart-checkout-slot">
        {% if isEditMode %}
          <div class="cart-button cart-button--primary">{{ cart.text(checkoutButton, 'Checkout and pay', isEditMode) }}</div>
        {% else %}
          <button type="button" class="cart-button cart-button--primary js-cart-checkout-button">{{ checkoutButton.content }}</button>
        {% endif %}
      </div>

      <p class="cart-return">
        {% if isEditMode %}
          {{ cart.text(returnToStore, 'Return to store', isEditMode) }}
        {% else %}
          <button type="button" class="cart-link" onclick="closeShoppingCart();">{{ returnToStore.content }}</button>
        {% endif %}
      </p>
    </div>
  </div>
</div>
`,
  'Shop/shoppingCartLink': `<div id="shoppingCart"{{ attributes|raw }}>
	<a href="{{ link|raw }}">
		<span class="title">
			{% if image %}
				<img src="{{ image.src }}" alt="{{ image.alt }}" title="{{ image.alt }}">
			{% else %}
				{{ title }}
			{% endif %}
		</span>
		<span class="numItemsContainer hidden">
			(<span class="numItems">0</span>)
		</span>
	</a>
</div>
`,
  'Sites/Sections/Entries/Galleries/editEmptyGallery': `<div class="xGalleryContainer">
  <div class="imageEmpty">
    <a href="#" class="xGalleryEditButton"><span class="xEmpty">&nbsp;gallery&nbsp;</span></a>
  </div>
</div>
`,
  'Sites/Sections/Entries/Galleries/galleryColumn': `<div class="{{ galleryClassList }}"{% if isFullscreen %} data-fullscreen="1"{% endif %}>
  {% if items %}
    <div class="xGallery" style="{{ galleryStyles }}" {% if rowGalleryPadding %} rowGalleryPadding="{{ rowGalleryPadding }}"{% endif %}>

      {% for item in items %}
        {% if item.type == 'image' %}
          <div class="xGalleryItem xGalleryItemType-image xImgIndex-1" style="width: {{ item.width }}px; height: {{ item.height }}px">
            <img src="{{ item.src }}" width="{{ item.width }}" height="{{ item.height }}"{% if item.srcset %} srcset="{{ item.srcset }}"{% endif %} alt="{{ item.alt|raw }}">
            <div class="xGalleryImageCaption">{{ item.caption|raw }}</div>
          </div>
        {% else %}
          <div class="xGalleryItem xGalleryItemType-video">
            <video width="{{ item.width }}" controls controlsList="nodownload"{% if item.poster %} poster="{{ item.poster }}"{% endif %}{% if item.autoplay %} data-autoplay="1"{% endif %}>
              <source src="{{ item.original }}" type="video/mp4">
            </video>
            <div class="xGalleryImageCaption">{{ item.caption|raw }}</div>
          </div>
        {% endif %}
      {% endfor %}

      {% if isEditMode %}
        <a href="#" class="xGalleryEditButton xEditorLink xSysCaption xMAlign-container">
          <span class="xMAlign-outer-gallery">
            <span class="xMAlign-inner-gallery">edit gallery</span>
          </span>
        </a>
      {% endif %}
    </div>

    <ul class="xGalleryNav" style="display:none">
      {% for item in navigationItems %}
        <li>
          <a href="{{ item.src }}" target="_blank"{{ item.attributes|raw }}>
            <span>{{ item.index }}</span>
          </a>
          <div class="xGalleryImageCaption">{{ item.caption|raw }}</div>
        </li>
      {% endfor %}
    </ul>
  {% endif %}
</div>
`,
  'Sites/Sections/Entries/Galleries/galleryGrid': `<div class="{{ galleryClassList }}"{% if isFullscreen %} data-fullscreen="1"{% endif %}>
  {% if items %}
    <div class="xGallery" xGridColumnsMobile="{{ gridColumnsMobile }}" xGridColumnsDesktop="{{ gridColumnsDesktop }}" xGridColumnsLarge="{{ gridColumnsLargeDesktop }}"{% if gridGap %} xGridGap="{{ gridGap }}"{% endif %}>

      {%- for item in items -%}
        {%- if item.type == 'image' -%}
          <div class="xGalleryItem xGalleryItemType-image xImgIndex-1">
            <img src="{{ item.src }}" width="{{ item.width }}" height="{{ item.height }}"{% if item.srcset %} srcset="{{ item.srcset }}"{% endif %} alt="{{ item.alt|raw }}">
            <div class="xGalleryImageCaption">{{ item.caption|raw }}</div>
          </div>
        {%- else -%}
          <div class="xGalleryItem xGalleryItemType-video">
            <video width="{{ item.width }}" controls controlsList="nodownload"{% if item.poster %} poster="{{ item.poster }}"{% endif %}{% if item.autoplay %} data-autoplay="1"{% endif %}>
              <source src="{{ item.original }}" type="video/mp4">
            </video>
            <div class="xGalleryImageCaption">{{ item.caption|raw }}</div>
          </div>
        {%- endif -%}
      {%- endfor -%}

      {%- if isEditMode -%}
        <a href="#" class="xGalleryEditButton xEditorLink xSysCaption xMAlign-container">
          <span class="xMAlign-outer-gallery">
            <span class="xMAlign-inner-gallery">edit gallery</span>
          </span>
        </a>
      {%- endif -%}
    </div>

    <ul class="xGalleryNav" style="display:none">
      {% for item in navigationItems %}
        <li>
          <a href="{{ item.src }}" target="_blank"{{ item.attributes|raw }}>
            <span>{{ item.index }}</span>
          </a>
          <div class="xGalleryImageCaption">{{ item.caption|raw }}</div>
        </li>
      {% endfor %}
    </ul>
  {% endif %}
</div>
`,
  'Sites/Sections/Entries/Galleries/galleryLink': `<div class="{{ galleryClassList }}">
  {% if items %}
    <a href="{{ linkAddress }}" target="{{ linkTarget }}" class="xGallery" style="{{ galleryStyles }}">
      {% for item in items %}
        {% if item.type == 'image' %}
          <div class="xGalleryItem xGalleryItemType-image xImgIndex-1" style="width: {{ item.width }}px; height: {{ item.height }}px">
            <img src="{{ item.src }}" width="{{ item.width }}" height="{{ item.height }}"{% if item.srcset %} srcset="{{ item.srcset }}"{% endif %} alt="{{ item.alt|raw }}">
            <div class="xGalleryImageCaption">{{ item.caption|raw }}</div>
          </div>
        {% else %}
          <div class="xGalleryItem xGalleryItemType-video">
            <video width="{{ item.width }}" controls controlsList="nodownload"{% if item.poster %} poster="{{ item.poster }}"{% endif %}{% if item.autoplay %} data-autoplay="1"{% endif %}>
              <source src="{{ item.original }}" type="video/mp4">
            </video>
            <div class="xGalleryImageCaption">{{ item.caption|raw }}</div>
          </div>
        {% endif %}
      {% endfor %}

      {% if isEditMode %}
        <a href="#" class="xGalleryEditButton xEditorLink xSysCaption xMAlign-container">
          <span class="xMAlign-outer-gallery">
            <span class="xMAlign-inner-gallery">edit gallery</span>
          </span>
        </a>
      {% endif %}
    </a>
  {% endif %}
</div>
`,
  'Sites/Sections/Entries/Galleries/galleryPile': `<div class="{{ galleryClassList }}"{% if isFullscreen %} data-fullscreen="1"{% endif %}>
  {% if items %}
    <div class="xGallery" style="{{ galleryStyles }}" {% if rowGalleryPadding %} rowGalleryPadding="{{ rowGalleryPadding }}"{% endif %}>

      {% for item in items %}
        {% if item.type == 'image' %}
          <div class="xGalleryItem xGalleryItemType-image xImgIndex-1" style="width: {{ item.width }}px; height: {{ item.height }}px">
            <img src="{{ item.src }}" width="{{ item.width }}" height="{{ item.height }}"{% if item.srcset %} srcset="{{ item.srcset }}"{% endif %} alt="{{ item.alt|raw }}">
            <div class="xGalleryImageCaption">{{ item.caption|raw }}</div>
          </div>
        {% else %}
          <div class="xGalleryItem xGalleryItemType-video">
            <video width="{{ item.width }}" controls controlsList="nodownload"{% if item.poster %} poster="{{ item.poster }}"{% endif %}{% if item.autoplay %} data-autoplay="1"{% endif %}>
              <source src="{{ item.original }}" type="video/mp4">
            </video>
            <div class="xGalleryImageCaption">{{ item.caption|raw }}</div>
          </div>
        {% endif %}
      {% endfor %}

      {% if isEditMode %}
        <a href="#" class="xGalleryEditButton xEditorLink xSysCaption xMAlign-container">
          <span class="xMAlign-outer-gallery">
            <span class="xMAlign-inner-gallery">edit gallery</span>
          </span>
        </a>
      {% endif %}
    </div>

    <ul class="xGalleryNav" style="display:none">
      {% for item in navigationItems %}
        <li>
          <a href="{{ item.src }}" target="_blank"{{ item.attributes|raw }}>
            <span>{{ item.index }}</span>
          </a>
          <div class="xGalleryImageCaption">{{ item.caption|raw }}</div>
        </li>
      {% endfor %}
    </ul>
  {% endif %}
</div>
`,
  'Sites/Sections/Entries/Galleries/galleryRow': `<div class="{{ galleryClassList }}"{% if isFullscreen %} data-fullscreen="1"{% endif %}>
  {% if items %}
    <div class="xGallery" style="{{ galleryStyles }}" {% if rowGalleryPadding %} xRowGalleryPadding="{{ rowGalleryPadding }}"{% endif %}>

      {%- for item in items -%}
        {%- if item.type == 'image' -%}
          <div class="xGalleryItem xGalleryItemType-image xImgIndex-1" style="width: {{ item.width }}px; height: {{ item.height }}px">
            <img src="{{ item.src }}" width="{{ item.width }}" height="{{ item.height }}"{% if item.srcset %} srcset="{{ item.srcset }}"{% endif %} alt="{{ item.alt|raw }}">
            <div class="xGalleryImageCaption">{{ item.caption|raw }}</div>
          </div>
        {%- else -%}
          <div class="xGalleryItem xGalleryItemType-video">
            <video width="{{ item.width }}" controls controlsList="nodownload"{% if item.poster %} poster="{{ item.poster }}"{% endif %}{% if item.autoplay %} data-autoplay="1"{% endif %}>
              <source src="{{ item.original }}" type="video/mp4">
            </video>
            <div class="xGalleryImageCaption">{{ item.caption|raw }}</div>
          </div>
        {%- endif -%}
      {%- endfor -%}

      {%- if loader -%}
        <div class="xGalleryItem loading" style="width: {{ loader.width }}px; min-height: {{ loader.height }}px;">
          <svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" height="128" width="128" version="1.1">
            <g>
              <path style="fill:#ccc;fill-opacity:1;stroke-width:21.4183197" d="M 84.500003,64.000001 A 15.500001,15.500001 0 0 0 100,79.5 15.500001,15.500001 0 0 0 115.5,64.000001 15.500001,15.500001 0 0 0 100,48.5 15.500001,15.500001 0 0 0 84.500003,64.000001 Z m -41.000003,0 A 15.500001,15.500001 0 0 1 28,79.5 15.500001,15.500001 0 0 1 12.5,64.000001 15.500001,15.500001 0 0 1 28,48.5 15.500001,15.500001 0 0 1 43.5,64.000001 Z" />
            </g>
          </svg>
        </div>
      {%- endif -%}

      {%- if isEditMode -%}
        <a href="#" class="xGalleryEditButton xEditorLink xSysCaption xMAlign-container">
          <span class="xMAlign-outer-gallery">
            <span class="xMAlign-inner-gallery">edit gallery</span>
          </span>
        </a>
      {%- endif -%}
    </div>

    <ul class="xGalleryNav" style="display:none">
      {% for item in navigationItems %}
        <li>
          <a href="{{ item.src }}" target="_blank"{{ item.attributes|raw }}>
            <span>{{ item.index }}</span>
          </a>
          <div class="xGalleryImageCaption">{{ item.caption|raw }}</div>
        </li>
      {% endfor %}
    </ul>
  {% endif %}
</div>
`,
  'Sites/Sections/Entries/Galleries/gallerySlideshow': `<div class="{{ galleryClassList }}"{{ attributes.gallery|raw }}>
  {% if items %}
    <div class="xGallery" style="{{ galleryStyles }}" {% if rowGalleryPadding %} rowGalleryPadding="{{ rowGalleryPadding }}"{% endif %}>
      <div class="swiper">
        <div class="swiper-wrapper">
          {% for item in items %}
            <div class="swiper-slide">
              {% if item.type == 'image' %}
                <div class="xGalleryItem xGalleryItemType-image xImgIndex-1" style="width: {{ item.width }}px; height: {{ item.height }}px">
                  <img src="{{ item.src }}" width="{{ item.width }}" height="{{ item.height }}"{% if item.srcset %} srcset="{{ item.srcset }}"{% endif %} alt="{{ item.alt|raw }}">
                  <div class="xGalleryImageCaption">{{ item.caption|raw }}</div>
                </div>
              {% else %}
                <div class="xGalleryItem xGalleryItemType-video">
                  <video width="{{ item.width }}" controls controlsList="nodownload"{% if item.poster %} poster="{{ item.poster }}"{% endif %}{% if item.autoplay %} data-autoplay="1"{% endif %}>
                    <source src="{{ item.original }}" type="video/mp4">
                  </video>
                  <div class="xGalleryImageCaption">{{ item.caption|raw }}</div>
                </div>
              {% endif %}
            </div>
          {% endfor %}
        </div>

        {% if showNavigation %}
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        {% endif %}
      </div>

      {% if isEditMode %}
        <a href="#" class="xGalleryEditButton xEditorLink xSysCaption xMAlign-container">
          <span class="xMAlign-outer-gallery">
            <span class="xMAlign-inner-gallery">edit gallery</span>
          </span>
        </a>
      {% endif %}
    </div>

    <ul class="xGalleryNav"{% if not showNavigation %} style="display:none"{% endif %}>
      {% for item in navigationItems %}
        <li>
          <a href="{{ item.src }}" target="_blank"{{ item.attributes|raw }}>
            <span>{{ item.index }}</span>
          </a>
          <div class="xGalleryImageCaption">{{ item.caption|raw }}</div>
        </li>
      {% endfor %}
    </ul>

    <div class="loader xHidden"></div>
  {% endif %}
</div>
`,
  'Sites/Sections/Entries/_entryContents': `{% if galleryPosition == 'above title' %}
  {{ gallery|raw }}
{% endif %}

{% if templateName != 'default' %}
  <div class="entryTextWrap galleryType-{{ galleryType }}">
{% endif %}

{{ entryTitle|raw }}

{% if galleryPosition == 'between title/description' %}
  {{ gallery|raw }}
{% endif %}

{% if showDescription %}
  <div class="entryText xNgEditableRTE xProperty-description"{{ attributes.description|raw }}>{% if content.description %}{{ content.description|raw }}{% else %}<span class="xEmpty">&nbsp;description&nbsp;</span>{% endif %}</div>
{% endif %}

{% if galleryPosition == 'below description' %}
  {{ gallery|raw }}
{% endif %}

{% if showUrl %}
  <div class="entryContent">
    {% if isEditMode %}
      <div class="xNgEditable xProperty-url"{{ attributes.url|raw }}>{% if content.url %}{{ content.url }}{% else %}<span class="xEmpty">&nbsp;url&nbsp;</span>{% endif %}</div>
    {% else %}
      <div class="xProperty-url"><a href="{{ content.url }}" target="_blank">{{ content.url }}</a></div>
    {% endif %}
  </div>
{% endif %}

{{ addToCart|raw }}

{# Close entryTextWrap element #}
{% if templateName != 'default' %}
  </div>
{% endif %}

{% if galleryPosition == 'after text wrap' %}
  {{ gallery|raw }}
{% endif %}
`,
  'Sites/Sections/Entries/_entryEditor': `<a class="xCreateNewEntry xPanel xAction-entryCreateNew" href="#"><span>create new entry here</span></a>
<div class="xEntryEditWrap">
  <div class="xEntryEditWrapButtons xPanel">
    {% if templateName == 'messy' %}
      <a href="#" class="xEntryMove xHandle" title="Drag + Shift to move all"><span>move entry</span></a>
    {% else %}
      <a href="#" class="xEntryMove" title="drag to move"><span>move entry</span></a>
    {% endif %}

    <div class="tagsList">
      <div title="{{ tagList }}" class="xNgEditable xNoHTMLEntities xProperty-submenu xFormatModifier-toTags" data-path="{{apiPath}}tags/tag" data-ng-edit-via-title="1" data-empty-caption="tags">{% if tagList %}{{ tagList }}{% else %}<span class="xEmpty">&nbsp;tags&nbsp;</span>{% endif %}</div>
    </div>
    <div class="xEntryDropdown"></div>
    <br class="clear" />
  </div>

  <div class="xEntryDropdownBox">
    <ul>
      {% if sections %}
        <li>
          <a href="#" class="js-bt-open-move-entry-to-section" title="move entry to other section"><span>Move to section</span></a>
        </li>
      {% endif %}

      {% if templateName == 'messy' %}
        <li>
          <a href="#" class="xEntryToBack" title="send to back behind others"><span>Send to back</span></a>
        </li>
        <li>
          <a><div class="xEntryCheck"><label><span class="xNgEditableCheckBox xProperty-fixed" data-path="{{apiPath}}content/fixed"><input type="button" class="{% if entryFixed == 1 %}checked{% endif %}" value="" /></span>Fixed position</label></div></a>
        </li>
        <li>
          <div class="customWidth">
            <div title="{{ entryWidth }}" class="xNgEditable xCSSUnits-1 xProperty-width" data-path="{{apiPath}}content/width" data-ng-edit-via-title="1" data-empty-caption="width">{% if entryWidth %}{{ entryWidth }}{% else %}<span class="xEmpty">&nbsp;width&nbsp;</span>{% endif %}</div>
          </div>
        </li>
      {% endif %}
      <li>
        <a><div class="xEntryCheck"><label><span class="xNgEditableCheckBox xProperty-marked" data-path="{{apiPath}}marked"><input type="button" class="{% if entryMarked == 1 %}checked{% endif %}" value="" /></span>Marked</label></div></a>
      </li>
      <li>
        <a href="#" class="xEntryDelete xAction-entryDelete" title="delete"><span>Delete</span></a>
      </li>
    </ul>

    {{ productAttributesEditor|raw }}
  </div>

  {% if sections %}
    <div class="bt-move-entry-to-section">
      Move entry to:
      <select class="js-move-entry-to-section">
        <option>-</option>
        {% for section in sections %}
          <option value="{{ section.name }}">{{ section.title }}</option>
        {% endfor %}
      </select>
    </div>
  {% endif %}

  {{ entryContents|raw }}
</div>
`,
  'Sites/Sections/Entries/_entryTitle': `<h2><span class="xNgEditable xProperty-title xCaption-entry&nbsp;title"{{ attributes.title|raw }}>{% if content.title %}{{ content.title }}{% else %}<span class="xEmpty">&nbsp;entry title&nbsp;</span>{% endif %}</span></h2>
`,
  'Sites/Sections/Entries/entry': `<{{ entryHTMLTag }} id="{{ entryId }}"{{ attributes.entry|raw }}>
  {{ entryContents|raw }}
</{{ entryHTMLTag }}>
`,
  'Sites/Sections/Entries/mashupEntries': `<div{{ wrapperAttributes|raw }}>
  {% for entry in entries %}
    <div{{ entry.attributes|raw }}>
      {% if not entry.item.galleryItem %}
        {{ entry.item.content|raw }}
      {% else %}
        {% if entry.item.url %}
          <a href="{{ entry.item.url }}">
        {% endif %}
        {% if entry.item.galleryItem.type == 'image' %}
          <img src="{{ entry.item.galleryItem.src }}" width="{{ entry.item.galleryItem.width }}" height="{{ entry.item.galleryItem.height }}"{% if entry.item.galleryItem.srcset %} srcset="{{ entry.item.galleryItem.srcset }}"{% endif %} alt="{{ entry.item.galleryItem.alt|raw }}">
        {% else %}
          <video width="{{ entry.item.galleryItem.width }}" controls controlsList="nodownload"{% if entry.item.galleryItem.poster %} poster="{{ entry.item.galleryItem.poster }}"{% endif %}{% if entry.item.galleryItem.autoplay %} data-autoplay="1"{% endif %}>
            <source src="{{ entry.item.galleryItem.original }}" type="video/mp4">
          </video>
        {% endif %}
        {% if entry.item.url %}
          </a>
        {% endif %}
      {% endif %}
      {% if isEditMode %}
        <div class="xHandle"></div>
      {% endif %}
    </div>
  {% endfor %}
  <br class="clear" />
</div>
`,
  'Sites/Sections/Entries/portfolioThumbnails': `<div class="portfolioThumbnailsWrap">
	<div class="portfolioThumbnails clearfix">
		{% for entry in entries %}
      <div class="portfolioThumbnail" data-id="{{ entry.id }}">
        <div class="wrap">
          {% if isEditMode %}
            <div class="xHandle"></div>
          {% endif %}
          <a href="#{{ entry.slug }}">
            {% if entry.image %}
              <img{{ entry.image.attributes|raw }}>
            {% endif %}
            {% if entry.caption %}
              <span>{{entry.caption }}</span>
            {% endif %}
          </a>
        </div>
      </div>
		{% endfor %}
	</div>
</div>
`,
  'Sites/Sections/Entries/shop/_addToCart': `<div class="addToCart" data-uniqid="{{ uniqid }}">
  {% if isEditMode %}
    <div class="cartPrice xNgEditable xProperty-cartPrice xCaption-price xFormatModifier-toPrice" title="{{ content.cartPrice }}" data-ng-edit-via-title="1" data-empty-caption="price"{{ attributes.cartPrice|raw }}>{% if cartPriceFormatted %}{{ cartPriceFormatted }}{% else %}<span class="xEmpty">&nbsp;price&nbsp;</span>{% endif %}</div>
  {% else %}
    <div class="cartPrice" title="{{ content.cartPrice }}" data-weight="{{ content.weight }}">{{ cartPriceFormatted }}</div>
  {% endif %}

  <br class="clear">

  <div class="cartAttributes{% if not cartAttributes %} hidden{% endif %}">
    {% if cartAttributes %}
      <select class="cart_attributes">
        {% for cartAttribute in cartAttributes %}
          <option value="{{ cartAttribute }}">{{ cartAttribute }}</option>
        {% endfor %}
      </select>
    {% endif %}
  </div>
  <button type="button" class="addToCartButton{% if not content.cartPrice or not isEditMode %} hidden{% endif %}">{{ addToBasketLabel }}</button>
  <span class="addedToCart hidden" data-text="{{ addedToBasketText }}"></span>
  <span class="outOfStock hidden">{{ outOfStockText }}</span>
</div>
`,
  'Sites/Sections/Entries/shop/_cartTitle': `<h2><span class="xNgEditable xProperty-cartTitle xCaption-item-name cCartTitle"{{ attributes.cartTitle|raw }}>{% if content.cartTitle %}{{ content.cartTitle }}{% else %}<span class="xEmpty">&nbsp;item name&nbsp;</span>{% endif %}</span></h2>
`,
  'Sites/Sections/Entries/shop/_productAttributesEditor': `<div class="xEntrySeperator"></div>
<div class="xEntryBoxParams">
  <b>Attribute</b>
  <div class="xNgEditable xProperty-cartAttributes xCaption-attribute cCartAttributes" data-path="{{apiPath}}content/cartAttributes" data-empty-caption="attribute">{% if cartAttributesEdit %}{{ cartAttributesEdit }}{% else %}<span class="xEmpty">&nbsp;attribute&nbsp;</span>{% endif %}</div>
  <div class="xNgEditable xProperty-weight xCaption-weight xUnits-{{ weightUnits }}" data-path="{{apiPath}}content/weight" data-empty-caption="weight">{% if entryWeight %}{{ entryWeight }}{% else %}<span class="xEmpty">&nbsp;weight&nbsp;</span>{% endif %}</div>
</div>
`,
  'Sites/Sections/additionalFooterText': `<div{{ attributes|raw }}>
  {% if content %}
    {{ content|raw }}
  {% elseif isEditMode %}
    <span class="xEmpty">&nbsp;additional footer text&nbsp;</span>
  {% endif %}
</div>
`,
  'Sites/Sections/additionalText': `<div{{ wrapperAttributes|raw }}>
  {% if isEditMode %}
    <div class="xHandle"></div>
  {% endif %}
  {% if content.attributes %}
    <div{{ content.attributes|raw }}>{% if content.html %}{{ content.html|raw }}{% else %}<span class="xEmpty">&nbsp;additional text&nbsp;</span>{% endif %}</div>
  {% else %}
    {{ content.html|raw }}
  {% endif %}
</div>
`,
  'Sites/Sections/defaultTemplate': `<!DOCTYPE html>
<!--[if lt IE 7 ]> <html class="ie ie6 ie-old"> <![endif]-->
<!--[if IE 7 ]>    <html class="ie ie7 ie-old"> <![endif]-->
<!--[if IE 8 ]>    <html class="ie ie8"> <![endif]-->
<!--[if IE 9 ]>    <html class="ie ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html id="html"> <!--<![endif]-->
  {{ sectionHead|raw }}
  <body class="{{ bodyClasses }}" id="body">
    {{ googleTagManagerNoscript|raw }}
    <div id="allContainer">
      <div id="contentContainer"{% if isResponsive %} class="xResponsive"{% endif %}>
        <div id="sitesMenu">
          {{ sitesMenu|raw }}
        </div>
        <div id="siteHeader">
          {{ siteHeader|raw }}
        </div>
        <div id="additionalTextBlock">
          {{ additionalTextBlock|raw }}
        </div>
        <div id="sectionsMenu">
          {{ sectionsMenu|raw }}
        </div>
        <ol id="pageEntries"{{ pageEntriesAttributes|raw }}>
          {{ entries|raw }}
        </ol>
        <div id="portfolioThumbnails">
          {{ portfolioThumbnails|raw }}
        </div>
        <div id="additionalFooterTextBlock">
          {{ additionalFooterText|raw }}
        </div>
        <p id="userCopyright"{{ userCopyright.attributes|raw }}>
          {{ userCopyright.content|raw }}
        </p>
        {% if bertaCopyright %}
          <div id="bertaCopyright">{{ bertaCopyright|raw }}</div>
        {% endif %}
      </div>
      <div id="siteBanners">
        {{ siteBanners|raw }}
      </div>
    </div>
    <div id="sectionFooter">
      {{ sectionFooter|raw }}
    </div>
  </body>
</html>
`,
  'Sites/Sections/googleTagManagerNoscript': `{% if googleTagManagerContainerId %}
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ googleTagManagerContainerId }}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
{% endif %}
`,
  'Sites/Sections/gridView': `<div id="xGridView">
  {% for item in items %}
    <div class="box">
      <a href="{{ item.url }}"><img class="xGridItem" src="{{ item.src }}" /></a>
    </div>
  {% endfor %}
</div>
`,
  'Sites/Sections/mashupTemplate': `<!DOCTYPE html>
<!--[if lt IE 7 ]> <html class="ie6 ie-old"> <![endif]-->
<!--[if IE 7 ]>    <html class="ie7 ie-old"> <![endif]-->
<!--[if IE 8 ]>    <html class="ie8"> <![endif]-->
<!--[if IE 9 ]>    <html class="ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html id="html"> <!--<![endif]-->
  {{ sectionHead|raw }}
  <body class="{{ bodyClasses }}" id="body">
    {{ googleTagManagerNoscript|raw }}
    <div id="allContainer"{% if isCenteredPageLayout %} class="xCentered"{% endif %}>
      <div id="sideColumn"{{ sideColumnAttributes|raw }}>
        <div id="sideColumnTop">
          <div id="sitesMenu">
            {{ sitesMenu|raw }}
          </div>
          <div id="siteHeader">
            {{ siteHeader|raw }}
          </div>
          <div id="additionalTextBlock">
            {{ additionalTextBlock|raw }}
          </div>
          <div id="sectionsMenu">
            {{ sectionsMenu|raw }}
          </div>
        </div>
        <div id="sideColumnBottom">
          <div id="socialMediaLinks">
            {{ socialMediaLinks|raw }}
          </div>
          <p id="userCopyright"{{ userCopyright.attributes|raw }}>
            {{ userCopyright.content|raw }}
          </p>
          {% if bertaCopyright %}
            <p id="bertaCopyright">{{ bertaCopyright|raw }}</p>
          {% endif %}
        </div>
      </div>
      <div id="contentContainer"{{ contentContainerAttributes|raw }}>
        {% if sectionType == 'mash_up' %}
          {% if isResponsive %}
            <div id="mainColumnContainer">
              <div id="mainColumn"{{ mainColumnAttributes|raw }}>
          {% endif %}
          <div id="mashupEntries">
            {{ mashupEntries|raw }}
          </div>
          {% if isResponsive %}
              </div>
            </div>
          {% endif %}
        {% else %}
          <div id="mainColumnContainer">
            <div id="mainColumn"{{ mainColumnAttributes|raw }}>
              <ol id="pageEntries"{{ pageEntriesAttributes|raw }}>
                {{ entries|raw }}
              </ol>
              <br class="clear" />
              <div id="portfolioThumbnails">
                {{ portfolioThumbnails|raw }}
              </div>
            </div>
          </div>
        {% endif %}
      </div>
      <div class="floating-banners" id="siteBanners">
        {{ siteBanners|raw }}
      </div>
    </div>
    <div id="sectionFooter">
      {{ sectionFooter|raw }}
    </div>
  </body>
</html>
`,
  'Sites/Sections/messyTemplate': `<!DOCTYPE html>
<html id="html">
  {{ sectionHead|raw }}
  <body class="{{ bodyClassList }}" id="body">
    {{ googleTagManagerNoscript|raw }}
    {% if sectionType != 'shopping_cart' %}
      {{ backgroundGallery|raw }}
      {% if backgroundVideoEmbed %}
        <div id="xBackgroundVideoEmbed" class="{{ backgroundVideoEmbed.class }}">
          {{ backgroundVideoEmbed.content|raw }}
        </div>
      {% endif %}
      {% if gridlinesAttributes %}
        <div id="xGridBackground"{{ gridlinesAttributes|raw }}></div>
      {% endif %}
    {% endif %}
    <div id="allContainer">
      {% if sectionType == 'shopping_cart' %}
        {{ cartSection|raw }}
      {% else %}
        <div id="contentContainer"{{ contentContainerAttributes|raw }}>
          {{ shoppingCartLink|raw }}
          <div id="sitesMenu">
            {{ sitesMenu|raw }}
          </div>
          {% if showBackgroundGalleryEditor %}
            <div id="xBgEditorPanelTrigContainer">
              <a href="#" id="xBgEditorPanelTrig" title="Edit background gallery">
                <svg height="16" width="16" viewBox="0 0 16 16">
                    <path d="m3.8 14.6 1-1-2.5-2.5-1 1v1.1h1.4v1.4zm5.5-9.8q0-0.2-0.2-0.2-0.1 0-0.2 0.1l-5.7 5.7q-0.1 0.1-0.1 0.2 0 0.2 0.2 0.2 0.1 0 0.2-0.1l5.7-5.7q0.1-0.1 0.1-0.2zm-0.6-2 4.4 4.4-8.8 8.8h-4.4v-4.4zm7.2 1q0 0.6-0.4 1l-1.8 1.8-4.4-4.4 1.8-1.7q0.4-0.4 1-0.4 0.6 0 1 0.4l2.5 2.5q0.4 0.4 0.4 1z" fill="currentColor" />
                </svg>
              </a>
            </div>
          {% endif %}
          <div id="siteHeader">
            {{ siteHeader|raw }}
          </div>
          <div id="sectionsMenu">
            {{ sectionsMenu|raw }}
          </div>
          {% if not isGridViewEnabled %}
            <div id="pageEntries"{{ pageEntriesClasses|raw }}>
              {{ entries|raw }}
            </div>
          {% endif %}
          <div id="portfolioThumbnails">
            {{ portfolioThumbnails|raw }}
          </div>
          <div id="additionalTextBlock">
            {{ additionalTextBlock|raw }}
          </div>
          <div id="siteBanners">
            {{ siteBanners|raw }}
          </div>
        </div>
        {% if gridTrigger %}
          <div id="xGridViewTriggerContainer"{{ gridTrigger.attributes|raw }}>
            <a id="xGridViewTrigger" href="{{ gridTrigger.link }}"><span>thumbnails</span></a>
          </div>
        {% endif %}
      {% endif %}
    </div>
    {% if sectionType != 'shopping_cart' %}
      {{ gridView|raw }}
      <div id="bottom" class="clearfix">
        <div id="additionalFooterTextBlock">
          {{ additionalFooterText|raw }}
        </div>
          {% if bertaCopyright %}
            <p id="bertaCopyright">{{ bertaCopyright|raw }}</p>
          {% endif %}
          <p id="userCopyright"{{ userCopyright.attributes|raw }}>
            {{ userCopyright.content|raw }}
          </p>
      </div>
    <div id="sectionFooter">
      {{ sectionFooter|raw }}
    </div>
    {% endif %}
  </body>
</html>
`,
  'Sites/Sections/sectionBackgroundGallery': `<div id="xBackgroundContainer">
  <div{{ wrapperAttributes|raw }}>
    <div id="xBackgroundLoader"></div>
    <div class="visual-list">
      {% for item in items.all %}
        {% if item.caption %}
          <textarea{{ item.captionClass|raw }}>{{ item.caption|raw }}</textarea>
        {% endif %}
        <input type="hidden" width="{{ item.width }}" height="{{ item.height }}" src="{{ item.src }}"{{ item.imageClass|raw }}>
      {% endfor %}
    </div>

    <div class="visual-image">
      {% if not items.current.caption %}
        <img width="{{ items.current.width }}" height="{{ items.current.height }}" src="{{ items.current.src }}" class="bg-element">
      {% endif %}
    </div>
    <div class="visual-caption"{{ items.current.captionStyles|raw }}>
      {% if items.current.caption %}
        <div class="caption-content">{{ items.current.caption|raw }}</div>
      {% endif %}
    </div>

    {% if showDesktopNavigation %}
      <div id="xBackgroundLeft"></div>
      <div id="xBackgroundRight"></div>
      <div id="xBackgroundLeftCounter"{% if not showSlideCounters %} class="xHidden"{% endif %}><div class="counterContent"></div></div>
      <div id="xBackgroundRightCounter"{% if not showSlideCounters %} class="xHidden"{% endif %}><div class="counterContent"></div></div>
    {% endif %}
  </div>

  {% if showMobileNavigationArrows %}
    <div id="xBackgroundPrevious"><a href="#"><span>previous</span></a></div>
    <div id="xBackgroundNext"><a href="#"><span>next</span></a></div>
  {% endif %}
</div>
`,
  'Sites/Sections/sectionFooter': `<a class="bt-back-to-top js-back-to-top" href="#">
  <svg height="5.06066" viewBox="0 0 8.7071066 5.0606604" width="8.707107" xmlns="http://www.w3.org/2000/svg"><path d="m8.3535534 4.7071068-4-4.00000002-4.00000001 4.00000002" fill="none" stroke="#fff"/></svg>
</a>

{% if not isEditMode %}
	<div class="pswp theme-{{ photoswipeTheme }}" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="pswp__bg"></div>
		<div class="pswp__scroll-wrap">
			<div class="pswp__container">
				<div class="pswp__item"></div>
				<div class="pswp__item"></div>
				<div class="pswp__item"></div>
			</div>
			<div class="pswp__ui pswp__ui--hidden">
				<div class="pswp__top-bar">
					<div class="pswp__counter"></div>
					<button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
					<button class="pswp__button pswp__button--share" title="Share"></button>
					<button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
					<button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
					<div class="pswp__preloader">
						<div class="pswp__preloader__icn">
							<div class="pswp__preloader__cut">
								<div class="pswp__preloader__donut"></div>
							</div>
						</div>
					</div>
				</div>

				<div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
					<div class="pswp__share-tooltip"></div>
				</div>

				<button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>
				<button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>

				<div class="pswp__caption">
					<div class="pswp__caption__center align-{{ photoswipeCaptionAlign }}"></div>
				</div>
			</div>
		</div>
	</div>
{% endif %}

{% if intercom %}
  <script>
    window.intercomSettings = {
      app_id: '{{ intercom.appId }}',
      email: '{{ intercom.userName }}',
      user_hash: '{{ intercom.userHash }}'
    };
  </script>
  <script>
    (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/{{ intercom.appId }}';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})()
  </script>
{% endif %}

{{ customSocialMediaButtonsJs|raw }}
{{ customUserJs|raw }}
`,
  'Sites/Sections/sectionHead': `<head>
  <meta charset="UTF-8">
  {% if isResponsive or isAutoResponsive %}
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  {% endif %}
  <meta name="description" content="{{ description }}">
  <meta name="author" content="{{ author }}">
  <meta property="og:site_name" content="{{ author }}">
  <meta property="og:title" content="{{ title }}">
  <meta property="og:description" content="{{ description }}">
  <meta property="og:url" content="{{ requestUrl }}">
  {% if noindex %}
    <meta name="robots" content="noindex, nofollow">
  {% endif %}
  {{ googleSiteVerificationTag|raw }}
  <title>{{ title }}</title>
  <script type="application/ld+json">
    {
      "@context" : "https://schema.org",
      "@type" : "WebSite",
      "name" : "{{ author }}",
      "url" : "{{ baseUrl }}"
    }
  </script>
  {% for favicon in favicons %}
    <link{{ favicon|raw }}>
  {% endfor %}
  {% if styles.googleWebFonts %}
    <link href="//fonts.googleapis.com/css?family={{ styles.googleWebFonts }}&amp;subset=latin,latin-ext,cyrillic-ext,greek-ext,greek,vietnamese,cyrillic" rel="stylesheet">
  {% endif %}
  {% for cssFile in styles.cssFiles %}
    <link rel="stylesheet" href="{{ cssFile }}">
  {% endfor %}
  {% if styles.inlineCSS %}
    <style>
      {{ styles.inlineCSS|raw }}
    </style>
  {% endif %}
  {% if styles.customCSS %}
    <style>
      {{ styles.customCSS|raw }}
    </style>
  {% endif %}
  {% if googleAnalyticsId %}
    <script async src="https://www.googletagmanager.com/gtag/js?id={{ googleAnalyticsId }}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', '{{ googleAnalyticsId }}');
    </script>
  {% endif %}
  {% if googleTagManagerContainerId %}
    <script>
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','{{ googleTagManagerContainerId }}');
    </script>
  {% endif %}
  {{ scripts.sentryScript|raw }}
  <script>
    var bertaGlobalOptions = {{ scripts.bertaGlobalOptions|raw }};
  </script>
  {% for scriptFile in scripts.scriptFiles %}
    <script src="{{ scriptFile }}"></script>
  {% endfor %}
</head>
`,
  'Sites/Sections/sectionsMenu': `<nav class="bt-sections-menu">
	<a href="#" id="menuToggle">
		<span></span>
	</a>
	<ul>
		{% for section in sections %}
			<li{{ section.attributes|raw }}>
				<a{{ section.linkAttributes|raw }}>{{ section.title }}</a>
				{% if section.tags %}
					<ul{{ section.submenuAttributes|raw }}>
						{% for tag in section.tags %}
							<li{{ tag.attributes|raw }}>
								<a{{ tag.linkAttributes|raw }}>{{ tag.title }}</a>
							</li>
						{% endfor %}
					</ul>
				{% endif %}
			</li>
		{% endfor %}
	</ul>

	{% if submenu.tags %}
		<ul{{ submenu.submenuAttributes|raw }}>
			{% for tag in submenu.tags %}
				<li{{ tag.attributes|raw }}>
					<a{{ tag.linkAttributes|raw }}>{{ tag.title }}</a>
				</li>
			{% endfor %}
		</ul>
	{% endif %}
</nav>
`,
  'Sites/Sections/sitemap': `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
	{% for url in urls %}
		<url>
			<loc>{{ url }}</loc>
		</url>
	{% endfor %}
</urlset>
`,
  'Sites/Sections/whiteTemplate': `<!DOCTYPE html>
<!--[if lt IE 7 ]> <html class="ie6 ie-old"> <![endif]-->
<!--[if IE 7 ]>    <html class="ie7 ie-old"> <![endif]-->
<!--[if IE 8 ]>    <html class="ie8"> <![endif]-->
<!--[if IE 9 ]>    <html class="ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html id="html"> <!--<![endif]-->
  {{ sectionHead|raw }}
  <body class="{{ bodyClasses }}" id="body">
    {{ googleTagManagerNoscript|raw }}
    <div id="allContainer"{% if isCenteredPageLayout %} class="xCentered"{% endif %}>
      <div id="sideColumn"{{ sideColumnAttributes|raw }}>
        <div id="sideColumnTop">
          <div id="sitesMenu">
            {{ sitesMenu|raw }}
          </div>
          <div id="siteHeader">
            {{ siteHeader|raw }}
          </div>
          <div id="additionalTextBlock">
            {{ additionalTextBlock|raw }}
          </div>
          <div id="sectionsMenu">
            {{ sectionsMenu|raw }}
          </div>
        </div>
        <div id="sideColumnBottom">
          <div id="socialMediaLinks">
            {{ socialMediaLinks|raw }}
          </div>
          <p id="userCopyright"{{ userCopyright.attributes|raw }}>
            {{ userCopyright.content|raw }}
          </p>
          {% if bertaCopyright %}
            <p id="bertaCopyright">{{ bertaCopyright|raw }}</p>
          {% endif %}
        </div>
      </div>
      <div id="contentContainer"{% if isResponsive %} class="xResponsive"{% endif %}>
        <div id="mainColumn"{{ mainColumnAttributes|raw }}>
          <ol id="pageEntries"{{ pageEntriesAttributes|raw }}>
            {{ entries|raw }}
          </ol>
          <br class="clear" />
          <div id="portfolioThumbnails">
            {{ portfolioThumbnails|raw }}
          </div>
        </div>
      </div>
      <div class="floating-banners" id="siteBanners">
        {{ siteBanners|raw }}
      </div>
    </div>
    <div id="sectionFooter">
      {{ sectionFooter|raw }}
    </div>
  </body>
</html>
`,
  'Sites/sitesBanners': `{% for banner in banners %}
	<div{{ banner.attributes|raw }}>
		{% if not isResponsive and isEditMode %}
			<div class="xHandle"></div>
		{% endif %}

    {% if banner.link %}
      <a href="{{ banner.link }}" target="_blank"><img{{ banner.imageAttributes|raw }}></a>
    {% else %}
      <img{{ banner.imageAttributes|raw }}>
    {% endif %}
	</div>
{% endfor %}
`,
  'Sites/sitesHeader': `<h1{{ headingAttributes|raw }}>
  {% if headingImageAttributes %}
    <a href="{{ link }}"><img{{ headingImageAttributes|raw }}></a>
  {% else %}
    {% if isEditMode %}
      <span{{ editableAttributes|raw }}>
        {% if title %}{{ title|raw }}{% else %}<span class="xEmpty">&nbsp;heading&nbsp;</span>{% endif %}
      </span>
    {% else %}
      <a href="{{ link }}">{{ title|raw }}</a>
    {% endif %}
  {% endif %}
</h1>
`,
  'Sites/sitesMenu': `<ul id="multisites"{{ attributes|raw }}>
  {% for site in sites %}
      <li{% if site.className %} class="{{ site.className }}"{% endif %}>
        <a href="{{ site.link }}">
          {{ site.name }}
        </a>
      </li>
  {% endfor %}
</ul>
`,
  'Sites/socialMediaLinks': `{% for link in socialMediaLinks %}
  <a href="{{ link.url }}" target="_blank" class="social-icon">{{ link.icon|raw }}</a>
{% endfor %}
`
};
