import { Injectable } from '@angular/core';
import { TemplateRerenderService } from '../template-rerender.service';
import { Actions, ofActionSuccessful } from '@ngxs/store';
import { MessyTemplateRenderService } from '../../render/messy-template-render.service';
import { SiteSettingChildrenHandler } from '../types/components';
import { HandleSiteSettingsChildrenChangesAction } from '../../sites/settings/site-settings.actions';
import { replaceContent } from '../utilities/content';
import { PageLayoutService } from './page-layout.service';
import { HandleSiteTemplateSettingsAction } from '../../sites/template-settings/site-template-settings.actions';

@Injectable({
  providedIn: 'root',
})
export class MessyTemplateRerenderService extends TemplateRerenderService {
  /* config for live settings re-rendering.
  'id' is id of the wrapper element. All content inside will be replaced with a new one
  'dataKey' is a key of re-rendered data from 'viewData' object
   */
  private static readonly SETTINGS_IDS_DATA_KEYS: SiteSettingChildrenHandler = {
    socialMediaComp: [
      { id: 'additionalTextBlock', dataKey: 'additionalTextBlock' },
      { id: 'additionalFooterTextBlock', dataKey: 'additionalFooterText' },
      { id: 'sectionFooter', dataKey: 'sectionFooter' },
    ],
    media: { id: 'pageEntries', dataKey: 'entries' },
    banners: { id: 'siteBanners', dataKey: 'siteBanners' },
    settings: { id: 'sectionFooter', dataKey: 'sectionFooter' },
    entryLayout: { id: 'pageEntries', dataKey: 'entries' },
  };

  constructor(
    messyRenderService: MessyTemplateRenderService,
    actions$: Actions,
    private pageLayoutService: PageLayoutService
  ) {
    super(messyRenderService, actions$);
  }

  handle(iframe: HTMLIFrameElement) {
    const dom = iframe.contentDocument;
    const win = iframe.contentWindow;

    const sitesMenuSubscr = this.handleSitesMenuRerender(dom);

    // sites sections crud
    const siteSectionSubscr = this.handleSiteSectionsRerender(iframe);

    // entry creation
    const entryCreationSubscr = this.handleEntryCreationRerender(iframe);

    // re-renders sections menu every time after entry deletion or tag updates
    const entryDeletionSubscr = this.handleEntryDeletionRerender(iframe);

    // redirects to main section if we removed the last entry from submenu
    const lastEntryDeletionSubscr = this.handleLastEntryDeletion();

    // re-renders sections menu, entries and portfolio after submenu creation
    const siteSectionEntryUpdateSubscr =
      this.handleSectionEntryUpdateRerender(iframe);

    // re-renders in case of settings changes
    const siteSettingChildrenHandleSubscr = this.actions$
      .pipe(ofActionSuccessful(HandleSiteSettingsChildrenChangesAction))
      .subscribe((action: HandleSiteSettingsChildrenChangesAction) => {
        // if setting group is one of the common settings then exec in standard way
        if (
          MessyTemplateRerenderService.COMMON_SETTING_GROUPS.includes(
            action.settingGroup
          )
        ) {
          this.execCommonSiteSettingsRerender(
            iframe,
            action,
            MessyTemplateRerenderService.SETTINGS_IDS_DATA_KEYS
          );
          return;
        }

        // if not common setting, handle action here
        const viewData = this.renderService.getViewData();

        if (action.settingGroup === 'pageLayout') {
          this.pageLayoutService.handleSettings(iframe, action, viewData);
        }
      });

    // re-renders in case of design settings changes
    const siteTemplateSettingHandleSubscr = this.actions$
      .pipe(ofActionSuccessful(HandleSiteTemplateSettingsAction))
      .subscribe((action: HandleSiteTemplateSettingsAction) => {
        const viewData = this.renderService.getViewData();

        if (action.settingGroup === 'pageLayout') {
          this.pageLayoutService.handle(iframe, viewData);
        } else if (action.settingGroup === 'heading') {
          replaceContent(dom, 'siteHeader', viewData.siteHeader);
        } else if (action.settingGroup === 'menu') {
          replaceContent(dom, 'sectionsMenu', viewData.sectionsMenu);
        } else if (action.settingGroup === 'tagsMenu') {
          replaceContent(dom, 'sectionsMenu', viewData.sectionsMenu);
        } else if (action.settingGroup === 'css') {
          MessyTemplateRerenderService.handleCssDesignSettingChange(
            dom,
            action
          );
        }
      });

    this.unsubscribe(win, [
      sitesMenuSubscr,
      siteSectionSubscr,
      entryCreationSubscr,
      entryDeletionSubscr,
      lastEntryDeletionSubscr,
      siteSectionEntryUpdateSubscr,
      siteSettingChildrenHandleSubscr,
      siteTemplateSettingHandleSubscr,
    ]);
  }
}
