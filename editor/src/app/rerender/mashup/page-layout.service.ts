import { Injectable } from '@angular/core';
import { reloadBackendJs, replaceContent } from '../utilities/content';
import { createEl } from '../utilities/element';
import { PageLayoutService as MainPageLayoutService } from '../common/page-layout.service';

@Injectable({
  providedIn: 'root',
})
export class PageLayoutService extends MainPageLayoutService {
  handle(iframe: HTMLIFrameElement, viewData) {
    if (viewData.sectionType === 'mash_up') {
      PageLayoutService.handlePLayoutChangesMashSection(iframe, viewData);
      return;
    }

    super.handle(iframe, viewData);
  }

  private static handlePLayoutChangesMashSection(
    iframe: HTMLIFrameElement,
    viewData
  ) {
    const dom = iframe.contentDocument;

    const allContainer = dom.getElementById('allContainer');
    const sideColumn = dom.getElementById('sideColumn');
    const contentContainer = dom.getElementById('contentContainer');
    const body = dom.getElementById('body');

    PageLayoutService.handleMainColumn(dom, contentContainer, viewData);

    if (viewData.isCenteredPageLayout) {
      allContainer.classList.add('xCentered');
      sideColumn.classList.add('xCentered');
    } else {
      allContainer.classList.remove('xCentered');
      sideColumn.classList.remove('xCentered');
    }

    if (viewData.isResponsive) {
      body.classList.add('bt-responsive');
      sideColumn.classList.add('xResponsive');
      contentContainer.classList.add('xResponsive');
    } else {
      body.classList.remove('bt-responsive');
      sideColumn.classList.remove('xResponsive');
      contentContainer.classList.remove('xResponsive');
    }

    PageLayoutService.replaceCommonContent(dom, viewData);

    replaceContent(dom, 'mashupEntries', viewData.mashupEntries);
    reloadBackendJs(iframe);
  }

  private static handleMainColumn(
    dom: Document,
    contentContainer: HTMLElement,
    viewData
  ) {
    if (!viewData.isResponsive) {
      // setting is not responsive, so we need to clean contentContainer, create new mashupEntries and append them to contentContainer
      contentContainer.innerHTML = '';
      const mashupEntries = createEl(dom, 'div', 'mashupEntries');
      contentContainer.appendChild(mashupEntries);

      return;
    }

    /*
     setting is responsive, so we need to clean contentContainer, create mainColumnContainer, mainColumn,
     new mashupEntries and combine them in order to append them to contentContainer
     */
    contentContainer.innerHTML = '';
    const mainColumnContainer = createEl(dom, 'div', 'mainColumnContainer');
    const mainColumn = createEl(dom, 'div', 'mainColumn');
    const mashupEntries = createEl(dom, 'div', 'mashupEntries');
    mainColumn.appendChild(mashupEntries);
    mainColumnContainer.appendChild(mainColumn);
    contentContainer.appendChild(mainColumnContainer);

    if (viewData.isCenteredPageLayout) {
      mainColumn.classList.add('xCentered');
    } else {
      mainColumn.classList.remove('xCentered');
    }

    // if we change 'Page layout' => 'How far content is from page top?'
    mainColumn.setAttribute(
      'data-paddingtop',
      viewData.mainColumnAttributes['data-paddingtop']
    );
    mainColumn.style.paddingTop =
      viewData.mainColumnAttributes['data-paddingtop'];
  }
}
