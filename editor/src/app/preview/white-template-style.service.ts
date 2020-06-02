import { Injectable } from '@angular/core';
import { SettingsGroupModel } from '../shared/interfaces';
import { SiteStateModel } from '../sites/sites-state/site-state.model';

@Injectable({
  providedIn: 'root'
})
export class WhiteTemplateStyleService {

  constructor() { }

  getCSSList(style, cssList, site: SiteStateModel, templateSettings: SettingsGroupModel[]) {
    if (style.group === 'background' && style.slug === 'backgroundImageEnabled') {
      const isBackgroundImageEnabled = style.value === 'yes';
      const backgroundImage = this.getSettingValue(templateSettings, 'background', 'backgroundImage');

      cssList.push(
        {
          selector: 'body',
          property: 'background-image',
          value: isBackgroundImageEnabled && backgroundImage ? `url(${site.mediaUrl}/${backgroundImage})` : 'none'
        }
      );
    }

    if (style.group === 'background' && style.slug === 'backgroundImage') {
      const isBackgroundImageEnabled = this.getSettingValue(templateSettings, 'background', 'backgroundImageEnabled') === 'yes';
      cssList = cssList.map(item => {
        return {
          ...item,
          value: isBackgroundImageEnabled && style.value ? `url(${site.mediaUrl}/${style.value})` : 'none'
        };
      });
    }

    if (style.group === 'background' && style.slug === 'backgroundAttachment') {
      cssList.push(
        {
          selector: 'body',
          property: 'background-attachment',
          value: style.value === 'fill' ? 'fixed' : style.value
        }
      );
      cssList.push(
        {
          selector: 'body',
          property: 'background-size',
          value: style.value === 'fill' ? 'cover' : 'auto'
        }
      );
    }

    return cssList;
  }

  getSettingValue(templateSettings: SettingsGroupModel[], group: string, slug: string) {
    return templateSettings.find(g => g.slug === group).settings.find(s => s.slug === slug).value;
  }
}
