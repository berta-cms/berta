import { Injectable } from '@angular/core';
import { getCookie, toHtmlAttributes } from '../../../app/shared/helpers';
import * as Template from '../../../templates/Sites/Sections/sectionBackgroundGallery.twig';
import { SiteSectionStateModel } from './sections-state/site-sections-state.model';

@Injectable({
  providedIn: 'root',
})
export class BackgroundGalleryRenderService {
  USED_IN_TEMPLATES = ['messy'];

  getWrapperAttributes(currentSection: SiteSectionStateModel) {
    let classes = [
      `xBgDataAutoplay-${
        currentSection.mediaCacheData &&
        currentSection.mediaCacheData['@attributes'] &&
        currentSection.mediaCacheData['@attributes'].autoplay
          ? currentSection.mediaCacheData['@attributes'].autoplay
          : ''
      }`,
      `xBgDataImageSize-${
        currentSection.mediaCacheData &&
        currentSection.mediaCacheData['@attributes'] &&
        currentSection.mediaCacheData['@attributes'].image_size
          ? currentSection.mediaCacheData['@attributes'].image_size
          : ''
      }`,
      'xBgDataFading-',
      `xBgDataAnimation-${
        currentSection.mediaCacheData &&
        currentSection.mediaCacheData['@attributes'] &&
        currentSection.mediaCacheData['@attributes'].animation
          ? currentSection.mediaCacheData['@attributes'].animation
          : ''
      }`,
    ];

    return toHtmlAttributes({
      id: 'xBackground',
      class: classes.join(' '),
      style: currentSection.sectionBgColor
        ? `background-color: ${currentSection.sectionBgColor}`
        : null,
    });
  }

  getGalleryItems(siteSlug: string, currentSection: SiteSectionStateModel) {
    const selectedGridImage = getCookie('_berta_grid_img_link');
    const currentItemIndex = currentSection.mediaCacheData.file.findIndex(
      (item) => item['@attributes'].src === selectedGridImage
    );

    const items = currentSection.mediaCacheData.file.map((item, index) => {
      let captionStyles: string[] = [];

      if (
        currentSection.mediaCacheData['@attributes'] &&
        currentSection.mediaCacheData['@attributes'].caption_bg_color
      ) {
        captionStyles.push(
          `background-color: ${currentSection.mediaCacheData['@attributes'].caption_bg_color}`
        );
      }

      if (
        currentSection.mediaCacheData['@attributes'] &&
        currentSection.mediaCacheData['@attributes'].caption_color
      ) {
        captionStyles.push(
          `color: ${currentSection.mediaCacheData['@attributes'].caption_color}`
        );
      }

      return {
        caption: currentItemIndex > -1 ? '' : item['@value'],
        captionClass: {
          class:
            currentItemIndex === -1 && index === 0 && item['@value'].length > 1
              ? 'sel'
              : '',
        },
        imageClass: toHtmlAttributes({
          class: currentItemIndex === index ? 'sel' : '',
        }),
        captionStyles: toHtmlAttributes({
          style: captionStyles.join(';'),
        }),
        image: item['@attributes'].src,
        src: `/storage/${siteSlug.length ? `-sites/${siteSlug}/` : ''}media/${
          currentSection.mediafolder
        }/_bg_${item['@attributes'].src}`,
        width: item['@attributes'].width,
        height: item['@attributes'].height,
      };
    });

    const current = currentItemIndex > -1 ? items[currentItemIndex] : items[0];
    return {
      all: items,
      current: current,
    };
  }

  getViewData(
    siteSlug: string,
    currentSection: SiteSectionStateModel,
    isResponsive: boolean
  ) {
    const items = this.getGalleryItems(siteSlug, currentSection);
    const showNavigation =
      items.all.length > 1 || items.all[0].caption.length > 0;
    const showNavigationArrows =
      !isResponsive &&
      (!currentSection.mediaCacheData['@attributes'] ||
        (currentSection.mediaCacheData['@attributes'] &&
          currentSection.mediaCacheData['@attributes'].hide_navigation &&
          currentSection.mediaCacheData['@attributes'].hide_navigation ==
            'no'));
    return {
      wrapperAttributes: this.getWrapperAttributes(currentSection),
      items: items,
      showDesktopNavigation: showNavigation,
      showSlideCounters: showNavigationArrows,
      showMobileNavigationArrows: showNavigation && showNavigationArrows,
    };
  }

  render(
    siteSlug: string,
    templateName: string,
    currentSection: SiteSectionStateModel,
    currentSectionType: string,
    isResponsive: boolean
  ) {
    if (
      !this.USED_IN_TEMPLATES.includes(templateName) ||
      !currentSection ||
      !currentSection.mediaCacheData ||
      !currentSection.mediaCacheData.file ||
      currentSection.mediaCacheData.file.length < 1 ||
      (currentSectionType === 'grid' && !!getCookie('_berta_grid_view'))
    ) {
      return '';
    }

    const viewData = this.getViewData(siteSlug, currentSection, isResponsive);

    const htmlOutput = Template(viewData);

    return htmlOutput;
  }
}
