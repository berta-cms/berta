export function replaceContent(
  dom: Document,
  sectionId: string,
  sectionHtml: string
): void {
  const element = dom.getElementById(sectionId);
  element.innerHTML = '';
  element.appendChild(dom.createRange().createContextualFragment(sectionHtml));
}

export function removeExtraAddBtnAndAddListeners(
  iframe: HTMLIFrameElement
): void {
  // remove extra 'create entry' button due to backend js reload
  const createEntriesList =
    iframe.contentDocument.getElementsByClassName('xCreateNewEntry');
  createEntriesList[createEntriesList.length - 1].remove();

  reloadBackendJs(iframe);
}

export function reloadBackendJs(iframe: HTMLIFrameElement) {
  // reload backend js
  iframe.contentWindow.dispatchEvent(new Event('addEntry'));
}
