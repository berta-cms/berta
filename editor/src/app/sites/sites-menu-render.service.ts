import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { skip } from 'rxjs/operators';
import * as sitesMenuTemplate from '../../templates/sitesMenu.twig';
import { SiteStateModel } from './sites-state/site-state.model';
import { UserState } from '../user/user.state';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root'
})
export class SitesMenuRenderService {
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

    combineLatest(
      viewObservables.currentSite,
      viewObservables.sites.pipe(skip(1))
    ).subscribe(([currentSite, sites]) => {
      const data = {
        attributes: '', // @todo calculate attributes accoriding to state
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

      // @todo fix: render happens too ofter: unsubscribe after unrender or fix the current subscription from happening too often
      // console.log('site menu rendered!');
    });
  }
}
