import { Injectable } from '@angular/core';
import { Observable, combineLatest, Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import * as sitesMenuTemplate from '../../templates/Sites/sitesMenu.twig';
import { SiteStateModel } from './sites-state/site-state.model';
import { UserState } from '../user/user.state';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root'
})
export class SitesMenuRenderService {
  private dataSubscription: Subscription;
  templateSelector = '#multisites';

  constructor(private store: Store) {
  }

  startRender(contentWindow: Window, viewObservables: { [key: string]: Observable<any> }, location: { element: string, position: InsertPosition }) {
    const user = this.store.selectSnapshot(UserState);
    if (user.features.indexOf('multisite') < 0) {
      return;
    }

    let targetElement = contentWindow.document.querySelector(location.element);
    if (!targetElement) {
      return;
    }

    this.dataSubscription = combineLatest([
      viewObservables.currentSite,
      viewObservables.sites.pipe(skip(1))
    ]).subscribe(([currentSite, sites]) => {
      const data = {
        attributes: '', // @todo calculate attributes according to state (required only for messy template)
        sites: sites.map((site: SiteStateModel) => {
          return {
            name: site.title,
            link: './' + (site.name ? '?site=' + site.name : ''),
            className: currentSite === site.name ? 'selected' : null
          };
        })
      };

      const html = sitesMenuTemplate(data);
      const templateElement = contentWindow.document.querySelector(this.templateSelector);

      if (templateElement) {
        templateElement.remove();
      }

      targetElement.insertAdjacentHTML(location.position, html);
    });
  }

  stopRender() {
    this.dataSubscription.unsubscribe();
  }
}
