import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { SiteSettingsState } from '../sites/settings/site-settings.state';
import { UserState } from '../user/user.state';
import { WhiteTemplateRenderService } from './white-template-render.service';

@Injectable({
  providedIn: 'root'
})
export class RenderService {
  private contentWindow: Window;
  private contentDocument: Document;
  private templateName: string;

  constructor(
    private store: Store,
    private whiteTemplateRenderService: WhiteTemplateRenderService
    ) {

  }

  startRender(contentWindow: Window) {
    const isLoggedIn = this.store.selectSnapshot(UserState.isLoggedIn);
    if (!isLoggedIn) {
      return;
    }

    this.contentWindow = contentWindow;
    this.contentDocument = contentWindow.document;
    const templateName = this.store.selectSnapshot(SiteSettingsState.getCurrentSiteTemplate).split('-').shift();

    switch (templateName) {
      case 'white':
        this.whiteTemplateRenderService.startRender(contentWindow);
        break;

      case 'default':
        break;

      case 'mashup':
        break;

      // Messy
      default:
        break;
    }

  }

  stopRender() {
    // unsubscribe events
  }

}
