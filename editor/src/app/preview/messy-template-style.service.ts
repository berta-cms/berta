import { Injectable } from '@angular/core';
import { SettingsGroupModel } from '../shared/interfaces';
import { SiteStateModel } from '../sites/sites-state/site-state.model';

@Injectable({
  providedIn: 'root',
})
export class MessyTemplateStyleService {
  getCSSList(
    style,
    cssList,
    site: SiteStateModel,
    template: string,
    templateSettings: SettingsGroupModel[],
  ) {
    if (
      style.group === 'background' &&
      style.slug === 'backgroundImageEnabled'
    ) {
      const isBackgroundImageEnabled = style.value === 'yes';
      const backgroundImage = this.getSettingValue(
        templateSettings,
        'background',
        'backgroundImage',
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
          'backgroundImageEnabled',
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

    if (style.group === 'grid' && style.slug === 'contentWidth') {
      cssList.push({
        selector: '#xGridView',
        property: 'left',
        value: `${(100 - parseInt(style.value, 10)) / 2}%`,
      });
      cssList.push({
        selector: '#xGridView',
        property: 'right',
        value: `${(100 - parseInt(style.value, 10)) / 2}%`,
      });
      cssList.push({
        selector: '#xGridView',
        property: 'width',
        value: style.value,
      });
    }

    if (style.group === 'pageLayout' && style.slug === 'bgButtonType') {
      const templatePath = `/_templates/${template}`;
      cssList = [
        ...cssList,
        ...[
          {
            selector: '#xBackground #xBackgroundLoader',
            property: 'background',
            value: `url(${templatePath}/layout/loader_${style.value}.gif) no-repeat`,
          },
          {
            selector: '#xBackground #xBackgroundRight',
            property: 'cursor',
            value: `url(${templatePath}/layout/arrow_right_${style.value}.gif), pointer`,
          },
          {
            selector: '#xBackground #xBackgroundLeft',
            property: 'cursor',
            value: `url(${templatePath}/layout/arrow_left_${style.value}.gif), pointer`,
          },
          {
            selector: '#xBackground #xBackgroundRightCounter .counterContent',
            property: 'cursor',
            value: `url(${templatePath}/layout/arrow_right_${style.value}.gif), pointer`,
          },
          {
            selector: '#xBackground #xBackgroundLeftCounter .counterContent',
            property: 'cursor',
            value: `url(${templatePath}/layout/arrow_left_${style.value}.gif), pointer`,
          },
          {
            selector: '#xBackgroundNext a',
            property: 'background',
            value: `url(${templatePath}/layout/bg_nav_buttons_${style.value}.png)`,
          },
          {
            selector: '#xBackgroundPrevious a',
            property: 'background',
            value: `url(${templatePath}/layout/bg_nav_buttons_${style.value}.png)`,
          },
          {
            selector: '#xGridViewTriggerContainer a',
            property: 'background',
            value: `url(${templatePath}/layout/bg_nav_buttons_${style.value}.png)`,
          },
        ],
      ];
    }

    if (style.group === 'pageLayout' && style.slug === 'centeringGuidesColor') {
      cssList.push({
        selector: '.xCenteringGuide',
        property: 'background-color',
        value:
          style.value === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)',
      });
    }

    if (style.group === 'entryLayout' && style.slug === 'contentWidth') {
      cssList.push({
        selector: '#xBackground .visual-caption',
        property: 'margin-left',
        value: `-${parseInt(style.value, 10) / 2}px`,
      });
    }

    return cssList;
  }

  getSettingValue(
    templateSettings: SettingsGroupModel[],
    group: string,
    slug: string,
  ) {
    return templateSettings
      .find((g) => g.slug === group)
      .settings.find((s) => s.slug === slug).value;
  }
}
