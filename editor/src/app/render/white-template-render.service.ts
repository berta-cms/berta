import { Injectable } from "@angular/core";
import { Store } from "@ngxs/store";
import { TemplateRenderService } from "./template-render.service";
import { SitesMenuRenderService } from "../sites/sites-menu-render.service";
import * as Template from "../../templates/Sites/Sections/whiteTemplate.twig";

@Injectable({
  providedIn: "root",
})
export class WhiteTemplateRenderService extends TemplateRenderService {
  constructor(
    store: Store,
    private sitesMenuRenderService: SitesMenuRenderService
  ) {
    super(store);
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

  stopRender() {
    this.sitesMenuRenderService.stopRender();
  }
}
