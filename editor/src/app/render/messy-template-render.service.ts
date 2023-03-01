import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { TemplateRenderService } from './template-render.service';
import * as Template from '../../templates/Sites/Sections/messyTemplate.twig';
import { SectionRenderService } from '../sites/sections/section-render.service';
import { SectionHeadRenderService } from '../sites/sections/section-head-render.service';
import { SitesMenuRenderService } from '../sites/sites-menu-render.service';
import { SitesHeaderRenderService } from '../sites/sites-header-render.service';
import { AdditionalTextRenderService } from '../sites/sections/additional-text-render.service';
import { SectionsMenuRenderService } from '../sites/sections/sections-menu-render.service';
import { SectionTagsService } from '../sites/sections/tags/section-tags.service';
import { SitesBannersRenderService } from '../sites/sites-banners-render.service';
import { SectionFooterRenderService } from '../sites/sections/section-footer-render.service';
import { SectionEntriesService } from '../sites/sections/entries/section-entries.service';
import { SectionEntryRenderService } from '../sites/sections/entries/section-entry-render.service';
import { PortfolioThumbnailsRenderService } from '../sites/sections/entries/portfolio-thumbnails-render.service';
import { AdditionalFooterTextRenderService } from '../sites/sections/additional-footer-text-render.service';
import { MashupEntriesRenderService } from '../sites/sections/entries/mashup-entries-render.service';
import { SiteSectionStateModel } from '../sites/sections/sections-state/site-sections-state.model';
import { getCookie, toHtmlAttributes } from '../shared/helpers';
import { GridViewRenderService } from '../sites/sections/grid-view-render.service';
import { BackgroundGalleryRenderService } from '../sites/sections/background-gallery-render.service';
import { ShopCartRenderService } from '../shop/shop-cart-render.service';

@Injectable({
  providedIn: 'root',
})
export class MessyTemplateRenderService extends TemplateRenderService {
  constructor(
    store: Store,
    sectionRenderService: SectionRenderService,
    sectionHeadRenderService: SectionHeadRenderService,
    sitesMenuRenderService: SitesMenuRenderService,
    sitesHeaderRenderService: SitesHeaderRenderService,
    additionalTextRenderService: AdditionalTextRenderService,
    sectionsMenuRenderService: SectionsMenuRenderService,
    sectionTagsService: SectionTagsService,
    sitesBannersRenderService: SitesBannersRenderService,
    sectionFooterRenderService: SectionFooterRenderService,
    sectionEntriesService: SectionEntriesService,
    sectionEntryRenderService: SectionEntryRenderService,
    portfolioThumbnailsRenderService: PortfolioThumbnailsRenderService,
    additionalFooterTextRenderService: AdditionalFooterTextRenderService,
    mashupEntriesRenderService: MashupEntriesRenderService,
    gridViewRenderService: GridViewRenderService,
    backgroundGalleryRenderService: BackgroundGalleryRenderService,
    shopCartRenderService: ShopCartRenderService
  ) {
    super(
      store,
      sectionRenderService,
      sectionHeadRenderService,
      sitesMenuRenderService,
      sitesHeaderRenderService,
      additionalTextRenderService,
      sectionsMenuRenderService,
      sectionTagsService,
      sitesBannersRenderService,
      sectionFooterRenderService,
      sectionEntriesService,
      sectionEntryRenderService,
      portfolioThumbnailsRenderService,
      additionalFooterTextRenderService,
      mashupEntriesRenderService,
      gridViewRenderService,
      backgroundGalleryRenderService,
      shopCartRenderService
    );
  }

  getBodyClasses(
    siteTemplateSettings,
    currentSection: SiteSectionStateModel,
    currentSectionType: string,
    tagSlug: string,
    isResponsive: boolean,
    isAutoResponsive: boolean
  ) {
    let classes = [
      `xContent-${currentSection.name}`,
      `xSectionType-${currentSectionType}`,
      'page-xMySite',
    ];

    if (tagSlug) {
      classes.push(`xSubmenu-${tagSlug}`);
    }

    if (siteTemplateSettings.pageLayout.centeredContents === 'yes') {
      classes.push('bt-centered-content');
    }

    if (isResponsive) {
      classes.push('bt-responsive');
    }

    if (isAutoResponsive) {
      classes.push('bt-auto-responsive');
    }

    return classes.join(' ');
  }

  getContentContainerAttributes(siteTemplateSettings, isResponsive: boolean) {
    let classes = [];

    if (siteTemplateSettings.pageLayout.centered === 'yes') {
      classes.push('xCentered');
    }

    if (isResponsive) {
      classes.push('xResponsive');
    }

    return toHtmlAttributes({
      class: classes.join(' '),
    });
  }

  getPageEntriesClasses(
    currentSection: SiteSectionStateModel,
    tagSlug: string,
    isResponsive: boolean
  ) {
    let classes = [
      'xEntriesList',
      'clearfix',
      `xSection-${currentSection.name}`,
    ];

    if (tagSlug) {
      classes.push(`xTag-${tagSlug}}`);
    }

    if (isResponsive && currentSection.columns) {
      classes.push(`columns-${currentSection.columns}}`);
    }

    if (!isResponsive) {
      classes.push('xNoEntryOrdering');
    }

    return toHtmlAttributes({
      class: classes.join(' '),
    });
  }

  getGridTrigger(
    siteSlug: string,
    currentSection: SiteSectionStateModel,
    currentSectionType: string,
    tagSlug: string
  ) {
    if (
      currentSectionType !== 'grid' ||
      !!getCookie('_berta_grid_view') ||
      !currentSection.mediaCacheData ||
      !currentSection.mediaCacheData.file ||
      currentSection.mediaCacheData.file.length < 1
    ) {
      return null;
    }

    let urlParts: string[] = [];

    if (siteSlug) {
      urlParts.push(`site=${siteSlug}`);
    }

    urlParts.push(`section=${currentSection.name}`);

    if (tagSlug) {
      urlParts.push(`tag=${tagSlug}`);
    }

    return {
      attributes: toHtmlAttributes({
        style: 'right:44px',
      }),
      // @todo fix link to trigger grid view in js after frontend render
      link: `/engine/editor/?${urlParts.join('&')}`,
    };
  }

  getBackgroundVideoEmbed(
    currentSection: SiteSectionStateModel,
    siteTemplateSectionTypes
  ) {
    return {
      content: currentSection.backgroundVideoEmbed
        ? currentSection.backgroundVideoEmbed
        : null,
      class: currentSection.backgroundVideoRatio
        ? currentSection.backgroundVideoRatio
        : siteTemplateSectionTypes.default.params.backgroundVideoRatio.default,
    };
  }

  getGridlinesAttributes(siteSettings) {
    if (
      siteSettings.pageLayout.showGrid !== 'yes' ||
      siteSettings.pageLayout.gridStep < 2
    ) {
      return null;
    }

    const gridStep = siteSettings.pageLayout.gridStep;
    const gridStepBase = gridStep * 5;
    const color =
      siteSettings.pageLayout.gridColor === 'white'
        ? '255, 255, 255'
        : '0, 0, 0';

    const styles = [
      `background-size:${gridStepBase}px ${gridStepBase}px, ${gridStepBase}px ${gridStepBase}px, ${gridStep}px ${gridStep}px, ${gridStep}px ${gridStep}px`,
      `background-image:linear-gradient(rgba(${color}, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(${color}, 0.5) 1px, transparent 0px), linear-gradient(rgba(${color}, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(${color}, 0.2) 1px, transparent 0px)`,
    ];

    return {
      style: styles.join(';'),
    };
  }

  getViewData(): { [key: string]: any } {
    const commonViewData = super.getViewData();

    if (!commonViewData.currentSection) {
      return commonViewData;
    }

    const viewData = {
      ...commonViewData,
      ...{
        // place for template specific data for view
        bodyClassList: this.getBodyClasses(
          commonViewData.siteTemplateSettings,
          commonViewData.currentSection,
          commonViewData.currentSectionType,
          commonViewData.tagSlug,
          commonViewData.isResponsive,
          commonViewData.isAutoResponsive
        ),
        isCenteredPageLayout:
          commonViewData.siteTemplateSettings.pageLayout.centered === 'yes',
        isAutoResponsive:
          commonViewData.siteTemplateSettings.pageLayout.autoResponsive ===
          'yes',
        sectionType: commonViewData.currentSectionType,
        contentContainerAttributes: this.getContentContainerAttributes(
          commonViewData.siteTemplateSettings,
          commonViewData.isResponsive
        ),
        pageEntriesClasses: this.getPageEntriesClasses(
          commonViewData.currentSection,
          commonViewData.tagSlug,
          commonViewData.isResponsive
        ),
        showBackgroundGalleryEditor: commonViewData.sections.length > 0,
        isGridViewEnabled:
          commonViewData.currentSectionType === 'grid' &&
          !!getCookie('_berta_grid_view'),
        gridTrigger: this.getGridTrigger(
          commonViewData.siteSlug,
          commonViewData.currentSection,
          commonViewData.currentSectionType,
          commonViewData.tagSlug
        ),
        gridView: this.gridViewRenderService.render(
          commonViewData.appState,
          commonViewData.siteSlug,
          commonViewData.templateName,
          commonViewData.currentSection,
          commonViewData.currentSectionType,
          commonViewData.tagSlug
        ),
        additionalFooterText: this.additionalFooterTextRenderService.render(
          commonViewData.appState,
          commonViewData.siteSlug,
          commonViewData.siteSettings,
          commonViewData.templateName,
          commonViewData.user
        ),
        alertMessage: false,
        cartSection:
          commonViewData.isShopAvailable &&
          commonViewData.currentSectionType === 'shopping_cart'
            ? this.shopCartRenderService.renderCart(
                commonViewData.siteSlug,
                commonViewData.siteSettings,
                commonViewData.templateName,
                commonViewData.currentSection,
                commonViewData.shopSettings,
                commonViewData.shippingRegions
              )
            : null,
        backgroundGallery: !(
          commonViewData.isShopAvailable &&
          commonViewData.currentSectionType == 'shopping_cart'
        )
          ? this.backgroundGalleryRenderService.render(
              commonViewData.siteSlug,
              commonViewData.templateName,
              commonViewData.currentSection,
              commonViewData.currentSectionType,
              commonViewData.isResponsive
            )
          : null,
        backgroundVideoEmbed: !(
          commonViewData.isShopAvailable &&
          commonViewData.currentSectionType == 'shopping_cart'
        )
          ? this.getBackgroundVideoEmbed(
              commonViewData.currentSection,
              commonViewData.siteTemplateSectionTypes
            )
          : null,
        gridlinesAttributes: !(
          commonViewData.isShopAvailable &&
          commonViewData.currentSectionType == 'shopping_cart'
        )
          ? this.getGridlinesAttributes(commonViewData.siteSettings)
          : null,
        shoppingCartLink: !(
          commonViewData.isShopAvailable &&
          commonViewData.currentSectionType == 'shopping_cart'
        )
          ? this.shopCartRenderService.renderCartLink(
              commonViewData.siteSlug,
              commonViewData.siteSettings,
              commonViewData.shopSettings,
              commonViewData.sections,
              commonViewData.isResponsive
            )
          : null,
      },
    };

    return viewData;
  }

  startRender(contentWindow: Window) {
    const viewData = this.getViewData();
    const htmlOutput = Template(viewData);

    this.replaceIframeContent(contentWindow, htmlOutput);
  }
}
