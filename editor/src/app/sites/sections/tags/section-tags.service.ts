import { Injectable } from '@angular/core';
import { SiteSectionStateModel } from '../sections-state/site-sections-state.model';
import { SectionTagsInterface } from './section-tags-state.model';

@Injectable({
  providedIn: 'root',
})
export class SectionTagsService {
  getCurrentTag(
    siteSettings: { [key: string]: { [key: string]: any } },
    tags: SectionTagsInterface[],
    section: SiteSectionStateModel,
    tagSlug: string
  ): string | null {
    if (!section) {
      return null;
    }
    // if currently selected tag is passed (from query params)
    if (tagSlug && tagSlug.length) {
      return tagSlug;
    }

    if (
      siteSettings.navigation.alwaysSelectTag === 'no' ||
      (section['@attributes'] &&
        section['@attributes'].has_direct_content === '1')
    ) {
      return null;
    }

    const sectionTags =
      tags && tags.find((tag) => tag['@attributes'].name === section.name);

    if (!sectionTags) {
      return null;
    }

    const currentTag = sectionTags.tag.find((tag) => tag.order === 0);

    return currentTag ? currentTag['@attributes'].name : null;
  }
}
