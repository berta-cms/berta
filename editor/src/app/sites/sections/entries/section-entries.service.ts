import { Injectable } from '@angular/core';
import { SectionEntry } from './entries-state/section-entries-state.model';

@Injectable({
  providedIn: 'root',
})
export class SectionEntriesService {
  getSectionEntries(
    entries: SectionEntry[],
    sectionSlug: string,
    tagSlug: string | null
  ): SectionEntry[] {
    return entries
      .filter((entry) => {
        if (entry.sectionName !== sectionSlug) {
          return false;
        }

        const entryTagSlugs: string[] =
          entry.tags && entry.tags.slugs ? entry.tags.slugs : [];

        return tagSlug
          ? entryTagSlugs.includes(tagSlug)
          : entryTagSlugs.length === 0;
      })
      .sort((a, b) => a.order - b.order);
  }
}
