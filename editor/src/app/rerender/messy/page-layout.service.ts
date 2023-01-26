import {Injectable} from "@angular/core";
import {createEl, updateElCssById} from "../utilities/element";
import {HandleSiteSettingsChildrenChangesAction} from "../../sites/settings/site-settings.actions";
import {PageLayoutService as MainPageLayoutService} from "../common/page-layout.service";
import {Store} from "@ngxs/store";
import {SiteTemplateSettingsState} from "../../sites/template-settings/site-template-settings.state";

@Injectable({
  providedIn: 'root',
})
export class PageLayoutService extends MainPageLayoutService {
  private static readonly SELECTORS_FOR_CONTENT_CENTERING_ALL_TYPES = ".bt-responsive.bt-centered-content #pageEntries .xEntry, .bt-responsive.bt-centered-content #pageEntries .xEntry .xGalleryContainer .xGallery, .bt-responsive.bt-centered-content #pageEntries .xEntry .xGalleryType-slideshow .xGallery, .bt-responsive.bt-centered-content #pageEntries .xEntry .xGalleryContainer .xGallery .xGalleryItem"
  private static readonly SELECTORS_FOR_CONTENT_CENTERING_SLIDESHOW_GALLERY = ".bt-responsive.bt-centered-content #pageEntries .xEntry, .bt-responsive.bt-centered-content #pageEntries .xEntry .xGalleryContainer .xGallery, .bt-responsive.bt-centered-content #pageEntries .xEntry .xGalleryType-slideshow .xGallery"
  private static readonly SELECTORS_FOR_CONTENT_CENTERING_ROW_GALLERY = ".bt-responsive.bt-centered-content #pageEntries .xEntry .xGalleryContainer .xGallery .xGalleryItem"

  private pageLayoutSettings
  private entryLayoutSettings

  constructor(
    private store: Store,
  ) {
    super();
  }

  private getSettingsFromState() {
    this.pageLayoutSettings = this.store.selectSnapshot(SiteTemplateSettingsState.getCurrentSiteTemplateSettings)
      .find(item => item.slug === 'pageLayout').settings
    this.entryLayoutSettings = this.store.selectSnapshot(SiteTemplateSettingsState.getCurrentSiteTemplateSettings)
      .find(item => item.slug === 'entryLayout').settings
  }

  handle(iframe: HTMLIFrameElement, viewData) {
    this.getSettingsFromState()

    const dom = iframe.contentDocument
    const contentContainer = dom.getElementById('contentContainer')
    const body = dom.getElementById('body')

    // handle 'Centered layout' setting
    this.handleCenteredPart(iframe, contentContainer, body, viewData)

    // handle 'Centered contents' setting
    this.handleCenteredContent(iframe)

    if (viewData.isAutoResponsive) {
      body.classList.add('bt-auto-responsive')
    } else {
      body.classList.remove('bt-auto-responsive')
    }

    if (viewData.isResponsive) {
      body.classList.add('bt-responsive')
      contentContainer.classList.add('xResponsive')
    } else {
      contentContainer.classList.remove('xResponsive')
      body.classList.remove('bt-responsive')
    }
  }

  private handleCenteredContent(iframe: HTMLIFrameElement) {
    const dom = iframe.contentDocument
    const allContainer = dom.getElementById('allContainer')
    const isContentCentered = this.pageLayoutSettings.find(s => s.slug === 'centeredContents').value === 'yes'

    if (isContentCentered) {
      allContainer.style.textAlign = 'center'

      dom.querySelectorAll(PageLayoutService.SELECTORS_FOR_CONTENT_CENTERING_ALL_TYPES).forEach(
        e => (e as HTMLElement).style.margin = '0 auto'
      )
    } else {
      allContainer.style.textAlign = 'left'

      const spaceBetweenImages = this.entryLayoutSettings.find(s => s.slug === 'spaceBetweenImages').value

      dom.querySelectorAll(PageLayoutService.SELECTORS_FOR_CONTENT_CENTERING_SLIDESHOW_GALLERY).forEach(
        e => (e as HTMLElement).style.margin = '0'
      )
      dom.querySelectorAll(PageLayoutService.SELECTORS_FOR_CONTENT_CENTERING_ROW_GALLERY).forEach(
        e => (e as HTMLElement).style.marginRight = spaceBetweenImages
      )
    }
  }

  private handleCenteredPart(iframe: HTMLIFrameElement, contentContainer, body, viewData) {
    const dom = iframe.contentDocument
    const bottom = dom.getElementById('bottom')
    const centeredWidth = Number.parseInt(this.pageLayoutSettings.find(s => s.slug === 'centeredWidth').value.trim('px'))
    const screenWidth = iframe.contentWindow.innerWidth - 15
    const centeringBlockWidth = (screenWidth - centeredWidth) / 2

    // remove old centering elements
    Array.from(dom.getElementsByClassName('xCenteringGuide')).forEach(el => el.remove())

    if (viewData.isCenteredPageLayout) {
      contentContainer.classList.add('xCentered')
      body.classList.add('bt-centered-content')

      const centering1 = dom.createElement('div')
      centering1.className = 'xCenteringGuide'
      centering1.style.left = '0'
      centering1.style.width = `${centeringBlockWidth}px`

      const centering2 = dom.createElement('div')
      centering2.className = 'xCenteringGuide'
      centering2.style.right = '0'
      centering2.style.width = `${centeringBlockWidth}px`

      body.insertBefore(centering2, body.firstChild)
      body.insertBefore(centering1, body.firstChild)

      bottom.style.right = `${centeringBlockWidth + 20}px`
      bottom.style.left = 'auto'
      bottom.style.width = `${centeredWidth - 40}px`
    } else {
      contentContainer.classList.remove('xCentered')
      body.classList.remove('bt-centered-content')

      bottom.style.removeProperty('left')
      bottom.style.removeProperty('right')
      bottom.style.removeProperty('width')
    }
  }

  handleSettings(
    iframe: HTMLIFrameElement,
    action: HandleSiteSettingsChildrenChangesAction,
    viewData,
  ) {
    const dom = iframe.contentDocument

    // if someone changed 'Show gridlines' setting
    if (action.payload.showGrid) {
      if (action.payload.showGrid === 'yes') {
        const body = dom.getElementById('body')

        const createdGrid = createEl(dom, 'div', 'xGridBackground', viewData.gridlinesAttributes.style)

        body.insertBefore(createdGrid, body.firstChild)
      } else {
        const gridBackground = dom.getElementById('xGridBackground')
        gridBackground.remove()
      }

    // if someone changed 'Grid step' or 'Gridlines color' setting
    } else if (action.payload.gridStep || action.payload.gridColor) {
      // if grid is hidden ignore changes
      if (!viewData.gridlinesAttributes) {
        return
      }

      updateElCssById(dom, 'xGridBackground', viewData.gridlinesAttributes.style)
    }
  }
}
