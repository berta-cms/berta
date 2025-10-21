import { Injectable } from '@angular/core';
import { toHtmlAttributes, toImageHtmlAttributes } from '../shared/helpers';
import { TwigTemplateRenderService } from '../render/twig-template-render.service';

@Injectable({
  providedIn: 'root',
})
export class SitesHeaderRenderService {
  DRAGGABLE_HEADING_CLASSES = [
    'mess',
    'xEditableDragXY',
    'xProperty-siteHeadingXY',
  ];
  EDITABLE_CLASSES = ['xEditable', 'xProperty-siteHeading'];
  HEADER_IMAGE_TEMPLATE_SETTING_GROUP = {
    default: 'pageHeading',
    messy: 'heading',
    mashup: 'sideBar',
    white: 'pageHeading',
  };

  constructor(private twigTemplateRenderService: TwigTemplateRenderService) {}

  getHeadingStyles(siteSettings) {
    const [left, top] =
      siteSettings.siteTexts && siteSettings.siteTexts.siteHeadingXY
        ? siteSettings.siteTexts.siteHeadingXY.split(',')
        : [
            Math.floor(Math.random() * 960 + 1),
            Math.floor(Math.random() * 600 + 1),
          ];

    return `left:${left}px;top:${top}px`;
  }

  getHeadingAttributes(
    isResponsive,
    templateName,
    siteSlug,
    siteSettings,
    siteTemplateSettings,
  ) {
    let attributes: {
      [key: string]: string;
    } = {};

    // We need heading attributes only for Messy template
    if (templateName !== 'messy') {
      return '';
    }

    let classes: string[] = [];

    if (!isResponsive) {
      attributes = {
        'data-path': `${siteSlug}/settings/siteTexts/siteHeadingXY`,
        style: this.getHeadingStyles(siteSettings),
      };

      classes = this.DRAGGABLE_HEADING_CLASSES;
    }

    if (siteTemplateSettings.heading.position === 'fixed') {
      classes.push('xFixed');
      attributes.style += ';position: fixed !important;';
    } else {
      const i = classes.indexOf('xFixed');
      if (i > -1) {
        classes.splice(i, 1);
        attributes.style += ';position: absolute !important;';
      }
    }

    attributes.class = classes.join(' ');

    return toHtmlAttributes(attributes);
  }

  getHeadingImageAttributes(siteSlug, templateName, siteTemplateSettings) {
    const settingGroup = this.HEADER_IMAGE_TEMPLATE_SETTING_GROUP[templateName]
      ? this.HEADER_IMAGE_TEMPLATE_SETTING_GROUP[templateName]
      : 'heading';
    const filename = siteTemplateSettings[settingGroup].image
      ? siteTemplateSettings[settingGroup].image
      : null;

    if (!filename) {
      return '';
    }

    const width = siteTemplateSettings[settingGroup].image_width || null;
    const height = siteTemplateSettings[settingGroup].image_height || null;

    return toImageHtmlAttributes(siteSlug, { filename, width, height });
  }

  getUrl(siteSlug: string): string {
    return siteSlug.length ? `/engine/editor/?site=${siteSlug}` : '.';
  }

  getEditableAttributes(siteSlug: string) {
    return toHtmlAttributes({
      class: this.EDITABLE_CLASSES.join(' '),
      'data-path': `${siteSlug}/settings/siteTexts/siteHeading`,
    });
  }

  getViewData(
    siteSlug,
    siteSettings,
    templateName,
    siteTemplateSettings,
    isResponsive,
  ) {
    const headingAttributes = this.getHeadingAttributes(
      isResponsive,
      templateName,
      siteSlug,
      siteSettings,
      siteTemplateSettings,
    );
    const headingImageAttributes = this.getHeadingImageAttributes(
      siteSlug,
      templateName,
      siteTemplateSettings,
    );
    const link = this.getUrl(siteSlug);
    const editableAttributes = this.getEditableAttributes(siteSlug);

    return {
      title:
        siteSettings.siteTexts && siteSettings.siteTexts.siteHeading
          ? siteSettings.siteTexts.siteHeading
          : '',
      headingAttributes,
      headingImageAttributes,
      link,
      editableAttributes,
      isEditMode: true,
    };
  }

  render(
    siteSlug,
    siteSettings,
    templateName,
    siteTemplateSettings,
    isResponsive,
  ) {
    const viewData = this.getViewData(
      siteSlug,
      siteSettings,
      templateName,
      siteTemplateSettings,
      isResponsive,
    );

    try {
      return this.twigTemplateRenderService.render(
        'Sites/sitesHeader',
        viewData,
      );
    } catch (error) {
      console.error('Failed to render template:', error);
      return '';
    }
  }
}
