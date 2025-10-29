import { Injectable } from '@angular/core';
import { GalleryRenderService } from './gallery-render.service';

@Injectable({
  providedIn: 'root',
})
export class GalleryLinkRenderService extends GalleryRenderService {
  getGalleryClassList(galleryItemsData, galleryType): string[] | string {
    let classes = super.getGalleryClassList(galleryItemsData, galleryType);

    if (galleryItemsData.length > 1) {
      (classes as string[]).push('bt-has-hover');
    }

    return (classes as string[]).join(' ');
  }

  getGalleryStyles(galleryItems): string {
    if (!galleryItems.length) {
      return null;
    }
    const item = galleryItems[0];
    const height = item.height ? item.height : item.width * 0.5625; // 16:9 ratio

    return `width:${item.width}px;height:${height}px`;
  }

  getLinkViewData(
    siteSlug,
    entry,
    siteSettings,
    siteTemplateSettings,
    galleryItemsData,
    galleryItems,
    galleryType,
  ): { [key: string]: any } {
    galleryItemsData = this.getGalleryItemsData(entry);
    galleryItems = this.generateGalleryItems(
      siteSlug,
      galleryItemsData,
      entry,
      siteSettings,
    );
    galleryType =
      entry.mediaCacheData &&
      entry.mediaCacheData['@attributes'] &&
      entry.mediaCacheData['@attributes'].type
        ? entry.mediaCacheData['@attributes'].type
        : siteTemplateSettings.entryLayout.defaultGalleryType;

    const data = super.getViewData(
      entry,
      galleryItemsData,
      galleryItems,
      galleryType,
    );

    return {
      ...data,
      ...{
        galleryClassList: this.getGalleryClassList(
          galleryItemsData,
          galleryType,
        ),
        galleryStyles: this.getGalleryStyles(galleryItems),
        linkAddress:
          entry.mediaCacheData &&
          entry.mediaCacheData['@attributes'] &&
          entry.mediaCacheData['@attributes'].link_address
            ? entry.mediaCacheData['@attributes'].link_address
            : '',
        linkTarget:
          entry.mediaCacheData &&
          entry.mediaCacheData['@attributes'] &&
          entry.mediaCacheData['@attributes'].linkTarget
            ? entry.mediaCacheData['@attributes'].linkTarget
            : '_self',
        items: galleryItems.slice(0, 2),
      },
    };
  }

  render(siteSlug, siteSettings, entry, siteTemplateSettings) {
    if (
      !entry.mediaCacheData ||
      !entry.mediaCacheData.file ||
      entry.mediaCacheData.file.length < 1
    ) {
      try {
        return this.twigTemplateRenderService.render(
          'Sites/Sections/Entries/Galleries/editEmptyGallery',
          {},
        );
      } catch (error) {
        console.error('Failed to render template:', error);
        return '';
      }
    }

    const viewData = this.getLinkViewData(
      siteSlug,
      entry,
      siteSettings,
      siteTemplateSettings,
      null,
      null,
      null,
    );

    try {
      return this.twigTemplateRenderService.render(
        'Sites/Sections/Entries/Galleries/galleryLink',
        viewData,
      );
    } catch (error) {
      console.error('Failed to render template:', error);
      return '';
    }
  }
}
