import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { AppState } from '../app-state/app.state';
import { toHtmlAttributes } from '../shared/helpers';
import { AdditionalTextRenderService } from '../sites/sections/additional-text-render.service';
import { SectionHeadRenderService } from '../sites/sections/section-head-render.service';
import { SectionRenderService } from '../sites/sections/section-render.service';
import { SectionsMenuRenderService } from '../sites/sections/sections-menu-render.service';
import { SiteSectionsState } from '../sites/sections/sections-state/site-sections.state';
import { SectionTagsService } from '../sites/sections/tags/section-tags.service';
import { SectionTagsState } from '../sites/sections/tags/section-tags.state';
import { SiteSettingsState } from '../sites/settings/site-settings.state';
import { SitesBannersRenderService } from '../sites/sites-banners-render.service';
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
    public additionalTextRenderService: AdditionalTextRenderService,
    public sectionsMenuRenderService: SectionsMenuRenderService,
    public sectionTagsService: SectionTagsService,
    public sitesBannersRenderService: SitesBannersRenderService
  ) {}

  getUserCopyright(siteSlug, siteSettings) {
    const content =
      siteSettings.siteTexts && siteSettings.siteTexts.siteFooter
        ? siteSettings.siteTexts.siteFooter
        : '';
    const attributes = {
      class: 'xEditableTA xProperty-siteFooter',
      'data-path': `${siteSlug}/settings/siteTexts/siteFooter`,
    };

    return {
      content: content,
      attributes: toHtmlAttributes(attributes),
    };
  }

  getBertaCopyright(siteSettings, user) {
    const hideBertaCopyright =
      siteSettings.settings.hideBertaCopyright === 'yes';

    if (hideBertaCopyright && user.features.includes('hide_berta_copyright')) {
      return '';
    }

    // @todo: load current language translation here, we don't have all translations in state
    return 'Built with <a href="http://www.berta.me/" target="_blank" title="Create your own website with Berta.me in minutes!">Berta.me</a>';
  }

  getViewData(): { [key: string]: any } {
    const user = this.store.selectSnapshot(UserState);
    const isShopAvailable = user.features.includes('shop');
    const appState = this.store.selectSnapshot(AppState);
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
    const siteSlug = this.store.selectSnapshot(AppState.getSite);
    const sectionSlug = this.store.selectSnapshot(AppState.getSection);
    const sites = this.store.selectSnapshot(SitesState);
    const sectionTags = this.store.selectSnapshot(
      SectionTagsState.getCurrentSiteTags
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
    const selectedTag = this.store.selectSnapshot(AppState.getTag);
    const tagSlug = this.sectionTagsService.getCurrentTag(
      siteSettings,
      sectionTags,
      currentSection,
      selectedTag
    );

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
      sectionsMenu: this.sectionsMenuRenderService.render(
        siteSlug,
        sections,
        sectionSlug,
        templateName,
        siteTemplateSettings,
        sectionTags,
        tagSlug
      ),
      siteBanners: this.sitesBannersRenderService.render(
        siteSlug,
        siteSettings,
        isResponsive
      ),
      userCopyright: this.getUserCopyright(siteSlug, siteSettings),
      bertaCopyright: this.getBertaCopyright(siteSettings, user),
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
