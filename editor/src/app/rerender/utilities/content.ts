export function replaceContent(
  dom: Document,
  sectionId: string,
  sectionHtml: string,
): void {
  const element = dom.getElementById(sectionId);
  if (!element) {
    return;
  }
  element.innerHTML = '';
  element.appendChild(dom.createRange().createContextualFragment(sectionHtml));
}

export function notifyEntriesRerendered(iframe: HTMLIFrameElement) {
  // The preview scripts re-init the replaced entries: BertaEditor re-binds the
  // entry listeners and replaces the "create new entry" link after the list,
  // BertaPortfolio re-binds the thumbnail links
  iframe.contentWindow.dispatchEvent(new Event('entriesRerendered'));
}
