import { Injectable } from '@angular/core';
import {
  removeExtraAddBtnAndAddListeners,
  replaceContent,
} from '../utilities/content';

@Injectable({
  providedIn: 'root',
})
export class PageLayoutService {
  handle(iframe: HTMLIFrameElement, viewData) {
    const dom = iframe.contentDocument;

    const allContainer = dom.getElementById('allContainer');
    const mainColumn = dom.getElementById('mainColumn');
    const sideColumn = dom.getElementById('sideColumn');

    if (viewData.isCenteredPageLayout) {
      allContainer.classList.add('xCentered');
      mainColumn.classList.add('xCentered');
      sideColumn.classList.add('xCentered');
    } else {
      allContainer.classList.remove('xCentered');
      mainColumn.classList.remove('xCentered');
      sideColumn.classList.remove('xCentered');
    }

    PageLayoutService.handleIsResponsiveSetting(
      dom,
      sideColumn,
      mainColumn,
      viewData
    );

    PageLayoutService.replaceCommonContent(dom, viewData);

    replaceContent(dom, 'pageEntries', viewData.entries);
    replaceContent(dom, 'portfolioThumbnails', viewData.portfolioThumbnails);
    removeExtraAddBtnAndAddListeners(iframe);
  }

  protected static handleIsResponsiveSetting(
    dom: Document,
    sideColumn: HTMLElement,
    mainColumn: HTMLElement,
    viewData
  ) {
    const body = dom.getElementById('body');
    const contentContainer = dom.getElementById('contentContainer');

    if (viewData.isResponsive) {
      body.classList.add('bt-responsive');
      sideColumn.classList.add('xResponsive');
      contentContainer.classList.add('xResponsive');

      // if we change 'Page layout' => 'How far content is from page top?'
      mainColumn.setAttribute(
        'data-paddingtop',
        viewData.mainColumnAttributes['data-paddingtop']
      );
      mainColumn.style.paddingTop =
        viewData.mainColumnAttributes['data-paddingtop'];
    } else {
      body.classList.remove('bt-responsive');
      sideColumn.classList.remove('xResponsive');
      contentContainer.classList.remove('xResponsive');

      // if we change 'Page layout' => 'How far content is from page top?'
      mainColumn.removeAttribute('data-paddingtop');
      mainColumn.style.paddingTop = null;
    }
  }

  protected static replaceCommonContent(dom: Document, viewData) {
    replaceContent(dom, 'sitesMenu', viewData.sitesMenu);
    replaceContent(dom, 'siteHeader', viewData.siteHeader);
    replaceContent(dom, 'additionalTextBlock', viewData.additionalTextBlock);
    replaceContent(dom, 'sectionsMenu', viewData.sectionsMenu);
    replaceContent(dom, 'socialMediaLinks', viewData.socialMediaLinks);
    replaceContent(dom, 'userCopyright', viewData.userCopyright.content);
    replaceContent(dom, 'bertaCopyright', viewData.bertaCopyright);
    replaceContent(dom, 'siteBanners', viewData.siteBanners);
  }
}
