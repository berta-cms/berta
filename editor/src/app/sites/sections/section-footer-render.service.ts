import { Injectable } from '@angular/core';
import { SiteSectionStateModel } from './sections-state/site-sections-state.model';
import { TwigTemplateRenderService } from '../../render/twig-template-render.service';

@Injectable({
  providedIn: 'root',
})
export class SectionFooterRenderService {
  constructor(private twigTemplateRenderService: TwigTemplateRenderService) {}

  getIntercomSettings(sections: any, user: any) {
    if (!sections.length) {
      return;
    }

    return user.intercom;
  }

  getViewData(siteSettings, sections: SiteSectionStateModel[], user) {
    let viewData = {
      intercom: this.getIntercomSettings(sections, user),
      hostName: location.hostname,
      isEditMode: true,
    };

    if (user.features.includes('custom_javascript')) {
      viewData = {
        ...viewData,
        ...{
          customUserJs: siteSettings.settings.jsInclude,
          customSocialMediaButtonsJs:
            siteSettings.socialMediaButtons.socialMediaJS,
        },
      };
    }

    return viewData;
  }

  render(siteSettings, sections: SiteSectionStateModel[], user) {
    const viewData = this.getViewData(siteSettings, sections, user);

    try {
      return this.twigTemplateRenderService.render(
        'Sites/Sections/sectionFooter',
        viewData,
      );
    } catch (error) {
      console.error('Failed to render template:', error);
      return '';
    }
  }
}
