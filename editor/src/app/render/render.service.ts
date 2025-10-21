import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { SiteSettingsState } from '../sites/settings/site-settings.state';
import { UserState } from '../user/user.state';
import { DefaultTemplateRenderService } from './default-template-render.service';
import { MashupTemplateRenderService } from './mashup-template-render.service';
import { MessyTemplateRenderService } from './messy-template-render.service';
import { WhiteTemplateRenderService } from './white-template-render.service';

@Injectable({
  providedIn: 'root',
})
export class RenderService {
  private templateName: string;

  constructor(
    private store: Store,
    private whiteTemplateRenderService: WhiteTemplateRenderService,
    private defaultTemplateRenderService: DefaultTemplateRenderService,
    private mashupTemplateRenderService: MashupTemplateRenderService,
    private messyTemplateRenderService: MessyTemplateRenderService,
  ) {}

  startRender(contentWindow: Window) {
    // Remove intercom object from window to prevent Intercon widget load error
    if (contentWindow['Intercom']) {
      delete contentWindow['Intercom'];
    }

    const isLoggedIn = this.store.selectSnapshot(UserState.isLoggedIn);
    if (!isLoggedIn) {
      return;
    }

    this.templateName = this.store
      .selectSnapshot(SiteSettingsState.getCurrentSiteTemplate)
      .split('-')
      .shift();

    switch (this.templateName) {
      case 'white':
        this.whiteTemplateRenderService.startRender(contentWindow);
        break;

      case 'default':
        this.defaultTemplateRenderService.startRender(contentWindow);
        break;

      case 'mashup':
        this.mashupTemplateRenderService.startRender(contentWindow);
        break;

      // Messy
      default:
        this.messyTemplateRenderService.startRender(contentWindow);
        break;
    }
  }
}
