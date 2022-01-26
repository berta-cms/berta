import { Injectable } from '@angular/core';
import { SiteSectionStateModel } from './sections-state/site-sections-state.model';

@Injectable({
  providedIn: 'root',
})
export class SectionRenderService {
  constructor() {}

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
}
