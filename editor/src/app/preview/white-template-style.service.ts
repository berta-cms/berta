import { Injectable } from '@angular/core';
import { SettingsGroupModel } from '../shared/interfaces';
import { SiteStateModel } from '../sites/sites-state/site-state.model';

@Injectable({
  providedIn: 'root',
})
export class WhiteTemplateStyleService {
  constructor() {}

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
      style.group === 'pageLayout' &&
      ['contentWidth', 'paddingLeft', 'leftColumnWidth'].indexOf(style.slug) >
        -1
    ) {
      const contentWidth: number = parseInt(
        this.getSettingValue(
          templateSettings,
          'pageLayout',
          'contentWidth'
        ) as string,
        10
      );
      const leftColumnWidth: number = parseInt(
        this.getSettingValue(
          templateSettings,
          'pageLayout',
          'leftColumnWidth'
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

      cssList.push({
        selector: '#allContainer.xCentered',
        property: 'max-width',
        value: `${contentWidth + leftColumnWidth + paddingLeft}px`,
      });

      cssList.push({
        selector: '#sideColumn.xCentered',
        property: 'margin-left',
        value: `-${(contentWidth + leftColumnWidth + paddingLeft) / 2}px`,
      });

      cssList.push({
        selector: '#mainColumn.xCentered',
        property: 'margin-left',
        value: `-${
          (leftColumnWidth + contentWidth + paddingLeft) / 2 - leftColumnWidth
        }px`,
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
