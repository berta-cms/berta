import { Injectable } from '@angular/core';
import { TwigTemplateRenderService } from '../render/twig-template-render.service';

@Injectable({
  providedIn: 'root',
})
export class SocialMediaLinksRenderService {
  constructor(private twigTemplateRenderService: TwigTemplateRenderService) {}

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

    try {
      return this.twigTemplateRenderService.render(
        'Sites/socialMediaLinks',
        viewData,
      );
    } catch (error) {
      console.error('Failed to render template:', error);
      return '';
    }
  }
}
