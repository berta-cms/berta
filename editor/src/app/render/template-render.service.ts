import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { AppState } from '../app-state/app.state';
import { AdditionalTextRenderService } from '../sites/sections/additional-text-render.service';
import { SectionHeadRenderService } from '../sites/sections/section-head-render.service';
import { SectionRenderService } from '../sites/sections/section-render.service';
import { SiteSectionsState } from '../sites/sections/sections-state/site-sections.state';
import { SiteSettingsState } from '../sites/settings/site-settings.state';
import { SitesHeaderRenderService } from '../sites/sites-header-render.service';
import { SitesMenuRenderService } from '../sites/sites-menu-render.service';
import { SitesState } from '../sites/sites-state/sites.state';
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
    public sectionHeadRenderService: SectionHeadRenderService,
    public sitesMenuRenderService: SitesMenuRenderService,
    public sitesHeaderRenderService: SitesHeaderRenderService,
    public additionalTextRenderService: AdditionalTextRenderService
  ) {}

  getViewData(): { [key: string]: any } {
    const user = this.store.selectSnapshot(UserState);
    const isShopAvailable = user.features.includes('shop');
    const appState = this.store.selectSnapshot(AppState);
    const siteSlug = this.store.selectSnapshot(AppState.getSite);
    const sectionSlug = this.store.selectSnapshot(AppState.getSection);
    const sites = this.store.selectSnapshot(SitesState);

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
      appState: appState,
      siteSettings: siteSettings,
      sections: sections,
      siteTemplateSettings: siteTemplateSettings,
      sectionSlug: sectionSlug,
      tagSlug: tagSlug,
      user: user,
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
      sitesMenu: this.sitesMenuRenderService.render(
        appState,
        user,
        siteSettings,
        templateName,
        siteTemplateSettings,
        sites
      ),
      siteHeader: this.sitesHeaderRenderService.render(
        siteSlug,
        siteSettings,
        templateName,
        siteTemplateSettings,
        isResponsive
      ),
      additionalTextBlock: this.additionalTextRenderService.render(
        appState,
        siteSlug,
        siteSettings,
        templateName,
        isResponsive
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
