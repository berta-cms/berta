import {Injectable} from "@angular/core";
import {Store} from "@ngxs/store";
import {SiteSettingsState} from "../sites/settings/site-settings.state";
import {DefaultTemplateRerenderService} from "./default-template-rerender.service";
import {MashupTemplateRerenderService} from "./mashup/mashup-template-rerender.service";
import {WhiteTemplateRerenderService} from "./white/white-template-rerender.service";

@Injectable({
  providedIn: 'root'
})
export class RerenderService {
  constructor(
    private store: Store,
    private defaultRerenderService: DefaultTemplateRerenderService,
    private mashupRerenderService: MashupTemplateRerenderService,
    private whiteRerenderService: WhiteTemplateRerenderService,
  ) {}

  handleRerendering(iframe: HTMLIFrameElement) {
    const templateName = this.store
      .selectSnapshot(SiteSettingsState.getCurrentSiteTemplate)
      .split('-')
      .shift();

    switch (templateName) {
      case 'white':
        this.whiteRerenderService.handle(iframe);
        break;

      case 'default':
        this.defaultRerenderService.handle(iframe)
        break

      case 'mashup':
        this.mashupRerenderService.handle(iframe)
        break;

      // Messy
      default:
        // this.messyTemplateRenderService.startRender(contentWindow);
        break;
    }
  }
}
