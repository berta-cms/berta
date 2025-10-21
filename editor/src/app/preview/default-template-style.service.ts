import { Injectable } from '@angular/core';
import { SettingsGroupModel } from '../shared/interfaces';
import { SiteStateModel } from '../sites/sites-state/site-state.model';

@Injectable({
  providedIn: 'root',
})
export class DefaultTemplateStyleService {
  getCSSList(
    style,
    cssList,
    site: SiteStateModel,
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

    if (style.group === 'pageLayout' && style.slug === 'contentPosition') {
      cssList.push({
        selector: '#contentContainer',
        property: 'margin-left',
        value: style.value === 'left' ? '0' : 'auto',
      });
      cssList.push({
        selector: '#contentContainer',
        property: 'margin-right',
        value: style.value === 'right' ? '0' : 'auto',
      });
    }

    if (style.group === 'pageLayout' && style.slug === 'contentAlign') {
      const contentFloat = style.value.endsWith('left') ? 'left' : 'right';
      const contentTextAlign = style.value.startsWith('justify')
        ? 'justify'
        : style.value;

      cssList = [
        ...cssList,
        ...[
          {
            selector: 'body',
            property: 'text-align',
            value: contentFloat,
          },
          {
            selector: 'h1',
            property: 'float',
            value: contentFloat,
          },
          {
            selector: '.bt-sections-menu ul',
            property: 'text-align',
            value: contentFloat,
          },
          {
            selector: '#pageEntries',
            property: 'margin',
            value: contentFloat === 'left' ? '0' : '0 0 0 auto',
          },
          {
            selector: '#pageEntries li.xEntry h2',
            property: 'float',
            value: contentFloat,
          },
          {
            selector: '#pageEntries li.xEntry p.shortDesc',
            property: 'clear',
            value: contentFloat,
          },
          {
            selector: '#pageEntries li.xEntry .xGalleryContainer',
            property: 'clear',
            value: contentFloat,
          },
          {
            selector: '#pageEntries li.xEntry .xGalleryContainer',
            property: 'margin',
            value: contentFloat === 'left' ? '0' : '0 0 0 auto',
          },
          {
            selector: '#pageEntries .xGalleryContainer ul.xGalleryNav li',
            property: 'float',
            value: contentFloat,
          },
          {
            selector: '#pageEntries .xGalleryContainer ul.xGalleryNav li',
            property: 'padding',
            value: contentFloat === 'left' ? '0 5px 0 0' : '0 0 0 5px',
          },
          {
            selector: '#pageEntries li.xEntry .entryText',
            property: 'float',
            value: contentFloat,
          },
          {
            selector: '#pageEntries li.xEntry .entryContent table',
            property: 'float',
            value: contentFloat,
          },
          {
            selector: '#pageEntries li.xEntry .entryContent .items',
            property: 'float',
            value: contentFloat,
          },
          {
            selector: '#pageEntries li.xEntry .entryContent p.itm',
            property: 'float',
            value: contentFloat,
          },
          {
            selector: '#pageEntries li.xEntry .entryContent .tagsList div',
            property: 'float',
            value: contentFloat,
            important: true,
          },
          {
            selector: '#pageEntries li.xEntry .entryText',
            property: 'text-align',
            value: contentTextAlign,
          },
        ],
      ];
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
