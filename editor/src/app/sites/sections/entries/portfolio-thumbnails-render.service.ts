import { Injectable } from '@angular/core';
import { toHtmlAttributes } from '../../../shared/helpers';
import { SiteSectionStateModel } from '../sections-state/site-sections-state.model';
import { SectionEntry } from './entries-state/section-entries-state.model';
import { GalleryRenderService } from './galleries/gallery-render.service';
import { SectionEntriesService } from './section-entries.service';
import { TwigTemplateRenderService } from '../../../render/twig-template-render.service';

@Injectable({
  providedIn: 'root',
})
export class PortfolioThumbnailsRenderService {
  constructor(
    public sectionEntriesService: SectionEntriesService,
    public galleryRenderService: GalleryRenderService,
    private twigTemplateRenderService: TwigTemplateRenderService,
  ) {}

  getFirstEntryImage(siteSlug: string, siteSettings, entry: SectionEntry) {
    if (
      !entry.mediaCacheData ||
      !entry.mediaCacheData.file ||
      entry.mediaCacheData.file.length === 0
    ) {
      return null;
    }

    const item = entry.mediaCacheData.file.find((file) => {
      return (
        file['@attributes'] &&
        (file['@attributes'].type === 'image' ||
          !!file['@attributes'].poster_frame)
      );
    });

    if (!item) {
      return null;
    }

    const galleryItem = this.galleryRenderService.getGalleryItem(
      siteSlug,
      item,
      // Force use medium size for thumbnails
      {
        ...entry,
        mediaCacheData: {
          ...entry.mediaCacheData,
          '@attributes': {
            ...entry.mediaCacheData['@attributes'],
            ...{ size: 'medium' },
          },
        },
      },
      siteSettings,
    );

    return {
      attributes: toHtmlAttributes({
        src: galleryItem.src,
        srcset: galleryItem.srcset,
      }),
    };
  }

  getViewData(siteSlug: string, siteSettings, entries: SectionEntry[]) {
    return {
      entries: entries.map((entry) => {
        return {
          ...entry,
          ...{
            caption:
              entry.content && entry.content.title
                ? entry.content.title
                : `entry-${entry.id}`,
            slug: `entry-${entry.id}`,
            image: this.getFirstEntryImage(siteSlug, siteSettings, entry),
          },
        };
      }),
      isEditMode: true,
    };
  }

  render(
    siteSlug: string,
    siteSettings,
    currentSection: SiteSectionStateModel,
    currentSectionType: string,
    tagSlug: string,
    entries: SectionEntry[],
  ) {
    if (!currentSection) {
      return '';
    }

    const sectionEntries = this.sectionEntriesService.getSectionEntries(
      entries,
      currentSection.name,
      tagSlug,
    );

    if (currentSectionType !== 'portfolio' || !sectionEntries.length) {
      return '';
    }

    const viewData = this.getViewData(siteSlug, siteSettings, sectionEntries);

    try {
      return this.twigTemplateRenderService.render(
        'Sites/Sections/Entries/portfolioThumbnails',
        viewData,
      );
    } catch (error) {
      console.error('Failed to render template:', error);
      return '';
    }
  }
}
