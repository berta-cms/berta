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
  ) {
    // skip some template variables, no need for them in editor
    // title
    // keywords
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
        cssFiles.push(
          `/_plugin_shop/css/shop.css.php?${cacheBoost}${
            siteSlug ? `&site=${siteSlug}` : ''
          }`,
        );
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
    }

    return {
      googleWebFonts: uniqueGoogleWebFonts.join('|'),
      cssFiles: cssFiles,
      inlineCSS: inlineCSS,
      customCSS: siteTemplateSettings.css.customCSS,
    };
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
        `/_templates/${siteSettings.template.template}/mooMasonry.js?${appState.version}`,
      );

      if (isShopAvailable) {
        scriptFiles.push(`/_plugin_shop/js/shop.js?${appState.version}`);
      }
    } else {
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
