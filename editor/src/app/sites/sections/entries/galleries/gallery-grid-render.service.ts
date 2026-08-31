import { Injectable } from '@angular/core';
import { GalleryRenderService } from './gallery-render.service';

@Injectable({
  providedIn: 'root',
})
export class GalleryGridRenderService extends GalleryRenderService {
  getGalleryClassList(
    galleryItemsData,
    galleryType,
    gridShowCaptions?,
  ): string[] | string {
    let classes = super.getGalleryClassList(galleryItemsData, galleryType);

    (classes as string[]).push(`xGridShowCaptions-${gridShowCaptions}`);

    return (classes as string[]).join(' ');
  }

  getGridViewData(
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

    const attrs =
      (entry.mediaCacheData && entry.mediaCacheData['@attributes']) || {};
    const gridShowCaptions = attrs.grid_show_captions || 'yes';

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
          gridShowCaptions,
        ),
        items: galleryItems,
        gridColumnsMobile: attrs.grid_columns_mobile || '1',
        gridColumnsDesktop: attrs.grid_columns_desktop || '2',
        gridColumnsLargeDesktop: attrs.grid_columns_large_desktop || '3',
        gridGap: attrs.grid_gap || false,
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

    const viewData = this.getGridViewData(
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
        'Sites/Sections/Entries/Galleries/galleryGrid',
        viewData,
      );
    } catch (error) {
      console.error('Failed to render template:', error);
      return '';
    }
  }
}
