import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { TemplateRenderService } from './template-render.service';
import * as Template from '../../templates/Sites/Sections/mashupTemplate.twig';
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
import { toHtmlAttributes } from '../shared/helpers';
import { MashupEntriesRenderService } from '../sites/sections/entries/mashup-entries-render.service';
import { GridViewRenderService } from '../sites/sections/grid-view-render.service';
import { BackgroundGalleryRenderService } from '../sites/sections/background-gallery-render.service';
import { ShopCartRenderService } from '../shop/shop-cart-render.service';

@Injectable({
  providedIn: 'root',
})
export class MashupTemplateRenderService extends TemplateRenderService {
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

  getContentContainerAttributes(
    siteTemplateSettings,
    currentSectionType: string
  ) {
    let classes = [];

    if (currentSectionType === 'mash_up') {
      classes.push('noEntries');
    }

    if (siteTemplateSettings.pageLayout.responsive === 'yes') {
      classes.push('xResponsive');
    }

    return {
      class: classes.join(' '),
    };
  }

  getMainColumnAttributes(siteTemplateSettings): {class: string, 'data-paddingtop': string} {
    return {
      class:
        siteTemplateSettings.pageLayout.centered === 'yes' ? 'xCentered' : null,
      'data-paddingtop':
        siteTemplateSettings.pageLayout.responsive === 'yes'
          ? siteTemplateSettings.pageLayout.paddingTop
          : null,
    };
  }

  getViewData(): { [key: string]: any } {
    const commonViewData = super.getViewData();
    const viewData = {
      ...commonViewData,
      ...{
        // place for template specific data for view
        bodyClasses: this.sectionRenderService.getBodyClasses(
          commonViewData.siteTemplateSettings,
          commonViewData.sections,
          commonViewData.sectionSlug,
          commonViewData.tagSlug
        ),
        isCenteredPageLayout:
          commonViewData.siteTemplateSettings.pageLayout.centered === 'yes',
        isResponsive:
          commonViewData.siteTemplateSettings.pageLayout.responsive === 'yes',
        sectionType: commonViewData.currentSectionType,
        sideColumnAttributes: this.sectionRenderService.getSideColumnAttributes(
          commonViewData.siteTemplateSettings
        ),
        contentContainerAttributes: this.getContentContainerAttributes(
          commonViewData.siteTemplateSettings,
          commonViewData.currentSectionType
        ),
        mainColumnAttributes: this.getMainColumnAttributes(
          commonViewData.siteTemplateSettings
        ),
        pageEntriesAttributes:
          this.sectionRenderService.getPageEntriesAttributes(
            commonViewData.sections,
            commonViewData.sectionSlug,
            commonViewData.tagSlug
          ),
        socialMediaLinks: this.sectionRenderService.getSocialMediaLinks(
          commonViewData.appState,
          commonViewData.siteSettings
        ),
        mashupEntries: this.mashupEntriesRenderService.render(
          commonViewData.siteSlug,
          commonViewData.templateName,
          commonViewData.currentSection,
          commonViewData.currentSectionType,
          commonViewData.siteSettings,
          commonViewData.siteTemplateSettings,
          commonViewData.siteTemplateSectionTypes,
          commonViewData.allEntries,
          commonViewData.tagSlug
        ),
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
