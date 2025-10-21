import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { TemplateRenderService } from './template-render.service';
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
import { GridViewRenderService } from '../sites/sections/grid-view-render.service';
import { BackgroundGalleryRenderService } from '../sites/sections/background-gallery-render.service';
import { ShopCartRenderService } from '../shop/shop-cart-render.service';
import { TwigTemplateRenderService } from './twig-template-render.service';

@Injectable({
  providedIn: 'root',
})
export class DefaultTemplateRenderService extends TemplateRenderService {
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
    shopCartRenderService: ShopCartRenderService,
    twigTemplateRenderService: TwigTemplateRenderService,
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
      shopCartRenderService,
      twigTemplateRenderService,
    );
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
        bodyClasses: this.sectionRenderService.getBodyClasses(
          commonViewData.siteTemplateSettings,
          commonViewData.sections,
          commonViewData.sectionSlug,
          commonViewData.tagSlug,
        ),

        isResponsive:
          commonViewData.siteTemplateSettings.pageLayout.responsive === 'yes',

        pageEntriesAttributes:
          this.sectionRenderService.getPageEntriesAttributes(
            commonViewData.sections,
            commonViewData.sectionSlug,
            commonViewData.tagSlug,
          ),
        additionalFooterText: this.additionalFooterTextRenderService.render(
          commonViewData.appState,
          commonViewData.siteSlug,
          commonViewData.siteSettings,
          commonViewData.templateName,
          commonViewData.user,
        ),
      },
    };

    return viewData;
  }

  startRender(contentWindow: Window) {
    const viewData = this.getViewData();

    try {
      const htmlOutput = this.twigTemplateRenderService.render(
        'Sites/Sections/defaultTemplate',
        viewData,
      );
      this.replaceIframeContent(contentWindow, htmlOutput);
    } catch (error) {
      console.error('Failed to render template:', error);
    }
  }
}
