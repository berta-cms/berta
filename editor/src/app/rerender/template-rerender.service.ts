import { Injectable } from '@angular/core';
import { Actions, ofActionSuccessful } from '@ngxs/store';
import {
  CreateSectionAction,
  DeleteSiteSectionAction,
  RenameSiteSectionAction,
  ReOrderSiteSectionsAction,
} from '../sites/sections/sections-state/site-sections.actions';
import { TemplateRenderService } from '../render/template-render.service';
import {
  AddSectionEntryFromSyncAction,
  DeleteSectionEntryFromSyncAction,
  DeleteSectionLastEntry,
  UpdateSectionEntryFromSyncAction,
} from '../sites/sections/entries/entries-state/section-entries.actions';
import { Subscription } from 'rxjs';
import { HandleSiteSettingsChildrenChangesAction } from '../sites/settings/site-settings.actions';
import { Component, SiteSettingChildrenHandler } from './types/components';
import {
  removeExtraAddBtnAndAddListeners,
  replaceContent,
} from './utilities/content';
import { HandleSiteTemplateSettingsAction } from '../sites/template-settings/site-template-settings.actions';
import {
  DeleteSiteAction,
  ReOrderSitesAction,
  UpdateSiteAction,
} from '../sites/sites-state/sites.actions';

@Injectable({
  providedIn: 'root',
})
export class TemplateRerenderService {
  private static readonly SOCIAL_MEDIA_LINKS = 'socialMediaLinks';
  private static readonly SOCIAL_MEDIA_BTNS = 'socialMediaButtons';
  private static readonly MEDIA_SETTINGS = 'media';
  private static readonly BANNERS_SETTINGS = 'banners';
  private static readonly SETTINGS = 'settings';
  private static readonly ENTRY_LAYOUT = 'entryLayout';
  protected static readonly COMMON_SETTING_GROUPS = [
    TemplateRerenderService.SOCIAL_MEDIA_LINKS,
    TemplateRerenderService.SOCIAL_MEDIA_BTNS,
    TemplateRerenderService.MEDIA_SETTINGS,
    TemplateRerenderService.BANNERS_SETTINGS,
    TemplateRerenderService.SETTINGS,
    TemplateRerenderService.ENTRY_LAYOUT,
  ];

  constructor(
    public renderService: TemplateRenderService,
    public actions$: Actions
  ) {}

  private static getSiteSettingsChildrenComp(
    action: HandleSiteSettingsChildrenChangesAction,
    info: SiteSettingChildrenHandler
  ): Component[] {
    let compList: Component[] = [];

    switch (action.settingGroup) {
      case TemplateRerenderService.MEDIA_SETTINGS:
        compList.push(info.media);
        break;
      case TemplateRerenderService.BANNERS_SETTINGS:
        compList.push(info.banners);
        break;
      case TemplateRerenderService.SETTINGS:
        compList.push(info.settings);
        break;
      case TemplateRerenderService.ENTRY_LAYOUT:
        compList.push(info.entryLayout);
        break;
      case TemplateRerenderService.SOCIAL_MEDIA_LINKS:
      case TemplateRerenderService.SOCIAL_MEDIA_BTNS:
        compList = info.socialMediaComp;
    }

    return compList;
  }

  protected static handleCssDesignSettingChange(
    dom: Document,
    action: HandleSiteTemplateSettingsAction
  ) {
    const customStylesId = 'customCSSStyles';
    const customCSS = action.payload.customCSS;

    const html = dom.getElementById('html');
    const head = html.getElementsByTagName('head')[0];

    let style = dom.getElementById(customStylesId);
    if (!style) {
      style = dom.createElement('style');
      style.id = customStylesId;
    }

    style.innerHTML = customCSS;
    head.appendChild(style);
  }

  public handleSitesMenuRerender(dom: Document): Subscription {
    return this.actions$
      .pipe(
        ofActionSuccessful(
          ReOrderSitesAction,
          UpdateSiteAction,
          DeleteSiteAction
        )
      )
      .subscribe(() => {
        const viewData = this.renderService.getViewData();
        replaceContent(dom, 'sitesMenu', viewData.sitesMenu);
      });
  }

  public handleSiteSectionsRerender(iframe: HTMLIFrameElement): Subscription {
    return this.actions$
      .pipe(
        ofActionSuccessful(
          ReOrderSiteSectionsAction,
          DeleteSiteSectionAction,
          CreateSectionAction,
          RenameSiteSectionAction
        )
      )
      .subscribe(() => {
        const viewData = this.renderService.getViewData();
        replaceContent(
          iframe.contentDocument,
          'sectionsMenu',
          viewData.sectionsMenu
        );
        iframe.contentWindow.dispatchEvent(new Event('sectionsMenuRerendered'));
      });
  }

  public handleEntryCreationRerender(iframe: HTMLIFrameElement): Subscription {
    return this.actions$
      .pipe(ofActionSuccessful(AddSectionEntryFromSyncAction))
      .subscribe(() => {
        const viewData = this.renderService.getViewData();

        replaceContent(iframe.contentDocument, 'pageEntries', viewData.entries);
        replaceContent(
          iframe.contentDocument,
          'portfolioThumbnails',
          viewData.portfolioThumbnails
        );

        removeExtraAddBtnAndAddListeners(iframe);
      });
  }

  public handleEntryDeletionRerender(iframe: HTMLIFrameElement): Subscription {
    return this.actions$
      .pipe(ofActionSuccessful(DeleteSectionEntryFromSyncAction))
      .subscribe(() => {
        const viewData = this.renderService.getViewData();

        replaceContent(iframe.contentDocument, 'pageEntries', viewData.entries);

        removeExtraAddBtnAndAddListeners(iframe);
      });
  }

  public handleLastEntryDeletion(): Subscription {
    return this.actions$
      .pipe(ofActionSuccessful(DeleteSectionLastEntry))
      .subscribe((action: DeleteSectionLastEntry) => {
        let url =
          location.protocol + '//' + location.hostname + ':' + location.port;

        window.location.replace(`${url}/engine/?section=${action.section}`);
      });
  }

  public handleSectionEntryUpdateRerender(
    iframe: HTMLIFrameElement
  ): Subscription {
    return this.actions$
      .pipe(ofActionSuccessful(UpdateSectionEntryFromSyncAction))
      .subscribe(() => {
        const viewData = this.renderService.getViewData();

        replaceContent(
          iframe.contentDocument,
          'sectionsMenu',
          viewData.sectionsMenu
        );

        replaceContent(iframe.contentDocument, 'pageEntries', viewData.entries);

        replaceContent(
          iframe.contentDocument,
          'portfolioThumbnails',
          viewData.portfolioThumbnails
        );

        removeExtraAddBtnAndAddListeners(iframe);
      });
  }

  public handleSiteSettingChildrenHandleRerender(
    iframe: HTMLIFrameElement,
    info: SiteSettingChildrenHandler
  ): Subscription {
    return this.actions$
      .pipe(ofActionSuccessful(HandleSiteSettingsChildrenChangesAction))
      .subscribe((action: HandleSiteSettingsChildrenChangesAction) => {
        this.execCommonSiteSettingsRerender(iframe, action, info);
      });
  }

  protected execCommonSiteSettingsRerender(
    iframe: HTMLIFrameElement,
    action: HandleSiteSettingsChildrenChangesAction,
    info: SiteSettingChildrenHandler
  ): void {
    const viewData = this.renderService.getViewData();

    let compList = TemplateRerenderService.getSiteSettingsChildrenComp(
      action,
      info
    );

    compList.forEach((comp) =>
      replaceContent(iframe.contentDocument, comp.id, viewData[comp.dataKey])
    );

    removeExtraAddBtnAndAddListeners(iframe);
  }

  public unsubscribe(win: Window, subList: Subscription[]): void {
    win.onbeforeunload = () => {
      subList.forEach((sub) => sub.unsubscribe());
    };
  }
}
