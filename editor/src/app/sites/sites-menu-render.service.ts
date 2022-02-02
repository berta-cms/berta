import { Injectable } from '@angular/core';
import * as Template from '../../templates/Sites/sitesMenu.twig';
import { toHtmlAttributes } from '../shared/helpers';

@Injectable({
  providedIn: 'root',
})
export class SitesMenuRenderService {
  DRAGGABLE_MENU_CLASSES = 'mess xEditableDragXY xProperty-multisitesXY';

  getStyles(siteSettings) {
    const [left, top] =
      siteSettings.siteTexts && siteSettings.siteTexts.multisitesXY
        ? siteSettings.siteTexts.multisitesXY.split(',')
        : [
            Math.floor(Math.random() * 960 + 1),
            Math.floor(Math.random() * 600 + 1),
          ];

    return `left:${left}px;top:${top}px`;
  }

  getViewData(
    appState,
    siteSettings,
    templateName,
    siteTemplateSettings,
    sites
  ) {
    const isResponsive = siteTemplateSettings.pageLayout.responsive === 'yes';
    let menuAttributes: {
      [key: string]: string;
    } = {};

    if (templateName === 'messy' && !isResponsive) {
      menuAttributes = {
        'data-path': `${appState.site}/settings/siteTexts/multisitesXY`,
        class: this.DRAGGABLE_MENU_CLASSES,
        style: this.getStyles(siteSettings),
      };
    }

    return {
      sites: sites.map((site) => {
        return {
          name: site.title || site.name,
          className: appState.site === site.name ? 'selected' : null,
          link: './' + (site.name ? `?site=${site.name}` : ''),
        };
      }),
      attributes: toHtmlAttributes(menuAttributes),
    };
  }

  render(
    appState,
    user,
    siteSettings,
    templateName,
    siteTemplateSettings,
    sites
  ) {
    if (!user.features.includes('multisite')) {
      return '';
    }

    if (sites.length < 2) {
      return '';
    }

    const viewData = this.getViewData(
      appState,
      siteSettings,
      templateName,
      siteTemplateSettings,
      sites
    );

    if (!viewData.sites.length) {
      return '';
    }

    const htmlOutput = Template(viewData);
    return htmlOutput;
  }
}
