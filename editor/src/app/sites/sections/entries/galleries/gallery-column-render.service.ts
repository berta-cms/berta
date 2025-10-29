import { Injectable } from '@angular/core';
import { GalleryRenderService } from './gallery-render.service';

@Injectable({
  providedIn: 'root',
})
export class GalleryColumnRenderService extends GalleryRenderService {
  getGalleryClassList(galleryItemsData, galleryType): string[] | string {
    let classes = super.getGalleryClassList(galleryItemsData, galleryType);

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

  getColumnViewData(
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
        items: galleryItems.slice(0, 1),
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

    const viewData = this.getColumnViewData(
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
        'Sites/Sections/Entries/Galleries/galleryColumn',
        viewData,
      );
    } catch (error) {
      console.error('Failed to render template:', error);
      return '';
    }
  }
}
