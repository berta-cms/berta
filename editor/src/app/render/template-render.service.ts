import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { AppState } from '../app-state/app.state';
import { SectionHeadRenderService } from '../sites/sections/section-head-render.service';
import { SectionRenderService } from '../sites/sections/section-render.service';
import { SiteSectionsState } from '../sites/sections/sections-state/site-sections.state';
import { SiteSettingsState } from '../sites/settings/site-settings.state';
import { SiteTemplateSettingsState } from '../sites/template-settings/site-template-settings.state';
import { SiteTemplatesState } from '../sites/template-settings/site-templates.state';
import { UserState } from '../user/user.state';

@Injectable({
  providedIn: 'root',
})
export class TemplateRenderService {
  constructor(
    public readonly store: Store,
    public sectionRenderService: SectionRenderService,
    public sectionHeadRenderService: SectionHeadRenderService
  ) {}

  getViewData(): { [key: string]: any } {
    const appState = this.store.selectSnapshot(AppState);
    const siteSlug = this.store.selectSnapshot(AppState.getSite);
    const sectionSlug = this.store.selectSnapshot(AppState.getSection);

    // @todo: get first tag in list if no tag selected
    const tagSlug = this.store.selectSnapshot(AppState.getTag);

    const siteSettings: { [key: string]: { [key: string]: any } } = this.store
      .selectSnapshot(SiteSettingsState.getCurrentSiteSettings)
      .reduce((settings, settingGroup) => {
        settingGroup.settings.forEach((setting) => {
          settings = {
            ...settings,
            [settingGroup.slug]: {
              ...settings[settingGroup.slug],
              [setting.slug]: setting.value,
            },
          };
        });

        return settings;
      }, {});

    const templateName = this.store
      .selectSnapshot(SiteSettingsState.getCurrentSiteTemplate)
      .split('-')[0];

    const siteTemplateSettings: { [key: string]: { [key: string]: any } } =
      this.store
        .selectSnapshot(
          SiteTemplateSettingsState.getCurrentSiteTemplateSettings
        )
        .reduce((settings, settingGroup) => {
          settingGroup.settings.forEach((setting) => {
            settings = {
              ...settings,
              [settingGroup.slug]: {
                ...settings[settingGroup.slug],
                [setting.slug]: setting.value,
              },
            };
          });
          return settings;
        }, {});

    const siteTemplatesConfig = this.store.selectSnapshot(
      SiteTemplatesState.getCurrentTemplateConfig
    );

    const siteTemplateSectionTypes = this.store.selectSnapshot(
      SiteTemplatesState.getCurrentTemplateSectionTypes
    );

    const sections = this.store.selectSnapshot(
      SiteSectionsState.getCurrentSiteSections
    );

    const user = this.store.selectSnapshot(UserState);
    const isShopAvailable = user.features.includes('shop');

    const currentSection = this.sectionRenderService.getCurrentSection(
      sections,
      sectionSlug
    );

    const currentSectionType =
      this.sectionRenderService.getCurrentSectionType(currentSection);

    const isResponsiveTemplate =
      siteTemplateSettings.pageLayout.responsive === 'yes';

    const isResponsive =
      isResponsiveTemplate ||
      (currentSectionType === 'portfolio' && templateName === 'messy');

    const isAutoResponsive =
      !isResponsive &&
      siteTemplateSettings.pageLayout &&
      siteTemplateSettings.pageLayout.autoResponsive === 'yes';

    const viewData = {
      siteSettings: siteSettings,
      sections: sections,
      siteTemplateSettings: siteTemplateSettings,
      sectionSlug: sectionSlug,
      tagSlug: tagSlug,

      sectionHead: this.sectionHeadRenderService.render(
        appState,
        siteSlug,
        sections,
        currentSection,
        currentSectionType,
        sectionSlug,
        siteSettings,
        templateName,
        siteTemplateSettings,
        siteTemplatesConfig,
        siteTemplateSectionTypes,
        isShopAvailable,
        isResponsive,
        isAutoResponsive,
        user
      ),
    };

    return viewData;
  }

  replaceIframeContent(contentWindow: Window, html: string) {
    Array.from(contentWindow.document.childNodes).forEach((node) =>
      node.remove()
    );

    contentWindow.document.open();
    contentWindow.document.write(html);
    contentWindow.document.close();
  }
}
