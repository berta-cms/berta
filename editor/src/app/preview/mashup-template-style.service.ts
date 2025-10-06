import { Injectable } from '@angular/core';
import { SettingsGroupModel } from '../shared/interfaces';
import { SiteStateModel } from '../sites/sites-state/site-state.model';

@Injectable({
  providedIn: 'root',
})
export class MashupTemplateStyleService {
  getCSSList(
    style,
    cssList,
    site: SiteStateModel,
    templateSettings: SettingsGroupModel[]
  ) {
    if (
      style.group === 'background' &&
      style.slug === 'backgroundImageEnabled'
    ) {
      const isBackgroundImageEnabled = style.value === 'yes';
      const backgroundImage = this.getSettingValue(
        templateSettings,
        'background',
        'backgroundImage'
      );

      cssList.push({
        selector: 'body',
        property: 'background-image',
        value:
          isBackgroundImageEnabled && backgroundImage
            ? `url(${site.mediaUrl}/${backgroundImage})`
            : 'none',
      });
    }

    if (style.group === 'background' && style.slug === 'backgroundImage') {
      const isBackgroundImageEnabled =
        this.getSettingValue(
          templateSettings,
          'background',
          'backgroundImageEnabled'
        ) === 'yes';
      cssList = cssList.map((item) => {
        return {
          ...item,
          value:
            isBackgroundImageEnabled && style.value
              ? `url(${site.mediaUrl}/${style.value})`
              : 'none',
        };
      });
    }

    if (style.group === 'background' && style.slug === 'backgroundAttachment') {
      cssList.push({
        selector: 'body',
        property: 'background-attachment',
        value: style.value === 'fill' ? 'fixed' : style.value,
      });
      cssList.push({
        selector: 'body',
        property: 'background-size',
        value: style.value === 'fill' ? 'cover' : 'auto',
      });
    }

    if (
      (style.group === 'pageLayout' &&
        ['contentWidth', 'paddingLeft'].indexOf(style.slug) > -1) ||
      (style.group === 'sideBar' && style.slug === 'width')
    ) {
      const contentWidth: number = parseInt(
        this.getSettingValue(
          templateSettings,
          'pageLayout',
          'contentWidth'
        ) as string,
        10
      );
      const paddingLeft: number = parseInt(
        this.getSettingValue(
          templateSettings,
          'pageLayout',
          'paddingLeft'
        ) as string,
        10
      );
      const sideBarWidth: number = parseInt(
        this.getSettingValue(templateSettings, 'sideBar', 'width') as string,
        10
      );

      cssList.push({
        selector: '#allContainer.xCentered',
        property: 'max-width',
        value: `${contentWidth + paddingLeft + sideBarWidth}px`,
      });

      cssList.push({
        selector: '#sideColumn.xCentered',
        property: 'margin-left',
        value: `-${(contentWidth + paddingLeft + sideBarWidth) / 2}px`,
      });

      cssList.push({
        selector: '#mainColumn.xCentered',
        property: 'margin-left',
        value: `-${
          (contentWidth + paddingLeft + sideBarWidth) / 2 - sideBarWidth
        }px`,
      });
    }

    if (style.group === 'firstPage' && style.slug === 'imageHaveShadows') {
      const imageHaveShadows = style.value === 'yes';
      const value = imageHaveShadows ? '5px 5px 2px #ccc' : 'none';
      cssList.push({
        selector: '.firstPagePic img',
        property: 'box-shadow',
        value: value,
      });
      cssList.push({
        selector: '.firstPagePic video',
        property: 'box-shadow',
        value: value,
      });
    }

    if (
      style.group === 'sideBar' &&
      ['backgroundColor', 'transparent'].indexOf(style.slug) > -1
    ) {
      const isTransparent =
        this.getSettingValue(templateSettings, 'sideBar', 'transparent') ===
        'yes';
      const backgroundColor = this.getSettingValue(
        templateSettings,
        'sideBar',
        'backgroundColor'
      );
      cssList.push({
        selector: '#sideColumn',
        property: 'background-color',
        value: isTransparent ? 'transparent' : backgroundColor,
      });
    }

    return cssList;
  }

  getSettingValue(
    templateSettings: SettingsGroupModel[],
    group: string,
    slug: string
  ) {
    return templateSettings
      .find((g) => g.slug === group)
      .settings.find((s) => s.slug === slug).value;
  }
}
