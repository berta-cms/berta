export function createEl(
  dom: Document,
  tag: string,
  id: string,
  cssText?: string,
): HTMLElement {
  const el = dom.createElement(tag);
  el.id = id;

  if (cssText) {
    el.style.cssText = cssText;
  }

  return el;
}
