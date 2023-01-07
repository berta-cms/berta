export function createEl(dom: Document, tag: string, id: string) {
  const el = dom.createElement(tag)
  el.id = id

  return el
}
