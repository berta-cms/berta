import {Injectable} from "@angular/core";
import {DefaultTemplateRenderService} from "../render/default-template-render.service";
import {Actions, ofActionDispatched, ofActionSuccessful} from "@ngxs/store";
import {
  CloneSectionAction,
  DeleteSiteSectionAction,
  RenameSiteSectionAction,
  ReOrderSiteSectionsAction,
} from "../sites/sections/sections-state/site-sections.actions";
import {
  AddSectionEntryFromSyncAction,
  DeleteSectionEntryFromSyncAction, UpdateSectionEntryFromSyncAction,
} from "../sites/sections/entries/entries-state/section-entries.actions";
import {UpdateNavigationSiteSettingsAction} from "../sites/settings/site-settings.actions";

@Injectable({
  providedIn: 'root'
})
export class DefaultTemplateRerenderService {
  constructor(
    private defaultRenderService: DefaultTemplateRenderService,
    private actions$: Actions,
  ) {}

  handle(iframe: HTMLIFrameElement) {
    const dom = iframe.contentDocument
    const win = iframe.contentWindow

    // sites sections crud
    const siteSectionSubscr = this.actions$.pipe(ofActionSuccessful(
      ReOrderSiteSectionsAction,
      DeleteSiteSectionAction,
      CloneSectionAction,
      RenameSiteSectionAction,
      // CreateSectionAction, // don't need this action. But left for documentation
    )).subscribe(
      () => {
        const viewData = this.defaultRenderService.getViewData()

        DefaultTemplateRerenderService.replaceContent(dom, 'sectionsMenu', viewData.sectionsMenu)
      }
    );

    // entry creation
    const entryCreationSubscr = this.actions$.pipe(ofActionSuccessful(
      AddSectionEntryFromSyncAction
    )).subscribe(
      () => {
        const viewData = this.defaultRenderService.getViewData()

        DefaultTemplateRerenderService.replaceContent(dom, 'pageEntries', viewData.entries)

        DefaultTemplateRerenderService.removeExtraAddBtnAndAddListeners(iframe)
      }
    )

    // re-renders sections menu every time after entry deletion or tag updates
    const entryDeletionSubscr = this.actions$.pipe(ofActionSuccessful(
      DeleteSectionEntryFromSyncAction,
    )).subscribe(
      () => {
        const viewData = this.defaultRenderService.getViewData()

        DefaultTemplateRerenderService.replaceContent(dom, 'sectionsMenu', viewData.sectionsMenu)

        DefaultTemplateRerenderService.removeExtraAddBtnAndAddListeners(iframe)
      }
    )

    const siteSectionUpdateSubscr = this.actions$.pipe(ofActionSuccessful(
      UpdateSectionEntryFromSyncAction,
    )).subscribe(
      () => {
        const viewData = this.defaultRenderService.getViewData()

        DefaultTemplateRerenderService.replaceContent(dom, 'sectionsMenu', viewData.sectionsMenu)

        DefaultTemplateRerenderService.replaceContent(dom, 'pageEntries', viewData.entries)

        DefaultTemplateRerenderService.removeExtraAddBtnAndAddListeners(iframe)
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
            const viewData = this.defaultRenderService.getViewData()

            const siteHeader = dom.getElementById('siteHeader')
            siteHeader.innerHTML = ''

            if (action.payload.landingSectionPageHeadingVisible === 'no') return

            siteHeader.appendChild(dom.createRange().createContextualFragment(viewData.siteHeader))
            break
        }
      }
    )

    win.onbeforeunload = () => {
      siteSectionSubscr.unsubscribe()
      entryCreationSubscr.unsubscribe()
      entryDeletionSubscr.unsubscribe()
      siteSectionUpdateSubscr.unsubscribe()
      navigationSubscr.unsubscribe()
    }
  }

  private static replaceContent(dom: Document, sectionId: string, sectionHtml: string) {
    const element = dom.getElementById(sectionId)
    element.innerHTML = ''
    element.appendChild(dom.createRange().createContextualFragment(sectionHtml))
  }

  private static removeExtraAddBtnAndAddListeners(iframe: HTMLIFrameElement) {
    // remove extra 'create entry' button due to backend js reload
    const createEntriesList = iframe.contentDocument.getElementsByClassName('xCreateNewEntry')
    createEntriesList[createEntriesList.length-1].remove()

    // reload backend js
    iframe.contentWindow.dispatchEvent(new Event('addEntry'))
  }
}
