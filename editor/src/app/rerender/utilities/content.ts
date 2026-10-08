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

export function reloadBackendJs(iframe: HTMLIFrameElement) {
  // BertaEditor re-binds the entry listeners and replaces the "create new entry"
  // link after the entries list
  iframe.contentWindow.dispatchEvent(new Event('addEntry'));
}
