import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { TemplateRenderService } from './template-render.service';
import * as Template from '../../templates/Sites/Sections/whiteTemplate.twig';
import { SectionRenderService } from '../sites/sections/section-render.service';
import { SectionHeadRenderService } from '../sites/sections/section-head-render.service';

@Injectable({
  providedIn: 'root',
})
export class WhiteTemplateRenderService extends TemplateRenderService {
  constructor(
    store: Store,
    sectionRenderService: SectionRenderService,
    sectionHeadRenderService: SectionHeadRenderService
  ) {
    super(store, sectionRenderService, sectionHeadRenderService);
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
