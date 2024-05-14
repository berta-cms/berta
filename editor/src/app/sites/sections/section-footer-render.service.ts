import { Injectable } from '@angular/core';
import * as Template from '../../../templates/Sites/Sections/sectionFooter.twig';
import { SiteSectionStateModel } from './sections-state/site-sections-state.model';

@Injectable({
  providedIn: 'root',
})
export class SectionFooterRenderService {
  constructor() {}

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
    const htmlOutput = Template(viewData);

    return htmlOutput;
  }
}
