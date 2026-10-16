import { Injectable } from '@angular/core';
import { TwigTemplateRenderService } from '../../render/twig-template-render.service';

@Injectable({
  providedIn: 'root',
})
export class SectionHeadRenderService {
  constructor(private twigTemplateRenderService: TwigTemplateRenderService) {}

  getViewData(
    appState,
    siteSlug,
    currentSection,
    currentSectionType,
    siteSettings,
    templateName,
    siteTemplateSettings,
    siteTemplateSectionTypes,
    isShopAvailable,
    shopSettings,
    isResponsive,
    isAutoResponsive,
    user,
    siteTemplateConfig,
    shopSettingsConfig,
  ) {
    // skip some template variables, no need for them in editor
    // title
    // description
    // author
    // noindex
    // favicon

    const googleSiteVerificationTag = user.features.includes(
      'custom_javascript',
    )
      ? siteSettings.settings.googleSiteVerification
      : null;

    return {
      isResponsive: isResponsive,
      isAutoResponsive: isAutoResponsive,
      googleSiteVerificationTag: googleSiteVerificationTag,
      googleAnalyticsId: siteSettings.settings.googleAnalyticsId,
      googleTagManagerContainerId:
        siteSettings.settings.googleTagManagerContainerId,
      styles: this.getStyles(
        appState,
        siteSlug,
        siteSettings,
        currentSection,
        siteTemplateSettings,
        siteTemplateSectionTypes,
        templateName,
        currentSectionType,
        isShopAvailable,
        shopSettings,
        isResponsive,
        isAutoResponsive,
        siteTemplateConfig,
        shopSettingsConfig,
      ),
      scripts: this.getScripts(
        appState,
        siteSlug,
        siteSettings,
        currentSection,
        templateName,
        isShopAvailable,
      ),
    };
  }

  getStyles(
    appState,
    siteSlug,
    siteSettings,
    currentSection,
    siteTemplateSettings,
    siteTemplateSectionTypes,
    templateName,
    currentSectionType,
    isShopAvailable,
    shopSettings,
    isResponsive,
    isAutoResponsive,
    siteTemplateConfig,
    shopSettingsConfig,
  ) {
    let googleWebFonts = [];
    let templateSettings = siteTemplateSettings;

    if (isShopAvailable) {
      templateSettings = { ...templateSettings, ...shopSettings };
    }

    Object.keys(templateSettings).map((groupSlug) => {
      Object.keys(templateSettings[groupSlug]).map((setting) => {
        if (
          setting.endsWith('googleFont') &&
          templateSettings[groupSlug][setting]
        ) {
          googleWebFonts.push(templateSettings[groupSlug][setting]);
        }
      });
    });

    const uniqueGoogleWebFonts = googleWebFonts.filter(
      (v, i, a) => a.indexOf(v) === i,
    );

    const cacheBoost = Date.now();
    let queryParams = '&engine=1';

    if (currentSectionType == 'portfolio') {
      queryParams += '&responsive=1';
    }

    if (siteSlug) {
      queryParams += `&site=${siteSlug}`;
    }

    let cssFiles = [
      `/engine/css/backend.min.css?${appState.version}`,
      `/engine/css/editor.css.php?${cacheBoost}`,
      `/_templates/${siteSettings.template.template}/editor.css.php?${cacheBoost}`,
      `/_templates/${siteSettings.template.template}/style.css?${appState.version}`,
      `/_templates/${siteSettings.template.template}/style.css.php?${cacheBoost}&${appState.version}${queryParams}`,
    ];

    let inlineCSS = '';

    if (templateName === 'messy') {
      if (isShopAvailable) {
        cssFiles.push(`/_plugin_shop/css/shop.css?${appState.version}`);
      }

      if (isResponsive || isAutoResponsive) {
        if (isAutoResponsive) {
          inlineCSS += '@media (max-width: 767px) {';
        }

        const entryPadding =
          currentSection && currentSection.entryPadding
            ? currentSection.entryPadding
            : siteTemplateSectionTypes.default.entryPadding;
        const entryMaxWidth =
          currentSection && currentSection.entryMaxWidth
            ? currentSection.entryMaxWidth
            : '';

        inlineCSS += `
                  #pageEntries .xEntry {
                      padding: ${entryPadding};
                      ${entryMaxWidth ? `max-width: ${entryMaxWidth}` : ''}
                  }
              `;

        if (isAutoResponsive) {
          inlineCSS += '}';
        }
      }

      if (isShopAvailable) {
        inlineCSS += this.getShopCSS(
          this.withDefaults(
            templateSettings.group_price_item,
            shopSettingsConfig.group_price_item,
          ),
          this.withDefaults(
            siteTemplateSettings.entryHeading,
            siteTemplateConfig?.entryHeading,
          ),
          siteTemplateSettings.pageLayout,
        );
      }
    }

    return {
      googleWebFonts: uniqueGoogleWebFonts.join('|'),
      cssFiles: cssFiles,
      inlineCSS: inlineCSS,
      customCSS: siteTemplateSettings.css.customCSS,
    };
  }

  /**
   * The shop's styles that depend on the site's settings, following the static `shop.css`
   */
  getShopCSS(priceItem = {}, entryHeading = {}, pageLayout = {}) {
    const isResponsive = pageLayout['responsive'] === 'yes';
    const isCentered = pageLayout['centeredContents'] === 'yes';

    let css = this.getCSSRule('#pageEntries .cartPrice', {
      color: priceItem['priceItemFontcolor'],
      'font-family': this.getFontFamily(
        priceItem['priceItemgoogleFont'],
        priceItem['priceItemfontFamily'],
      ),
      'font-size': priceItem['priceItemfontSize'],
      'font-weight': priceItem['priceItemfontWeight'],
      'font-style': priceItem['priceItemfontStyle'],
      'font-variant': priceItem['priceItemfontVariant'],
      'line-height': priceItem['priceItemlineHeight'],
    });
    css += this.getCSSRule('#shoppingCartTitle, #shoppingCartEmpty', {
      'font-family': this.getFontFamily(
        entryHeading['googleFont'],
        entryHeading['fontFamily'],
      ),
      'font-weight': entryHeading['fontWeight'],
      'font-style': entryHeading['fontStyle'],
      'font-variant': entryHeading['fontVariant'],
    });

    if (isResponsive) {
      css +=
        '#shoppingCart { position: relative; float: right; right: inherit; margin: 0 10px 10px 10px; }';

      if (isCentered) {
        css += '#shoppingCart { margin-top: 20px; }';
        css +=
          '#pageEntries .addToCart div, #pageEntries .addToCart div.cartPrice, #pageEntries .addToCart button.addToCartButton { float: none; }';
      }
    }

    if (isCentered) {
      css += '@media (max-width: 767px) {';
      css += '.bt-auto-responsive #shoppingCart { margin-top: 20px; }';
      css +=
        '.bt-auto-responsive #pageEntries .addToCart div, .bt-auto-responsive #pageEntries .addToCart div.cartPrice, .bt-auto-responsive #pageEntries .addToCart button.addToCartButton { float: none; }';
      css += '}';
    }

    return css;
  }

  /**
   * Settings with each empty value replaced by its default, the way the site's settings files are read
   */
  withDefaults(values = {}, settingsConfig = {}) {
    return Object.fromEntries(
      Object.entries(values).map(([slug, value]) => [
        slug,
        String(value ?? '').trim() === '' && settingsConfig[slug]
          ? settingsConfig[slug].default
          : value,
      ]),
    );
  }

  /**
   * A Google font's family name, or else the chosen font family
   */
  getFontFamily(googleFont = '', fontFamily = '') {
    return googleFont.trim() !== '' ? googleFont.split(':')[0] : fontFamily;
  }

  /**
   * A CSS rule, leaving out the empty values
   */
  getCSSRule(selector: string, declarations: { [property: string]: string }) {
    const css = Object.entries(declarations)
      .map(([property, value]) => [property, String(value ?? '').trim()])
      .filter(([, value]) => value !== '')
      .map(([property, value]) => `${property}: ${value};`);

    return css.length ? `${selector} { ${css.join(' ')} }` : '';
  }

  getScripts(
    appState,
    siteSlug,
    siteSettings,
    currentSection,
    templateName,
    isShopAvailable,
  ) {
    const bertaGlobalOptions = {
      templateName: templateName,
      environment: 'engine',
      backToTopEnabled: siteSettings.navigation.backToTopEnabled,
      slideshowAutoRewind: siteSettings.entryLayout.gallerySlideshowAutoRewind,
      sectionType:
        currentSection &&
        currentSection['@attributes'] &&
        currentSection['@attributes'].type
          ? currentSection['@attributes'].type
          : 'default',
      gridStep: siteSettings.pageLayout.gridStep,
      galleryFullScreenBackground:
        siteSettings.entryLayout.galleryFullScreenBackground,
      galleryFullScreenImageNumbers:
        siteSettings.entryLayout.galleryFullScreenImageNumbers,
      paths: {
        engineRoot: '/engine/',
        engineABSRoot: '/engine/',
        siteABSMainRoot: '/',
        siteABSRoot: `/${siteSlug ? `${siteSlug}/` : ''}`,
        template: `/_templates/${siteSettings.template.template}/`,
        site: siteSlug,
      },
      // @todo: load current language translation here, we don't have all translations in state
      i18n: {
        'create new entry here': 'create new entry here',
        'create new entry': 'create new entry',
      },
    };

    let scriptFiles = [
      `/engine/js/backend.min.js?${appState.version}`,
      `/engine/js/ng-backend.min.js?${appState.version}`,
    ];

    if (templateName === 'messy') {
      scriptFiles.push(
        `/_templates/${siteSettings.template.template}/mess.js?${appState.version}`,
      );
      scriptFiles.push(
        `/_templates/${siteSettings.template.template}/masonry.js?${appState.version}`,
      );

      if (isShopAvailable) {
        scriptFiles.push(`/_plugin_shop/js/shop.js?${appState.version}`);
      }
    } else if (templateName !== 'default') {
      // the default template has no script, its video embeds are styled by CSS
      scriptFiles.push(
        `/_templates/${siteSettings.template.template}/${templateName}.js?${appState.version}`,
      );
    }

    return {
      bertaGlobalOptions: JSON.stringify(bertaGlobalOptions),
      //@todo: investigate, do we really need to load sentry script
      // sentryScript: ?
      scriptFiles: scriptFiles,
    };
  }

  render(
    appState,
    siteSlug,
    currentSection,
    currentSectionType,
    siteSettings,
    templateName,
    siteTemplateSettings,
    siteTemplateSectionTypes,
    isShopAvailable,
    shopSettings,
    isResponsive,
    isAutoResponsive,
    user,
    siteTemplateConfig,
    shopSettingsConfig,
  ) {
    const viewData = this.getViewData(
      appState,
      siteSlug,
      currentSection,
      currentSectionType,
      siteSettings,
      templateName,
      siteTemplateSettings,
      siteTemplateSectionTypes,
      isShopAvailable,
      shopSettings,
      isResponsive,
      isAutoResponsive,
      user,
      siteTemplateConfig,
      shopSettingsConfig,
    );

    try {
      return this.twigTemplateRenderService.render(
        'Sites/Sections/sectionHead',
        viewData,
      );
    } catch (error) {
      console.error('Failed to render template:', error);
      return '';
    }
  }
}
