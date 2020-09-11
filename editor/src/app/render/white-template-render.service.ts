import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { TemplateRenderService } from './template-render.service';
import { SitesMenuRenderService } from "../sites/sites-menu-render.service";

@Injectable({
  providedIn: 'root'
})
export class WhiteTemplateRenderService extends TemplateRenderService {

  constructor(
    store: Store,
    private sitesMenuRenderService: SitesMenuRenderService) {
    super(store);
  }

  getViewObservables() {
    const commonViewObservables = super.getViewObservables();
    const viewObservables = {
      ...commonViewObservables, ...{
        // place for template specific observables
      }
    };

    return viewObservables;
  }

  startRender(contentWindow: Window) {
    const viewObservables = this.getViewObservables();

    this.sitesMenuRenderService.startRender(contentWindow, viewObservables, {
      element: '#sideColumnTop',
      position: 'afterbegin'
    });
  }

}
