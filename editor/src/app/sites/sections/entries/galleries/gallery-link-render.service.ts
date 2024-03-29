import { Injectable } from '@angular/core';
import * as Template from '../../../../../templates/Sites/Sections/Entries/Galleries/galleryLink.twig';
import * as EditEmptyGallery from '../../../../../templates/Sites/Sections/Entries/Galleries/editEmptyGallery.twig';
import { GalleryRenderService } from './gallery-render.service';

@Injectable({
  providedIn: 'root',
})
export class GalleryLinkRenderService extends GalleryRenderService {
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
      return EditEmptyGallery();
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

    const htmlOutput = Template(viewData);

    return htmlOutput;
  }
}
