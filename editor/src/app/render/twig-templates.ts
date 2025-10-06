// Auto-generated file - do not edit manually

export const TWIG_TEMPLATES: Record<string, string> = {
  'Shop/shoppingCart': `<div id="shoppingCartOuter">
  <div id="shoppingCartEmpty"{% if not isEditMode %} class="hidden"{% endif %}>
    <div{{ emptyCart.attributes|raw }}>
        {{ emptyCart.content }}
    </div>
  </div>

  <div id="shoppingCartTitle">{{ cartTitle }}</div>

  <div id="shoppingCartExpired"{% if not isEditMode %} class="hidden"{% endif %}>
    <div{{ expiredCart.attributes|raw }}>
        {{ expiredCart.content }}
    </div>
  </div>

  <div id="shoppingCartContents">
    <div class="row thead">
      <div class="column column-half padded title">
        {% if isEditMode %}
          <div{{ tableHeadTitle.attributes|raw }}>
            {{ tableHeadTitle.content }}
          </div>
        {% else %}
            {{ tableHeadTitle.content }}
        {% endif %}
      </div>

      <div class="column column-half properties">
        <div class="row">
          <div class="column column-half padded qty">
            {% if isEditMode %}
              <div{{ tableHeadQuantity.attributes|raw }}>
                {{ tableHeadQuantity.content }}
              </div>
            {% else %}
                {{ tableHeadQuantity.content }}
            {% endif %}
          </div>
          <div class="column column-fourth padded price">
            {% if isEditMode %}
              <div{{ tableHeadPrice.attributes|raw }}>
                {{ tableHeadPrice.content }}
              </div>
            {% else %}
                {{ tableHeadPrice.content }}
            {% endif %}
          </div>
          <div class="column column-fourth padded sum">
            {% if isEditMode %}
              <div{{ tableHeadSum.attributes|raw }}>
                {{ tableHeadSum.content }}
              </div>
            {% else %}
                {{ tableHeadSum.content }}
            {% endif %}
            ({{ currency }})
          </div>
        </div>
      </div>
    </div>

    <div class="tbody prodList">
      <div class="row prodline">
        <div class="column column-half padded title"><span></span> <div class="image hidden"></div></div>
        <div class="column column-half">
          <div class="row">
            <div class="column column-half padded qty"><span></span> <span class="adremovecart"><a href="#" class="add">+</a> <a href="#" class="remove">-</a></span></div>
            <div class="column column-fourth padded price"></div>
            <div class="column column-fourth padded sum"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="row tbody shipping">
      <div class="column column-half padded promo">
        {% if discountAvailable %}
          <div id="promoCodeEntry">
            {% if isEditMode %}
              <div{{ promoCode.attributes|raw }}>
                {{ promoCode.content }}
              </div>
            {% else %}
                {{ promoCode.content }}
            {% endif %}
            <span class="pull-right">
              <input type="text" name="promo_code" id="promo_code" />
              {% if isEditMode %}
                <div{{ promoButton.attributes|raw }}>
                  {{ promoButton.content }}
                </div>
              {% else %}
                  <input type="button" value="{{ promoButton.content }}" />
              {% endif %}
            </span>
          </div>
        {% endif %}
      </div>

      <div class="column column-half padded">
        <div class="padded-left">
          <div{{ shippingTo.attributes|raw }}>
            {{ shippingTo.content }}
          </div>

          <select id="shipping_select" class="pull-right">
            {% for region in shippingRegions %}
              <option value="{{ region.id }}">{{ region.name }}</option>
            {% endfor %}
          </select>
        </div>
      </div>
    </div>

    <div class="row tbody">
      <div class="column padded-left column-half pull-right">
        <div class="padded shippingTotal">
          <input type="hidden" name="total_weight" id="total_weight" value="" />
          <span{{ shippingTotal.attributes|raw }}>
            {{ shippingTotal.content }}
          </span>
          <div class="total pull-right">{{ currency }} <span id="shippingTotalSum"></span></div>
        </div>
      </div>
    </div>

    <div class="row tbody discount{% if not isEditMode %} hidden{% endif %}">
      <div class="column column-half padded-left pull-right">
        <div class="padded shoppingCartDiscount">
          <input type="hidden" id="discount_precents" value="" />
          <input type="hidden" id="discount_applied" value="0" />
          {% if isEditMode %}
            <div{{ discount.attributes|raw }}>
              {{ discount.content }}
            </div>
          {% else %}
              {{ discount.content }}
          {% endif %}
          <span class="pull-right sumDiscount"></span>
        </div>
      </div>
    </div>

    <div class="row tbody total">
      <div class="column column-half padded-left pull-right">
        <div class="padded shoppingCartTotal">
          {% if isEditMode %}
            <div{{ total.attributes|raw }}>
              {{ total.content }}
            </div>
          {% else %}
              {{ total.content }}
          {% endif %}

          {% if isEditMode %}
            <div{{ includedVat.attributes|raw }}>
              {{ includedVat.content }}
            </div>
          {% endif %}
          <div class="vatprice hidden">{{ includedVat.content }} (<span></span>%)</div>
          <div class="pull-right total">{{ currency }} <span class="sumTotal"></span></div>
        </div>
      </div>
    </div>
  </div>

  <div class="row" id="cartBottomPart">
    <div class="column column-half" id="cartFromleftPart">
      <div class="padded-right">
        <input type="hidden" name="cartemail" value="{{ config.email }}" id="cartemail">
        <div class="cc-fields" id="billing_address_form">
          <h2{{ billingAddress.attributes|raw }}>
            {{ billingAddress.content }}
          </h2>

          <div class="padded">
            <p class="checkbox">
              {% if isEditMode %}
                <div{{ legalPerson.attributes|raw }}>
                  {{ legalPerson.content }}
                </div>
              {% else %}
                <input type="checkbox" id="cartTextLegalPerson" value="1" /> <label for="cartTextLegalPerson" class="auto-width"> {{ legalPerson.content }}</label>
              {% endif %}
            </p>

            <p class="xLegalPerson{% if not isEditMode %} hidden{% endif %}">
              <label for="cartTextCompany">
                {% if isEditMode %}
                  <div{{ company.attributes|raw }}>
                    {{ company.content }}
                  </div>
                {% else %}
                    {{ company.content }}
                {% endif %}
              </label>
              {% if not isEditMode %}
                <input class="iText" type="text" name="cartTextCompany" id="cartTextCompany">
              {% endif %}
            </p>

            <p class="xLegalPerson{% if not isEditMode %} hidden{% endif %}">
              <label for="cartTextCompanyRegNo">
                {% if isEditMode %}
                  <div{{ companyRegistrationNumber.attributes|raw }}>
                    {{ companyRegistrationNumber.content }}
                  </div>
                {% else %}
                    {{ companyRegistrationNumber.content }}
                {% endif %}
              </label>
              {% if not isEditMode %}
                <input class="iText" type="text" name="cartTextCompanyRegNo" id="cartTextCompanyRegNo">
              {% endif %}
            </p>

            <p class="xLegalPerson{% if not isEditMode %} hidden{% endif %}">
              <label for="cartTextLegalAddress">
                {% if isEditMode %}
                  <div{{ legalAddress.attributes|raw }}>
                    {{ legalAddress.content }}
                  </div>
                {% else %}
                    {{ legalAddress.content }}
                {% endif %}
              </label>
              {% if not isEditMode %}
                <input class="iText" type="text" name="cartTextLegalAddress" id="cartTextLegalAddress">
              {% endif %}
            </p>

            <p>
              <label for="nname">
                {% if isEditMode %}
                  <div{{ nameSurname.attributes|raw }}>
                    {{ nameSurname.content }}
                  </div>
                {% else %}
                    {{ nameSurname.content }}
                {% endif %}
              </label>
              {% if not isEditMode %}
                <input class="iText" type="text" name="nname" id="nname">
              {% endif %}
            </p>

            <p>
              <label for="address">
                {% if isEditMode %}
                  <div{{ address.attributes|raw }}>
                    {{ address.content }}
                  </div>
                {% else %}
                    {{ address.content }}
                {% endif %}
              </label>
              {% if not isEditMode %}
                <input class="iText" type="text" name="address" id="address">
              {% endif %}
            </p>

            <p>
              <label for="phone">
                {% if isEditMode %}
                  <div{{ phone.attributes|raw }}>
                    {{ phone.content }}
                  </div>
                {% else %}
                    {{ phone.content }}
                {% endif %}
              </label>
              {% if not isEditMode %}
                <input class="iText" type="text" name="phone" id="phone">
              {% endif %}
            </p>

            <p>
              <label for="email-reg">
                {% if isEditMode %}
                  <div{{ email.attributes|raw }}>
                    {{ email.content }}
                  </div>
                {% else %}
                    {{ email.content }}
                {% endif %}
              </label>
              {% if not isEditMode %}
                <input class="iText" type="text" name="email" id="email-reg">
              {% endif %}
            </p>

            <p>
              <label for="notes">
                {% if isEditMode %}
                  <div{{ comments.attributes|raw }}>
                    {{ comments.content }}
                  </div>
                {% else %}
                    {{ comments.content }}
                {% endif %}
              </label>
              {% if not isEditMode %}
                <textarea rows="3" cols="5" name="notes" id="notes"></textarea>
              {% endif %}
            </p>

            {% if isEditMode %}
              <div{{ deliverToBillingAddress.attributes|raw }}>
                {{ deliverToBillingAddress.content }}
              </div>
            {% else %}
              <p class="no-margin-bottom">
                <input type="checkbox" id="deliver_billing_addr" checked="checked" /> <label for="deliver_billing_addr" class="auto-width">{{ deliverToBillingAddress.content }}</label>
              </p>
            {% endif %}
          </div>
        </div>

        <div class="cc-fields{% if not isEditMode %} hidden{% endif %}" id="shipping_address_form">
          <h2{{ shippingAddressHeader.attributes|raw }}>
            {{ shippingAddressHeader.content }}
          </h2>

          <div class="padded">
            <p>
              <label for="ship_nname">
                {% if isEditMode %}
                  <div{{ nameSurname.attributes|raw }}>
                    {{ nameSurname.content }}
                  </div>
                {% else %}
                    {{ nameSurname.content }}
                {% endif %}
              </label>
              {% if not isEditMode %}
                <input class="iText" type="text" name="ship_nname" id="ship_nname">
              {% endif %}
            </p>

            <p>
              <label for="ship_address">
                {% if isEditMode %}
                  <div{{ address.attributes|raw }}>
                    {{ address.content }}
                  </div>
                {% else %}
                    {{ address.content }}
                {% endif %}
              </label>
              {% if not isEditMode %}
                <input class="iText" type="text" name="ship_address" id="ship_address">
              {% endif %}
            </p>

            <p>
              <label for="ship_phone">
                {% if isEditMode %}
                  <div{{ phone.attributes|raw }}>
                    {{ phone.content }}
                  </div>
                {% else %}
                    {{ phone.content }}
                {% endif %}
              </label>
              {% if not isEditMode %}
                <input class="iText" type="text" name="ship_phone" id="ship_phone">
              {% endif %}
            </p>

            <p>
              <label for="ship_email-reg">
                {% if isEditMode %}
                  <div{{ email.attributes|raw }}>
                    {{ email.content }}
                  </div>
                {% else %}
                    {{ email.content }}
                {% endif %}
              </label>
              {% if not isEditMode %}
                <input class="iText" type="text" name="ship_email" id="ship_email-reg">
              {% endif %}
            </p>

            <p>
              <label for="ship_notes">
                {% if isEditMode %}
                  <div{{ comments.attributes|raw }}>
                    {{ comments.content }}
                  </div>
                {% else %}
                    {{ comments.content }}
                {% endif %}
              </label>
              {% if not isEditMode %}
                <textarea rows="3" cols="5" name="ship_notes" id="ship_notes"></textarea>
              {% endif %}
            </p>
          </div>
        </div>

        {% if isEditMode %}
          <div class="padded">
            <div{{ receiveNews.attributes|raw }}>
              {{ receiveNews.content }}
            </div>
          </div>
        {% elseif receiveNews.content %}
          <div class="padded padded-top-bottom-off">
            <input type="checkbox" id="receive_news_updates" />&nbsp;<label for="receive_news_updates">{{ receiveNews.content }}</label>
          </div>
        {% endif %}
      </div>
    </div>

    <div class="column column-half">
      <div id="cartFromrightPart" class="padded-left">
        <h2{{ paymentHeader.attributes|raw }}>
          {{ paymentHeader.content }}
        </h2>

        <div class="padded choosePaymentMethod">

          {% if isEditMode or paymentDescription.content %}
            <p{{ paymentDescription.attributes|raw }}>
              {{ paymentDescription.content }}
            </p>
          {% endif %}

          <input type="hidden" name="payment_method" id="payment_method" value="{{ config.paymentMethod }}" />

          {% if isPaypalAvailable %}
            <div class="choosePaymentRadio">
              <label for="pm_creditcard"><input type="radio" name="pm" id="pm_creditcard" checked="checked" />
              <img src="/_plugin_shop/images/creditcard.png" alt="Credit card" /></label>
            </div>
            <div class="choosePaymentRadio">
              <label for="pm_paypal"><input type="radio" name="pm" id="pm_paypal" />
              <img src="/_plugin_shop/images/paypal.png" alt="Paypal" /></label>
            </div>
          {% endif %}

          {% if isManualTransferAvailable %}
            <div class="choosePaymentRadio">
              <label for="pm_bank_transfer"><input type="radio" name="pm" id="pm_bank_transfer"{% if config.paymentMethod == 'bank' %} checked="checked"{% endif %}>
                {% if isEditMode %}
                  <div{{ manualTransfer.attributes|raw }}>
                    {{ manualTransfer.content }}
                  </div>
                {% else %}
                    {{ manualTransfer.content }}
                {% endif %}
              </label>
            </div>
          {% endif %}
        </div>

        <div class="padded checkOut">
          {% if isEditMode or checkoutDescription.content %}
            <p{{ checkoutDescription.attributes|raw }}>
              {{ checkoutDescription.content }}
            </p>
          {% endif %}

          <p class="text-right checkoutSumTotal">{{ totalLabel }} {{ currency }} <span class="sumTotal"></span></p>

          {% if isEditMode %}
            {% if config.termsLink %}
              <div{{ terms.attributes|raw }}>
                {{ terms.content }}
              </div>
            {% endif %}

            <div{{ fillRequiredFields.attributes|raw }}>
              {{ fillRequiredFields.content }}
            </div>

            <div{{ checkoutButton.attributes|raw }}>
              {{ checkoutButton.content }}
            </div>

            <div{{ returnToStore.attributes|raw }}>
              {{ returnToStore.content }}
            </div>

          {% else %}
            {% if config.termsLink %}
              <p class="text-right"><a href="{{ config.termsLink }}" class="cartTextTerms" target="_blank">{{ terms.content }}</a></p>
            {% endif %}

            <p class="text-right no-margin" id="required-fields-error">{{ fillRequiredFields.content }}</p>

            <p class="text-right"><a href="#" id="checkoutSubmit">{{ checkoutButton.content }}</a></p>

            <p class="text-right no-margin"><a href="javascript:;" onclick="milkbox.closeMilkbox();">{{ returnToStore.content }}</a></p>
          {% endif %}

          <form id="paypalCheckoutForm" method="post">
            <input type="hidden" name="charset" value="utf-8" />
            <input type="hidden" name="cmd" value="_cart" />
            <input type="hidden" name="upload" value="1" />
            <input type="hidden" name="business" value="" />
            <input type="hidden" name="currency_code" value="" />
            <input type="hidden" name="no_shipping" value="2" />
            <input type="hidden" name="return" value="{{ returnUrl }}" />
          </form>
          <div id="shoppingCart" class="hidden"></div>
        </div>
      </div>
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
      <div class="swiper-container">
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
  <div class="entryText xEditableMCE xProperty-description"{{ attributes.description|raw }}>{{ content.description|raw }}</div>
{% endif %}

{% if galleryPosition == 'below description' %}
  {{ gallery|raw }}
{% endif %}

{% if showUrl %}
  <div class="entryContent">
    {% if isEditMode %}
      <div class="xEditable xProperty-url"{{ attributes.url|raw }}>{{ content.url }}</div>
    {% else %}
      <div class="xEditable xProperty-url"><a href="{{ content.url }}" target="_blank">{{ content.url }}</a></div>
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
      <div title="{{ tagList }}" class="xEditableRC xNoHTMLEntities xProperty-submenu xFormatModifier-toTags xSkipSetStyles-1" data-path="{{apiPath}}tags/tag">{{ tagList }}</div>
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
          <a><div class="xEntryCheck"><label><span class="xEditableRealCheck xProperty-fixed" data-path="{{apiPath}}content/fixed">{{ entryFixed }}</span>Fixed position</label></div></a>
        </li>
        <li>
          <div class="customWidth">
            <div title="{{ entryWidth }}" class="xEditableRC xCSSUnits-1 xSkipSetStyles-1 xProperty-width" data-path="{{apiPath}}content/width">{{ entryWidth }}</div>
          </div>
        </li>
      {% endif %}
      <li>
        <a><div class="xEntryCheck"><label><span class="xEditableRealCheck xProperty-marked" data-path="{{apiPath}}marked">{{ entryMarked }}</span>Marked</label></div></a>
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
  'Sites/Sections/Entries/_entryTitle': `<h2><span class="xEditable xProperty-title xCaption-entry&nbsp;title"{{ attributes.title|raw }}>{{ content.title }}</span></h2>
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
    <div class="cartPrice xEditableRC xProperty-cartPrice xCaption-price xFormatModifier-toPrice" title="{{ content.cartPrice }}"{{ attributes.cartPrice|raw }}>{{ cartPriceFormatted }}</div>
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
  <span class="aele{% if not content.cartPrice or not isEditMode %} hidden{% endif %}"><span>{{ addToBasketLabel }}</span></span>
  <span class="addedToCart hidden"><span></span> {{ addedToBasketText }}</span>
  <span class="outOfStock hidden">{{ outOfStockText }}</span>
</div>
`,
  'Sites/Sections/Entries/shop/_cartTitle': `<h2><span class="xEditable xProperty-cartTitle xCaption-item-name cCartTitle"{{ attributes.cartTitle|raw }}>{{ content.cartTitle }}</span></h2>
`,
  'Sites/Sections/Entries/shop/_productAttributesEditor': `<div class="xEntrySeperator"></div>
<div class="xEntryBoxParams">
  <b>Attribute</b>
  <div class="xEditable xProperty-cartAttributes xCaption-attribute cCartAttributes xSkipSetStyles-1" data-path="{{apiPath}}content/cartAttributes">{{ cartAttributesEdit }}</div>
  <div class="xEditable xProperty-weight xCaption-weight xUnits-{{ weightUnits }} xSkipSetStyles-1" data-path="{{apiPath}}content/weight">{{ entryWeight }}</div>
</div>
`,
  'Sites/Sections/additionalFooterText': `<div{{ attributes|raw }}>
  {{ content|raw }}
</div>
`,
  'Sites/Sections/additionalText': `<div{{ wrapperAttributes|raw }}>
  {% if isEditMode %}
    <div class="xHandle"></div>
  {% endif %}
  {% if content.attributes %}
    <div{{ content.attributes|raw }}>
  {% endif %}
    {{ content.html|raw }}
  {% if content.attributes %}
    </div>
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
    {% if alertMessage %}
      <script type="text/javascript">alert('{{ alertMessage }}');</script>
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
  <meta name="keywords" content="{{ keywords }}">
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
        {{ title|raw }}
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
