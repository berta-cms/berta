import { Injectable } from '@angular/core';
import { MashupTemplateRenderService } from '../../render/mashup-template-render.service';
import { Actions, ofActionSuccessful } from '@ngxs/store';
import { TemplateRerenderService } from '../template-rerender.service';
import { SiteSettingChildrenHandler } from '../types/components';
import { HandleSiteTemplateSettingsAction } from '../../sites/template-settings/site-template-settings.actions';
import { PageLayoutService } from './page-layout.service';
import { replaceContent } from '../utilities/content';

@Injectable({
  providedIn: 'root',
})
export class MashupTemplateRerenderService extends TemplateRerenderService {
  /* config for live settings re-rendering.
  'id' is id of the wrapper element. All content inside will be replaced with a new one
  'dataKey' is a key of re-rendered data from 'viewData' object
   */
  private static readonly SETTINGS_IDS_DATA_KEYS: SiteSettingChildrenHandler = {
    socialMediaComp: [
      { id: 'additionalTextBlock', dataKey: 'additionalTextBlock' },
      { id: 'socialMediaLinks', dataKey: 'socialMediaLinks' },
      { id: 'sectionFooter', dataKey: 'sectionFooter' },
    ],
    banners: { id: 'siteBanners', dataKey: 'siteBanners' },
    settings: { id: 'sectionFooter', dataKey: 'sectionFooter' },
    entryLayout: { id: 'pageEntries', dataKey: 'entries' },
  };

  constructor(
    mashupRenderService: MashupTemplateRenderService,
    actions$: Actions,
    private pageLayoutService: PageLayoutService
  ) {
    super(mashupRenderService, actions$);
  }

  handle(iframe: HTMLIFrameElement) {
    const dom = iframe.contentDocument;
    const win = iframe.contentWindow;

    const iframeHardReloadSubscr = this.handleIframeHardReload(win);

    const sitesMenuSubscr = this.handleSitesMenuRerender(iframe);

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
    const siteSettingChildrenHandleSubscr =
      this.handleSiteSettingChildrenHandleRerender(
        iframe,
        MashupTemplateRerenderService.SETTINGS_IDS_DATA_KEYS
      );

    // re-renders in case of design settings changes
    const siteTemplateSettingHandleSubscr = this.actions$
      .pipe(ofActionSuccessful(HandleSiteTemplateSettingsAction))
      .subscribe((action: HandleSiteTemplateSettingsAction) => {
        const viewData = this.renderService.getViewData();

        if (action.settingGroup === 'pageLayout') {
          this.pageLayoutService.handle(iframe, viewData);
        } else if (action.settingGroup === 'sideBar') {
          replaceContent(dom, 'siteHeader', viewData.siteHeader);
        } else if (action.settingGroup === 'css') {
          MashupTemplateRerenderService.handleCssDesignSettingChange(
            dom,
            action
          );
        }
      });

    this.unsubscribe(win, [
      iframeHardReloadSubscr,
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
