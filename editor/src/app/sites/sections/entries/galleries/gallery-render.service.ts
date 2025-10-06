import { Injectable } from '@angular/core';
import { toHtmlAttributes } from '../../../../../app/shared/helpers';
import { TwigTemplateRenderService } from '../../../../render/twig-template-render.service';

@Injectable({
  providedIn: 'root',
})
export class GalleryRenderService {
  constructor(public twigTemplateRenderService: TwigTemplateRenderService) {}

  getGalleryItemsData(entry) {
    return entry.mediaCacheData && entry.mediaCacheData.file
      ? entry.mediaCacheData.file
      : [];
  }

  getGalleryItem(siteSlug, image, entry, siteSettings) {
    const isImage = image['@attributes'].type === 'image';
    const isPoster =
      image['@attributes'].poster_frame &&
      image['@attributes'].poster_frame.length > 0;
    let imageName = isPoster
      ? image['@attributes'].poster_frame
      : image['@attributes'].src;

    const mediaUrl = `/storage/${
      siteSlug.length ? `-sites/${siteSlug}/` : ''
    }media`;

    const imageUrlPath = `${mediaUrl}/${entry.mediafolder}/`;

    const itemSizes = this.getItemSizes(image, entry, siteSettings);

    let srcLarge = `${imageUrlPath}${imageName}`;

    if (isImage) {
      srcLarge = `${imageUrlPath}${this.getImageNameBySize(
        imageName,
        itemSizes.large
      )}`;
    }

    const srcset =
      itemSizes.display2x.width && itemSizes.display2x.height
        ? `${imageUrlPath}${this.getImageNameBySize(
            imageName,
            itemSizes.display
          )} 1x, ${imageUrlPath}${this.getImageNameBySize(
            imageName,
            itemSizes.display2x
          )} 2x`
        : '';

    const caption = image['@value'] ? image['@value'] : '';

    // clear html from caption to safely use as alt attribute
    const alt = caption.length
      ? caption
          .replace(/\n/g, ' ') // remove new line
          .replace(/(<([^>]+)>)/gi, '') // remove html tags
          .replace(/  +/g, ' ') // remove too many empty spaces
          .trim()
      : '';

    if (itemSizes.display2x.width && itemSizes.display2x.height) {
      imageName = this.getImageNameBySize(imageName, itemSizes.display);
    }

    return {
      type: image['@attributes'].type,
      src: `${imageUrlPath}${imageName}`,
      original: `${imageUrlPath}${image['@attributes'].src}`,
      original_width: itemSizes.original.width,
      original_height: itemSizes.original.height,
      large_src: srcLarge,
      large_width: itemSizes.large.width,
      large_height: itemSizes.large.height,
      width: itemSizes.display.width,
      height: itemSizes.display.height,
      srcset: srcset,
      alt: alt,
      caption: caption,
      poster: isPoster ? `${imageUrlPath}${imageName}` : '',
      autoplay:
        image['@attributes'].autoplay && image['@attributes'].autoplay === '1',
    };
  }
  getImageNameBySize(
    imageName: string,
    size: { width: number; height: number }
  ): string {
    return `_${size.width}x${size.height}_${imageName}`;
  }
  getItemSizes(image, entry, siteSettings) {
    let width,
      height,
      imageTargetWidth2x,
      imageTargetHeight2x,
      width2x,
      height2x;
    const isImage = image['@attributes'].type === 'image';

    if (image['@attributes'].width && image['@attributes'].height) {
      width = parseInt(image['@attributes'].width, 10);
      height = parseInt(image['@attributes'].height, 10);
    }

    const imageSize =
      entry.mediaCacheData &&
      entry.mediaCacheData['@attributes'] &&
      entry.mediaCacheData['@attributes'].size
        ? entry.mediaCacheData['@attributes'].size.charAt(0).toUpperCase() +
          entry.mediaCacheData['@attributes'].size.slice(1)
        : 'Large';

    const imageTargetWidth = parseInt(
      siteSettings.media[`images${imageSize}Width`],
      10
    );
    const imageTargetHeight = parseInt(
      siteSettings.media[`images${imageSize}Height`],
      10
    );

    const originalWidth = width;
    const originalHeight = height;

    if (
      width &&
      height &&
      imageTargetWidth &&
      imageTargetHeight &&
      (width > imageTargetWidth || height > imageTargetHeight)
    ) {
      [width, height] = this.fitInBounds(
        width,
        height,
        imageTargetWidth,
        imageTargetHeight
      );

      imageTargetWidth2x = width * 2;
      imageTargetHeight2x = height * 2;

      if (
        originalWidth &&
        originalHeight &&
        imageTargetWidth2x &&
        imageTargetHeight2x &&
        (originalWidth >= imageTargetWidth2x ||
          originalHeight >= imageTargetHeight2x)
      ) {
        [width2x, height2x] = this.fitInBounds(
          originalWidth,
          originalHeight,
          imageTargetWidth2x,
          imageTargetHeight2x
        );
      }
    }

    let largeWidth = originalWidth;
    let largeHeight = originalHeight;

    if (isImage) {
      const imageTargetWidthLarge = parseInt(
        siteSettings.media.imagesLargeWidth,
        10
      );
      const imageTargetHeightLarge = parseInt(
        siteSettings.media.imagesLargeHeight,
        10
      );

      if (
        originalWidth &&
        originalHeight &&
        imageTargetWidthLarge &&
        imageTargetHeightLarge &&
        (originalWidth >= imageTargetWidthLarge ||
          originalHeight >= imageTargetHeightLarge)
      ) {
        [largeWidth, largeHeight] = this.fitInBounds(
          originalWidth,
          originalHeight,
          imageTargetWidthLarge,
          imageTargetHeightLarge
        );
      }
    }

    width = width ? width : imageTargetWidth;

    return {
      original: {
        width: originalWidth,
        height: originalHeight,
      },
      display: {
        width: width,
        height: height,
      },
      display2x: {
        width: width2x,
        height: height2x,
      },
      large: {
        width: largeWidth,
        height: largeHeight,
      },
    };
  }
  fitInBounds(
    width: number,
    height: number,
    imageTargetWidth: number,
    imageTargetHeight: number
  ): [number, number] {
    const rw = width / imageTargetWidth;
    const rh = height / imageTargetHeight;
    const newW = rw > rh ? imageTargetWidth : Math.round(width / rh);
    const newH = rw > rh ? Math.round(height / rw) : imageTargetHeight;

    return [newW, newH];
  }

  generateGalleryItems(siteSlug, galleryItemsData, entry, siteSettings) {
    const items = galleryItemsData.map((item) => {
      return this.getGalleryItem(siteSlug, item, entry, siteSettings);
    });

    return items;
  }

  getGalleryClassList(
    galleryItemsData,
    galleryType,
    entry,
    siteSettings
  ): string[] | string {
    let classes = ['xGalleryContainer'];
    if (galleryItemsData.length) {
      classes.push('xGalleryHasImages');
      classes.push(`xGalleryType-${galleryType}`);
    }

    return classes;
  }

  getNavigationItems(galleryItemsData, galleryItems) {
    const data = galleryItemsData.map((item, i) => {
      item = { ...item, ...galleryItems[i] };
      item.index = i + 1;

      if (item.type === 'video') {
        item.videoLink = item.original;
        item.src = item.poster.length ? item.poster.length : '#';
      }

      item.src += `?no_cache=${Date.now()}`;
      item.autoPlay =
        item['@attributes'] && item['@attributes'].autoplay
          ? item['@attributes'].autoplay
          : '0';

      return {
        ...item,
        ...{
          attributes: toHtmlAttributes({
            class: [
              `xType-${item.type}`,
              `xVideoHref-${item.videoLink ? item.videoLink : ''}`,
              `xAutoPlay-${item.autoPlay}`,
              `xOrigHref-${item.type === 'image' ? item.original : ''}`,
              `xW-${item.width}`,
              `xH-${item.height}`,
              `xImgIndex-${item.index}`,
            ].join(' '),
            'data-original-src': item.original,
            'data-original-width': item.original_width,
            'data-original-height': item.original_height,
            'data-caption': item.alt,
            'data-mobile-src': item.large_src,
            'data-mobile-width': item.large_width,
            'data-mobile-height': item.large_height,
            'data-srcset': item.srcset,
          }),
        },
      };
    });

    return data;
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
    return {
      isEditMode: true,
      isFullscreen: false,
      galleryClassList: this.getGalleryClassList(
        galleryItemsData,
        galleryType,
        null,
        null
      ),
      rowGalleryPadding:
        entry.mediaCacheData &&
        entry.mediaCacheData['@attributes'] &&
        entry.mediaCacheData['@attributes'].row_gallery_padding
          ? entry.mediaCacheData['@attributes'].row_gallery_padding
          : false,
      navigationItems: this.getNavigationItems(galleryItemsData, galleryItems),
    };
  }
}
