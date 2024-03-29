import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { take } from 'rxjs/operators';
import * as WebFont from 'webfontloader';
import { TemplateSiteModel } from '../sites/template-settings/site-templates.interface';
import { SettingsGroupModel } from '../shared/interfaces';
import { SiteTemplatesState } from '../sites/template-settings/site-templates.state';
import { WhiteTemplateStyleService } from './white-template-style.service';
import { DefaultTemplateStyleService } from './default-template-style.service';
import { MashupTemplateStyleService } from './mashup-template-style.service';
import { MessyTemplateStyleService } from './messy-template-style.service';
import { SiteStateModel } from '../sites/sites-state/site-state.model';
import {
  ShopSettingsConfigModel,
  ShopSettingsConfigState,
} from '../shop/settings/shop-settings-config.state';

@Injectable({
  providedIn: 'root',
})
export class StyleService {
  contextWindow: Window;
  styleSheet: CSSStyleSheet;
  templateConfig: TemplateSiteModel['templateConf'];
  shopSettingsConfig: ShopSettingsConfigModel;

  constructor(
    private store: Store,
    private whiteTemplateStyleService: WhiteTemplateStyleService,
    private defaultTemplateStyleService: DefaultTemplateStyleService,
    private mashupTemplateStyleService: MashupTemplateStyleService,
    private messyTemplateStyleService: MessyTemplateStyleService
  ) {}

  initializeStyleSheet(contextWindow: Window, styleSheet: CSSStyleSheet) {
    this.contextWindow = contextWindow;
    this.styleSheet = styleSheet;
    this.store
      .select(SiteTemplatesState.getCurrentTemplateConfig)
      .pipe(take(1))
      .subscribe((templateConfig) => {
        this.templateConfig = templateConfig;
      });

    this.store
      .select(ShopSettingsConfigState)
      .pipe(take(1))
      .subscribe((shopSettingsConfig) => {
        this.shopSettingsConfig = shopSettingsConfig;
      });
  }

  updateStyle(
    site: SiteStateModel,
    template: string,
    style,
    templateSettings: SettingsGroupModel[]
  ) {
    const settingGroup = this.templateConfig[style.group];
    if (!settingGroup) {
      return;
    }

    const setting = settingGroup[style.slug];
    if (!setting) {
      return;
    }

    if (!style.value) {
      style.value = setting.default;
    }

    let cssList = setting.css ? [...setting.css] : [];
    const templateName = template.split('-')[0];
    switch (templateName) {
      case 'white':
        cssList = this.whiteTemplateStyleService.getCSSList(
          style,
          cssList,
          site,
          templateSettings
        );
        break;

      case 'default':
        cssList = this.defaultTemplateStyleService.getCSSList(
          style,
          cssList,
          site,
          templateSettings
        );
        break;

      case 'mashup':
        cssList = this.mashupTemplateStyleService.getCSSList(
          style,
          cssList,
          site,
          templateSettings
        );
        break;

      // Messy
      default:
        cssList = this.messyTemplateStyleService.getCSSList(
          style,
          cssList,
          site,
          template,
          templateSettings
        );
        break;
    }

    cssList = this.updateFontFamily(style, cssList, templateSettings);

    if (cssList.length < 1) {
      return;
    }

    cssList.forEach((rule) => {
      const cssRule = this.findOrCreateRule(rule.selector, rule.breakpoint);
      let value = rule.value || style.value;
      if (rule.template) {
        value = eval(rule.template);
      }
      cssRule.style.setProperty(
        rule.property,
        value,
        rule.important ? 'important' : null
      );
    });
  }

  updateShopStyle(style, templateSettings: SettingsGroupModel[]) {
    const settingGroup = this.shopSettingsConfig[style.group];
    if (!settingGroup) {
      return;
    }

    const setting = settingGroup[style.slug];
    if (!setting) {
      return;
    }

    if (!style.value) {
      style.value = setting.default;
    }

    let cssList = setting.css ? [...setting.css] : [];

    cssList = this.updateFontFamily(style, cssList, templateSettings);

    if (cssList.length < 1) {
      return;
    }

    cssList.forEach((rule) => {
      const cssRule = this.findOrCreateRule(rule.selector, rule.breakpoint);
      let value = rule.value || style.value;
      if (rule.template) {
        value = eval(rule.template);
      }
      cssRule.style.setProperty(
        rule.property,
        value,
        rule.important ? 'important' : null
      );
    });
  }

  findOrCreateRule(selector: string, breakpoint: string): CSSStyleRule {
    let cssMediaRule: CSSMediaRule;
    let cssRulesList = this.styleSheet.cssRules;

    if (breakpoint) {
      cssMediaRule = Array.prototype.find.call(
        this.styleSheet.cssRules,
        (rule: CSSMediaRule) => {
          return rule.conditionText === breakpoint;
        }
      );

      if (!cssMediaRule) {
        this.styleSheet.insertRule(
          `@media ${breakpoint} {}`,
          this.styleSheet.cssRules.length
        );
        cssMediaRule = this.styleSheet.cssRules[
          this.styleSheet.cssRules.length - 1
        ] as CSSMediaRule;
      }

      cssRulesList = cssMediaRule.cssRules;
    }

    const cssRule = Array.prototype.find.call(
      cssRulesList,
      (rule: CSSStyleRule) => {
        return rule.selectorText === selector;
      }
    );

    if (cssRule) {
      return cssRule;
    }

    if (breakpoint) {
      cssMediaRule.insertRule(`${selector} {}`, cssMediaRule.cssRules.length);
      return cssMediaRule.cssRules[
        cssMediaRule.cssRules.length - 1
      ] as CSSStyleRule;
    } else {
      this.styleSheet.insertRule(
        `${selector} {}`,
        this.styleSheet.cssRules.length
      );
      return this.styleSheet.cssRules[
        this.styleSheet.cssRules.length - 1
      ] as CSSStyleRule;
    }
  }

  updateFontFamily(style, cssList, templateSettings: SettingsGroupModel[]) {
    const fontSettings = ['fontFamily', 'googleFont'];
    if (!fontSettings.some((setting) => style.slug.endsWith(setting))) {
      return cssList;
    }

    const googleFontSetting = templateSettings
      .find((g) => g.slug === style.group)
      .settings.find((s) => s.slug.endsWith('googleFont'));
    const generalFontSetting = templateSettings
      .find((g) => g.slug === style.group)
      .settings.find((s) => s.slug.endsWith('fontFamily'));
    if (!googleFontSetting || !googleFontSetting.value) {
      return cssList.map((item) => {
        return {
          ...item,
          value: generalFontSetting.value,
        };
      });
    }

    let fontName: string, fontStyle: string;
    [fontName, fontStyle] = (googleFontSetting.value as string).split(':');

    WebFont.load({
      google: {
        families: [
          `${googleFontSetting.value}:latin,latin-ext,cyrillic-ext,greek-ext,greek,vietnamese,cyrillic`,
        ],
      },
      context: this.contextWindow,
    });

    return cssList.map((item) => {
      return {
        ...item,
        value: fontName,
      };
    });
  }
}
