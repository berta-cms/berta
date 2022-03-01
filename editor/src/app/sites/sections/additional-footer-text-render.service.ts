import { Injectable } from '@angular/core';
import { AppStateModel } from 'src/app/app-state/app-state.interface';
import { toHtmlAttributes } from 'src/app/shared/helpers';
import { UserStateModel } from 'src/app/user/user.state.model';
import * as Template from '../../../templates/Sites/Sections/additionalFooterText.twig';
import { SocialMediaLinksRenderService } from '../social-media-links-render.service';

@Injectable({
  providedIn: 'root',
})
export class AdditionalFooterTextRenderService {
  USED_IN_TEMPLATES = ['messy', 'default'];
  EDITABLE_CLASSES = [
    'xEditableMCESimple',
    'xProperty-additionalFooterText',
    'xCaption-additional-footer-text',
  ];

  constructor(
    private socialMediaLinksRenderService: SocialMediaLinksRenderService
  ) {}

  getAttributes(showAdditionalFooterText: boolean, siteSlug: string) {
    let classes = ['clearfix'];

    let attributes = {
      id: 'additionalFooterText',
    };

    if (showAdditionalFooterText) {
      classes = [...classes, ...this.EDITABLE_CLASSES];
      attributes[
        'data-path'
      ] = `${siteSlug}/settings/siteTexts/additionalFooterText`;
    }

    attributes['class'] = classes.join(' ');

    return toHtmlAttributes(attributes);
  }

  getViewData(
    appState: AppStateModel,
    siteSlug: string,
    siteSettings,
    user: UserStateModel
  ) {
    const showSocialMediaButtons =
      user.features.includes('custom_javascript') &&
      siteSettings.socialMediaButtons.socialMediaLocation === 'footer' &&
      siteSettings.socialMediaButtons.socialMediaHTML.length > 0;
    const showSocialMediaLinks =
      siteSettings.socialMediaLinks.location === 'footer' &&
      siteSettings.socialMediaLinks.links.length > 0;
    const showAdditionalFooterText =
      !showSocialMediaButtons && !showSocialMediaLinks;

    const content = showSocialMediaButtons
      ? siteSettings.socialMediaButtons.socialMediaHTML
      : showSocialMediaLinks
      ? this.socialMediaLinksRenderService.render(appState, siteSettings)
      : siteSettings.siteTexts.additionalFooterText || '';

    return {
      content: content,
      attributes: this.getAttributes(showAdditionalFooterText, siteSlug),
    };
  }

  render(
    appState: AppStateModel,
    siteSlug: string,
    siteSettings,
    templateName: string,
    user: UserStateModel
  ) {
    if (!this.USED_IN_TEMPLATES.includes(templateName)) {
      return '';
    }

    const viewData = this.getViewData(appState, siteSlug, siteSettings, user);
    const htmlOutput = Template(viewData);

    return htmlOutput;
  }
}
