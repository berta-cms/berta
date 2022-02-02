import { Injectable } from '@angular/core';
import * as Template from '../../templates/Sites/socialMediaLinks.twig';

@Injectable({
  providedIn: 'root',
})
export class SocialMediaLinksRenderService {
  getViewData(appState, siteSettings) {
    if (
      !siteSettings.socialMediaLinks ||
      !siteSettings.socialMediaLinks.links ||
      siteSettings.socialMediaLinks.links.length < 1
    ) {
      return null;
    }

    const links = siteSettings.socialMediaLinks.links.map((link) => {
      const iconName = link[0].value ? link[0].value : 'link';
      const icon = appState.socialMediaIcons[iconName];

      return { url: link[1].value, icon: icon };
    });

    return { socialMediaLinks: links };
  }

  render(appState, siteSettings) {
    const viewData = this.getViewData(appState, siteSettings);

    if (!viewData || !viewData.socialMediaLinks) {
      return '';
    }

    const htmlOutput = Template(viewData);
    return htmlOutput;
  }
}
