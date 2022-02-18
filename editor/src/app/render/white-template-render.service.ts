import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { TemplateRenderService } from './template-render.service';
import * as Template from '../../templates/Sites/Sections/whiteTemplate.twig';
import { SectionRenderService } from '../sites/sections/section-render.service';
import { SectionHeadRenderService } from '../sites/sections/section-head-render.service';
import { SitesMenuRenderService } from '../sites/sites-menu-render.service';
import { SitesHeaderRenderService } from '../sites/sites-header-render.service';
import { AdditionalTextRenderService } from '../sites/sections/additional-text-render.service';
import { SectionsMenuRenderService } from '../sites/sections/sections-menu-render.service';
import { SectionTagsService } from '../sites/sections/tags/section-tags.service';
import { SitesBannersRenderService } from '../sites/sites-banners-render.service';
import { SectionFooterRenderService } from '../sites/sections/section-footer-render.service';

@Injectable({
  providedIn: 'root',
})
export class WhiteTemplateRenderService extends TemplateRenderService {
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
    sectionFooterRenderService: SectionFooterRenderService
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
      sectionFooterRenderService
    );
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
        sideColumnAttributes: this.sectionRenderService.getSideColumnAttributes(
          commonViewData.siteTemplateSettings
        ),
        mainColumnAttributes: this.sectionRenderService.getMainColumnAttributes(
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
