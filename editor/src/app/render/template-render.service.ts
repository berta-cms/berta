import { Injectable } from "@angular/core";
import { Store } from "@ngxs/store";
import { SiteSettingsState } from "../sites/settings/site-settings.state";

@Injectable({
  providedIn: "root",
})
export class TemplateRenderService {
  constructor(public readonly store: Store) {}

  getViewData() {
    console.log("getViewData t");
    const viewData = {
      siteSettings: this.store.selectSnapshot(
        SiteSettingsState.getCurrentSiteSettings
      ),
    };

    return viewData;
  }

  replaceIframeContent(contentWindow: Window, html: string) {
    Array.from(contentWindow.document.childNodes).forEach((node) =>
      node.remove()
    );

    contentWindow.document.open();
    contentWindow.document.write(html);
    contentWindow.document.close();
  }
}
