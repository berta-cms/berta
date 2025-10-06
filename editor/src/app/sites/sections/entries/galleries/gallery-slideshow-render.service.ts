import { Injectable } from '@angular/core';
import { GalleryRenderService } from './gallery-render.service';
import { toHtmlAttributes } from '../../../../../app/shared/helpers';

@Injectable({
  providedIn: 'root',
})
export class GallerySlideshowRenderService extends GalleryRenderService {
  getGalleryClassList(
    galleryItemsData,
    galleryType,
    entry,
    siteSettings
  ): string[] | string {
    let classes = super.getGalleryClassList(
      galleryItemsData,
      galleryType,
      entry,
      siteSettings
    );

    if (galleryItemsData && galleryItemsData.length && entry) {
      const gallerySlideNumbersVisible =
        entry &&
        entry.mediaCacheData &&
        entry.mediaCacheData['@attributes'] &&
        entry.mediaCacheData['@attributes'].slide_numbers_visible
          ? entry.mediaCacheData['@attributes'].slide_numbers_visible
          : siteSettings.entryLayout.gallerySlideNumberVisibilityDefault;
      (classes as string[]).push(
        `xSlideNumbersVisible-${gallerySlideNumbersVisible}`
      );
    }

    return (classes as string[]).join(' ');
  }

  getGalleryStyles(entry, galleryItems, templateName): string {
    const galleryWidth = this.getGalleryWidth(
      entry,
      galleryItems,
      templateName
    );

    return galleryWidth ? `width:${galleryWidth}px` : null;
  }

  getGalleryWidth(entry, galleryItems, templateName) {
    if (!galleryItems.length) {
      return null;
    }

    const galleryWidthByWidestSlide =
      entry.mediaCacheData &&
      entry.mediaCacheData['@attributes'] &&
      entry.mediaCacheData['@attributes'].gallery_width_by_widest_slide ===
        'yes';

    if (
      templateName !== 'messy' ||
      (templateName === 'messy' && galleryWidthByWidestSlide)
    ) {
      return Math.max(...galleryItems.map((item) => item.width));
    }

    return galleryItems[0].width;
  }

  getViewData(
    appState,
    siteSlug,
    entry,
    siteSettings,
    templateName,
    siteTemplateSettings,
    isLoopAvailable,
    asRowGallery,
    galleryItemsData,
    galleryItems,
    galleryType
  ): { [key: string]: any } {
    galleryItemsData = this.getGalleryItemsData(entry);
    galleryItems = this.generateGalleryItems(
      siteSlug,
      galleryItemsData,
      entry,
      siteSettings
    );
    galleryType =
      entry.mediaCacheData &&
      entry.mediaCacheData['@attributes'] &&
      entry.mediaCacheData['@attributes'].type
        ? entry.mediaCacheData['@attributes'].type
        : siteTemplateSettings.entryLayout.defaultGalleryType;

    const data = super.getViewData(
      appState,
      siteSlug,
      entry,
      siteSettings,
      templateName,
      siteTemplateSettings,
      isLoopAvailable,
      asRowGallery,
      galleryItemsData,
      galleryItems,
      galleryType
    );

    return {
      ...data,
      ...{
        galleryClassList: this.getGalleryClassList(
          galleryItemsData,
          galleryType,
          entry,
          siteSettings
        ),
        attributes: {
          gallery: toHtmlAttributes({
            'data-fullscreen': data.isFullscreen ? '1' : null,
            'data-as-row-gallery': asRowGallery,
            'data-autoplay':
              isLoopAvailable &&
              entry.mediaCacheData &&
              entry.mediaCacheData['@attributes'] &&
              entry.mediaCacheData['@attributes'].autoplay
                ? entry.mediaCacheData['@attributes'].autoplay
                : '0',
            'data-loop':
              isLoopAvailable &&
              siteSettings.entryLayout.gallerySlideshowAutoRewind === 'yes'
                ? '1'
                : '0',
          }),
        },
        galleryStyles: this.getGalleryStyles(entry, galleryItems, templateName),
        items: galleryItems,
        showNavigation: galleryItems.length > 1,
      },
    };
  }

  render(
    appState,
    siteSlug,
    siteSettings,
    templateName,
    entry,
    siteTemplateSettings,
    isLoopAvailable,
    asRowGallery
  ) {
    if (
      !entry.mediaCacheData ||
      !entry.mediaCacheData.file ||
      entry.mediaCacheData.file.length < 1
    ) {
      try {
        return this.twigTemplateRenderService.render(
          'Sites/Sections/Entries/Galleries/editEmptyGallery',
          {}
        );
      } catch (error) {
        console.error('Failed to render template:', error);
        return '';
      }
    }

    const viewData = this.getViewData(
      appState,
      siteSlug,
      entry,
      siteSettings,
      templateName,
      siteTemplateSettings,
      isLoopAvailable,
      asRowGallery,
      null,
      null,
      null
    );

    try {
      return this.twigTemplateRenderService.render(
        'Sites/Sections/Entries/Galleries/gallerySlideshow',
        viewData
      );
    } catch (error) {
      console.error('Failed to render template:', error);
      return '';
    }
  }
}
