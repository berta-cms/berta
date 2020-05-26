import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { take } from 'rxjs/operators';
import { TemplateSiteModel } from '../sites/template-settings/site-templates.interface';
import { SiteTemplatesState } from '../sites/template-settings/site-templates.state';

@Injectable({
  providedIn: 'root'
})
export class StyleService {
  styleSheet: CSSStyleSheet;
  templateConfig: TemplateSiteModel['templateConf'];

  constructor(
    private store: Store) {
  }

  initializeStyleSheet(styleSheet: CSSStyleSheet) {
    this.styleSheet = styleSheet;
    this.store.select(SiteTemplatesState.getCurrentTemplateConfig).pipe(take(1)).subscribe((templateConfig) => {
      this.templateConfig = templateConfig;
    });
  }

  updateStyle(style) {
    const settingGroup = this.templateConfig[style.group];
    if (!settingGroup) {
      return;
    }

    const setting = settingGroup[style.slug];
    if (!setting) {
      return;
    }

    if (!setting.css) {
      return;
    }

    setting.css.forEach(rule => {
      const cssRule = this.findOrCreateRule(rule.selector, rule.breakpoint);
      cssRule.style.setProperty(rule.property, style.value || setting.default);
    });
  }

  findOrCreateRule(selector: string, breakpoint: string): CSSStyleRule {
    let cssMediaRule: CSSMediaRule;
    let cssRulesList = this.styleSheet.cssRules;

    if (breakpoint) {
      cssMediaRule = Array.prototype.find.call(this.styleSheet.cssRules, (rule: CSSMediaRule) => {
        return rule.conditionText === breakpoint;
      });

      if (!cssMediaRule) {
        this.styleSheet.insertRule(`@media ${breakpoint} {}`, this.styleSheet.cssRules.length);
        cssMediaRule = this.styleSheet.cssRules[this.styleSheet.cssRules.length - 1] as CSSMediaRule;
      }

      cssRulesList = cssMediaRule.cssRules;
    }

    const cssRule = Array.prototype.find.call(cssRulesList, (rule: CSSStyleRule) => {
      return rule.selectorText === selector;
    });

    if (cssRule) {
      return cssRule;
    }

    if (breakpoint) {
      cssMediaRule.insertRule(`${selector} {}`, cssMediaRule.cssRules.length);
      return cssMediaRule.cssRules[cssMediaRule.cssRules.length - 1] as CSSStyleRule;
    } else {
      this.styleSheet.insertRule(`${selector} {}`, this.styleSheet.cssRules.length);
      return this.styleSheet.cssRules[this.styleSheet.cssRules.length - 1] as CSSStyleRule;
    }
  }
}
