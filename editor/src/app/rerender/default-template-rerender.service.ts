import {Injectable} from "@angular/core";
import {DefaultTemplateRenderService} from "../render/default-template-render.service";
import {Actions, ofActionDispatched, ofActionSuccessful} from "@ngxs/store";
import {
  UpdateNavigationSiteSettingsAction,
} from "../sites/settings/site-settings.actions";
import {HandleSiteTemplateSettingsAction} from "../sites/template-settings/site-template-settings.actions";
import {TemplateRerenderService} from "./template-rerender.service";
import {SiteSettingChildrenHandler} from "./types/components";
import {replaceContent, removeExtraAddBtnAndAddListeners} from "./utilities/content";

@Injectable({
  providedIn: 'root'
})
export class DefaultTemplateRerenderService extends TemplateRerenderService {

  /* config for live settings re-rendering.
  'id' is id of the wrapper element. All content inside will be replaced with a new one
  'dataKey' is a key of re-rendered data from 'viewData' object
   */
  private static readonly SETTINGS_IDS_DATA_KEYS: SiteSettingChildrenHandler = {
    socialMediaComp: [
      {id: 'additionalTextBlock', dataKey: 'additionalTextBlock'},
      {id: 'additionalFooterTextBlock', dataKey: 'additionalFooterText'},
      {id: 'sectionFooter', dataKey: 'sectionFooter'},
    ],
    media: {id: 'pageEntries', dataKey: 'entries'},
    banners: {id: 'siteBanners', dataKey: 'siteBanners'},
    settings: {id: 'sectionFooter', dataKey: 'sectionFooter'},
    entryLayout: {id: 'pageEntries', dataKey: 'entries'},
  }

  constructor(
    defaultRenderService: DefaultTemplateRenderService,
    actions$: Actions,
  ) {
    super(
      defaultRenderService,
      actions$,
    )
  }

  handle(iframe: HTMLIFrameElement) {
    const dom = iframe.contentDocument
    const win = iframe.contentWindow

    // sites sections crud
    const siteSectionSubscr = this.handleSiteSectionsRerender(dom);

    // entry creation
    const entryCreationSubscr = this.handleEntryCreationRerender(iframe)

    // re-renders sections menu every time after entry deletion or tag updates
    const entryDeletionSubscr = this.handleEntryDeletionRerender(iframe)

    // redirects to main section if we removed the last entry from submenu
    const lastEntryDeletionSubscr = this.handleLastEntryDeletion()

    // re-renders sections menu, entries and portfolio after submenu creation
    const siteSectionEntryUpdateSubscr = this.handleSectionEntryUpdateRerender(iframe)

    // re-renders in case of settings changes
    const siteSettingChildrenHandleSubscr = this.handleSiteSettingChildrenHandleRerender(
      iframe,
      DefaultTemplateRerenderService.SETTINGS_IDS_DATA_KEYS,
    )

    // re-renders in case of design settings changes
    const siteTemplateSettingHandleSubscr = this.actions$.pipe(ofActionSuccessful(
      HandleSiteTemplateSettingsAction
    )).subscribe(
      (action: HandleSiteTemplateSettingsAction) => {
        const viewData = this.renderService.getViewData()

        if (action.settingGroup === 'pageLayout') {
          const body = dom.getElementById('body')
          const contentContainer = dom.getElementById('contentContainer')

          if (viewData.isResponsive) {
            body.classList.add('bt-responsive')
            contentContainer.classList.add('xResponsive')
          } else {
            body.classList.remove('bt-responsive')
            contentContainer.classList.remove('xResponsive')
          }

          replaceContent(dom, 'sitesMenu', viewData.sitesMenu)
          replaceContent(dom, 'siteHeader', viewData.siteHeader)
          replaceContent(dom, 'additionalTextBlock', viewData.additionalTextBlock)
          replaceContent(dom, 'sectionsMenu', viewData.sectionsMenu)
          replaceContent(dom, 'pageEntries', viewData.entries)
          replaceContent(dom, 'portfolioThumbnails', viewData.portfolioThumbnails)
          replaceContent(dom, 'additionalFooterTextBlock', viewData.additionalFooterText)
          replaceContent(dom, 'siteBanners', viewData.siteBanners)
          replaceContent(dom, 'sectionFooter', viewData.sectionFooter)

          removeExtraAddBtnAndAddListeners(iframe)
        } else if (action.settingGroup === 'pageHeading') {
          replaceContent(dom, 'siteHeader', viewData.siteHeader)
        } else if (action.settingGroup === 'entryLayout') {
          replaceContent(dom, 'pageEntries', viewData.entries)
          removeExtraAddBtnAndAddListeners(iframe)
        } else if (action.settingGroup === 'css') {
          DefaultTemplateRerenderService.handleCssDesignSettingChange(dom, action)
        }
      }
    )

    // navigation setting adjusting
    const navigationSubscr = this.actions$.pipe(ofActionDispatched(
      UpdateNavigationSiteSettingsAction
    )).subscribe(
      (action: UpdateNavigationSiteSettingsAction) => {
        const setting = Object.keys(action.payload)[0]
        switch (setting) {
          case 'landingSectionVisible':
            break

          case 'landingSectionPageHeadingVisible':
            const viewData = this.renderService.getViewData()

            const siteHeader = dom.getElementById('siteHeader')
            siteHeader.innerHTML = ''

            if (action.payload.landingSectionPageHeadingVisible === 'no') return

            siteHeader.appendChild(dom.createRange().createContextualFragment(viewData.siteHeader))
            break
        }
      }
    )

    this.unsubscribe(win, [
      siteSectionSubscr,
      entryCreationSubscr,
      entryDeletionSubscr,
      lastEntryDeletionSubscr,
      siteSectionEntryUpdateSubscr,
      siteSettingChildrenHandleSubscr,
      siteTemplateSettingHandleSubscr,
      navigationSubscr,
    ])
  }
}
