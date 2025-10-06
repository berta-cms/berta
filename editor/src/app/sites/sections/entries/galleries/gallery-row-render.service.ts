import { Injectable } from '@angular/core';
import { GalleryRenderService } from './gallery-render.service';
import { AppStateModel } from '../../../../app-state/app-state.interface';

@Injectable({
  providedIn: 'root',
})
export class GalleryRowRenderService extends GalleryRenderService {
  SPACE_BETWEEN_ITEMS = 12;

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

    if (galleryItemsData && galleryItemsData.length === 1) {
      (classes as string[]).push('bt-gallery-has-one-item');
    }

    return (classes as string[]).join(' ');
  }

  getGalleryStyles(galleryItems): string {
    const galleryWidth = this.getGalleryWidth(galleryItems);

    return galleryWidth ? `width:${galleryWidth}px` : null;
  }

  getGalleryWidth(galleryItems) {
    if (!galleryItems.length) {
      return null;
    }

    return galleryItems.reduce((width: number, galleryItem) => {
      return width + galleryItem.width + this.SPACE_BETWEEN_ITEMS;
    }, 0);
  }

  getGalleryItemsLimit(entry, appState: AppStateModel) {
    const gallerySize =
      entry.mediaCacheData &&
      entry.mediaCacheData['@attributes'] &&
      entry.mediaCacheData['@attributes'].size
        ? entry.mediaCacheData['@attributes'].size
        : 'large';

    return appState.rowGalleryImageLimit[gallerySize];
  }

  getGalleryLoaderSize(galleryItems, galleryItemsLimit) {
    if (galleryItems.length <= galleryItemsLimit) {
      return false;
    }

    // Calculate width of loader from remaining items total width
    const loaderWidth = this.getGalleryWidth(
      galleryItems.slice(0, galleryItemsLimit)
    );
    const lastItem = galleryItems.slice(-1)[0];

    const loaderHeight = lastItem.height
      ? lastItem.height
      : lastItem.width * 0.5625; // 16:9 ratio

    return {
      width: loaderWidth,
      height: loaderHeight,
    };
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

    const galleryItemsLimit = this.getGalleryItemsLimit(entry, appState);

    return {
      ...data,
      ...{
        galleryClassList: this.getGalleryClassList(
          galleryItemsData,
          galleryType,
          entry,
          siteSettings
        ),
        galleryStyles: this.getGalleryStyles(galleryItems),
        items: galleryItems.slice(0, galleryItemsLimit),
        loader: this.getGalleryLoaderSize(galleryItems, galleryItemsLimit),
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
        'Sites/Sections/Entries/Galleries/galleryRow',
        viewData
      );
    } catch (error) {
      console.error('Failed to render template:', error);
      return '';
    }
  }
}
