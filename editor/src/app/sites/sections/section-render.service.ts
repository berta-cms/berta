import { Injectable } from '@angular/core';
import { toHtmlAttributes } from '../../shared/helpers';
import { SocialMediaLinksRenderService } from '../social-media-links-render.service';
import { SiteSectionStateModel } from './sections-state/site-sections-state.model';
import {ClassAttr} from "../../../types/attributes";

@Injectable({
  providedIn: 'root',
})
export class SectionRenderService {
  constructor(
    private socialMediaLinksRenderService: SocialMediaLinksRenderService
  ) {}

  getCurrentSection(sections: SiteSectionStateModel[], sectionSlug: string) {
    if (!sections || !sections.length) {
      return null;
    }

    const currentSection = sectionSlug
      ? sections.find((section) => section.name === sectionSlug)
      : sections[0];

    return currentSection;
  }

  getCurrentSectionType(currentSection: SiteSectionStateModel) {
    if (
      !currentSection ||
      !currentSection['@attributes'] ||
      !currentSection['@attributes'].type
    ) {
      return 'default';
    }

    return currentSection['@attributes'].type;
  }

  isResponsive(currentSection: SiteSectionStateModel, siteTemplateSettings) {
    const isResponsiveTemplate =
      siteTemplateSettings.pageLayout.responsive === 'yes';
    const currentSectionType = this.getCurrentSectionType(currentSection);

    return isResponsiveTemplate || currentSectionType === 'portfolio';
  }

  getBodyClasses(
    siteTemplateSettings,
    sections: SiteSectionStateModel[],
    sectionSlug: string,
    tagSlug: string
  ) {
    const currentSection = this.getCurrentSection(sections, sectionSlug);
    const currentSectionType = this.getCurrentSectionType(currentSection);

    let classes: string[] = [];
    if (siteTemplateSettings.pageLayout.responsive === 'yes') {
      classes.push('bt-responsive');
    }

    if (currentSection) {
      classes.push(`xContent-${currentSection.name}`);
      classes.push(`xSectionType-${currentSectionType}`);
    }

    if (tagSlug) {
      classes.push(`xSubmenu-${tagSlug}`);
    }

    return classes.join(' ');
  }

  getSideColumnAttributes(siteTemplateSettings) {
    let attributes: {
      [key: string]: string;
    } = {};
    let classes = [];

    if (siteTemplateSettings.pageLayout.centered === 'yes') {
      classes.push('xCentered');
    }
    if (siteTemplateSettings.pageLayout.responsive === 'yes') {
      classes.push('xResponsive');
    }

    attributes.class = classes.join(' ');

    return toHtmlAttributes(attributes);
  }

  getMainColumnAttributes(siteTemplateSettings) {
    let attributes: {
      [key: string]: string;
    } = {};

    if (siteTemplateSettings.pageLayout.centered === 'yes') {
      attributes.class = 'xCentered';
    }

    if (siteTemplateSettings.pageLayout.responsive === 'yes') {
      attributes['data-paddingtop'] =
        siteTemplateSettings.pageLayout.paddingTop;
    }

    return toHtmlAttributes(attributes);
  }

  getPageEntriesAttributes(
    sections: SiteSectionStateModel[],
    sectionSlug: string,
    tagSlug: string
  ): ClassAttr {
    const currentSection = this.getCurrentSection(sections, sectionSlug);
    let attributes: ClassAttr = {class: ''};

    let classes = ['xEntriesList', `xSection-${currentSection.name}`];

    if (tagSlug) {
      classes.push(`xTag-${tagSlug}`);
    }

    attributes.class = classes.join(' ');

    return attributes;
  }

  // used only for White and Mashup
  getSocialMediaLinks(appState, siteSettings) {
    if (
      siteSettings.socialMediaButtons.socialMediaLocation === 'footer' &&
      siteSettings.socialMediaButtons.socialMediaHTML
    ) {
      return siteSettings.socialMediaButtons.socialMediaHTML;
    }

    if (siteSettings.socialMediaLinks.location === 'footer') {
      return this.socialMediaLinksRenderService.render(appState, siteSettings);
    }

    return '';
  }
}
