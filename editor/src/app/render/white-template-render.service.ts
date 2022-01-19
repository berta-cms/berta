import { Injectable } from "@angular/core";
import { Store } from "@ngxs/store";
import { TemplateRenderService } from "./template-render.service";
import * as Template from "../../templates/Sites/Sections/whiteTemplate.twig";
import { SectionHeadRenderService } from "../sites/sections/section-head-render.service";

@Injectable({
  providedIn: "root",
})
export class WhiteTemplateRenderService extends TemplateRenderService {
  constructor(
    store: Store,
    sectionHeadRenderService: SectionHeadRenderService
  ) {
    super(store, sectionHeadRenderService);
  }

  getViewData() {
    const commonViewData = super.getViewData();
    // const viewData = {
    //   ...commonViewData, ...{
    //     // place for template specific view data here
    //   }

    // return viewData;
    return commonViewData;
  }

  startRender(contentWindow: Window) {
    const viewData = this.getViewData();
    const htmlOutput = Template(viewData);

    this.replaceIframeContent(contentWindow, htmlOutput);
  }
}
