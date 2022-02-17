import { Injectable } from '@angular/core';
import * as Template from '../../templates/Sites/sitesBanners.twig';
import { toHtmlAttributes, toImageHtmlAttributes } from '../shared/helpers';

@Injectable({
  providedIn: 'root',
})
export class SitesBannersRenderService {
  getClassList(banner, isResponsive) {
    let classes = ['floating-banner', `banner-${banner.index}`];

    if (!isResponsive) {
      classes.push('xEditableDragXY');
      classes.push(`xProperty-banner${banner.index}XY`);
    }

    return classes.join(' ');
  }

  getStyleList(banner, siteSettings, isResponsive) {
    if (isResponsive) {
      return '';
    }

    const posXY = `banner${banner.index}XY`;
    const [left, top] =
      siteSettings.siteTexts && siteSettings.siteTexts[posXY]
        ? siteSettings.siteTexts[posXY].split(',')
        : [
            Math.floor(Math.random() * 960 + 1),
            Math.floor(Math.random() * 600 + 1),
          ];

    return `left:${left}px;top:${top}px`;
  }

  getAttributes(banner, siteSettings, siteSlug, isResponsive) {
    return toHtmlAttributes({
      class: this.getClassList(banner, isResponsive),
      style: this.getStyleList(banner, siteSettings, isResponsive),
      'data-path': !isResponsive
        ? `${siteSlug}/settings/siteTexts/banner${banner.index}XY`
        : '',
    });
  }

  getImageAttributes(banner, siteSlug) {
    const width = banner.image_width || null;
    const height = banner.image_height || null;

    console.log({ width, height });

    return toImageHtmlAttributes(siteSlug, {
      filename: banner.image,
      width,
      height,
    });
  }

  getViewData(siteSlug, siteSettings, isResponsive) {
    const banners = Object.entries(siteSettings.banners)
      .reduce((banners, banner) => {
        const [key, value] = banner;
        const [keyPart, property] = key.split(/_(.+)/);
        const index = parseInt(keyPart.substring(6), 10);

        banners[index] = {
          ...banners[index],
          ...{ index: index, [property]: value },
        };

        return banners;
      }, [])
      .filter((banner) => banner.image.length > 0)
      .map((banner) => {
        return {
          ...banner,
          ...{
            attributes: this.getAttributes(
              banner,
              siteSettings,
              siteSlug,
              isResponsive
            ),
            imageAttributes: this.getImageAttributes(banner, siteSlug),
          },
        };
      });

    return {
      banners: banners,
      isResponsive: isResponsive,
      isEditMode: true,
    };
  }

  render(siteSlug, siteSettings, isResponsive) {
    const viewData = this.getViewData(siteSlug, siteSettings, isResponsive);
    const htmlOutput = Template(viewData);

    return htmlOutput;
  }
}
