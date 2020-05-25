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
      cssRule.style.setProperty(rule.property, style.value);
    });


    console.log(this.styleSheet);
  }

  findOrCreateRule(selector: string, breakpoint: string): CSSStyleRule {
    // @todo implement breakpoint usage

    const cssRule = Array.prototype.find.call(this.styleSheet.cssRules, (rule: CSSStyleRule) => {
      return rule.selectorText === selector;
    });

    if (cssRule) {
      return cssRule;
    }

    const insertIndex = this.styleSheet.cssRules.length;
    this.styleSheet.insertRule(`${selector} {}`, insertIndex);

    return this.styleSheet.cssRules[insertIndex] as CSSStyleRule;
  }
}
