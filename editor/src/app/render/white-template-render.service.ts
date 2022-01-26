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
        // place for template specific view data here
        bodyClasses: this.sectionRenderService.getBodyClasses(
          commonViewData.siteTemplateSettings,
          commonViewData.sections,
          commonViewData.sectionSlug,
          commonViewData.tagSlug
        ),
      },
    };

    return viewData;
    // return commonViewData;
  }

  startRender(contentWindow: Window) {
    const viewData = this.getViewData();
    const htmlOutput = Template(viewData);

    this.replaceIframeContent(contentWindow, htmlOutput);
  }
}
