import { Injectable } from '@angular/core';
import { toHtmlAttributes } from '../../shared/helpers';
import { SocialMediaLinksRenderService } from '../social-media-links-render.service';
import { TwigTemplateRenderService } from '../../render/twig-template-render.service';

@Injectable({
  providedIn: 'root',
})
export class AdditionalTextRenderService {
  DRAGGABLE_CLASSES = ['xEditableDragXY', 'xProperty-additionalTextXY'];
  EDITABLE_CLASSES = [
    'xEditableMCESimple',
    'xProperty-additionalText',
    'xCaption-additional-text',
  ];

  constructor(
    public socialMediaLinksRenderService: SocialMediaLinksRenderService,
    private twigTemplateRenderService: TwigTemplateRenderService
  ) {}

  getStyles(siteSettings: any, isResponsive: boolean): string {
    if (isResponsive) {
      return '';
    }

    const [left, top] =
      siteSettings.siteTexts && siteSettings.siteTexts.additionalTextXY
        ? siteSettings.siteTexts.additionalTextXY.split(',')
        : [
            Math.floor(Math.random() * 960 + 1),
            Math.floor(Math.random() * 600 + 1),
          ];

    return `left:${left}px;top:${top}px`;
  }

  getWrapperAttributes(
    siteSlug: any,
    siteSettings: any,
    templateName: any,
    isResponsive: boolean
  ) {
    let attributes: {
      [key: string]: string;
    } = { id: 'additionalText' };
    let classes: string[] = [];

    if (!isResponsive) {
      attributes[
        'data-path'
      ] = `${siteSlug}/settings/siteTexts/additionalTextXY`;
      classes = this.DRAGGABLE_CLASSES;
    }

    if (templateName === 'messy') {
      classes.push('mess');
    }

    attributes['class'] = classes.join(' ');
    attributes['style'] = this.getStyles(siteSettings, isResponsive);

    return toHtmlAttributes(attributes);
  }

  getContentAttributes(siteSlug) {
    return toHtmlAttributes({
      class: this.EDITABLE_CLASSES.join(' '),
      'data-path': `${siteSlug}/settings/siteTexts/additionalText`,
    });
  }

  getContent(appState, siteSlug: any, siteSettings: any) {
    const showSocialMediaButtons =
      siteSettings.socialMediaButtons.socialMediaLocation === 'additionalText';
    if (
      showSocialMediaButtons &&
      siteSettings.socialMediaButtons.socialMediaHTML.length
    ) {
      return {
        html: siteSettings.socialMediaButtons.socialMediaHTML,
      };
    }

    const showSocialMediaLinks =
      siteSettings.socialMediaLinks.location === 'additionalText';

    if (showSocialMediaLinks) {
      const socialMediaLinks = this.socialMediaLinksRenderService.render(
        appState,
        siteSettings
      );

      if (socialMediaLinks.length) {
        return {
          html: socialMediaLinks,
        };
      }
    }

    return {
      html:
        siteSettings.siteTexts && siteSettings.siteTexts.additionalText
          ? siteSettings.siteTexts.additionalText
          : '',
      attributes: this.getContentAttributes(siteSlug),
    };
  }

  getViewData(appState, siteSlug, siteSettings, templateName, isResponsive) {
    const wrapperAttributes = this.getWrapperAttributes(
      siteSlug,
      siteSettings,
      templateName,
      isResponsive
    );
    const content = this.getContent(appState, siteSlug, siteSettings);

    return {
      wrapperAttributes,
      content,
      isEditMode: true,
    };
  }

  render(appState, siteSlug, siteSettings, templateName, isResponsive) {
    const viewData = this.getViewData(
      appState,
      siteSlug,
      siteSettings,
      templateName,
      isResponsive
    );

    try {
      return this.twigTemplateRenderService.render(
        'Sites/Sections/additionalText',
        viewData
      );
    } catch (error) {
      console.error('Failed to render template:', error);
      return '';
    }
  }
}
