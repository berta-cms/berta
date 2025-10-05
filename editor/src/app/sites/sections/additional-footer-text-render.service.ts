import { Injectable } from '@angular/core';
import { AppStateModel } from '../../app-state/app-state.interface';
import { toHtmlAttributes } from '../../shared/helpers';
import { UserStateModel } from '../../user/user.state.model';
import { SocialMediaLinksRenderService } from '../social-media-links-render.service';
import { TwigTemplateRenderService } from '../../render/twig-template-render.service';

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
    private socialMediaLinksRenderService: SocialMediaLinksRenderService,
    private twigTemplateRenderService: TwigTemplateRenderService
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

    try {
      return this.twigTemplateRenderService.render(
        'Sites/Sections/additionalFooterText',
        viewData
      );
    } catch (error) {
      console.error('Failed to render template:', error);
      return '';
    }
  }
}
