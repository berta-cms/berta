import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';

import { OrderSectionEntriesFromSyncAction } from '../../sites/sections/entries/entries-state/section-entries.actions';
import { OrderSectionTagsFromSyncAction } from '../../sites/sections/tags/section-tags.actions';
import {
  Point,
  autoScrollStep,
  clampPoint,
  insertPosition,
  intersectBox,
} from './sortable.math';

const ENTRIES_LIST_SELECTOR = '.xEntriesList:not(.xNoEntryOrdering)';
// The dragged item, left in its list as the drop placeholder.
const DRAGGING_CLASS = 'xSortDragging';
const ACTIVE_CLASS = 'xSortActive';
const SAVING_CLASS = 'xSaving';
// On `<html>` while dragging.
const SORTING_CLASS = 'xSorting';
// The preview of the dragged item that follows the pointer.
const GHOST_CLASS = 'xSortGhost';
const GHOST_CLIPPED_CLASS = 'xSortGhostClipped';
// Taller items get a preview of their top part only.
const GHOST_MAX_HEIGHT = 240;
// Would load again in the preview.
const GHOST_STRIPPED_SELECTOR = 'iframe, video, audio, object, embed, script';
const SLIDE_ID = 'xSortSlide';
const ANIMATION_MS = 200;
// Pointer travel before a press on a handle becomes a drag (MooTools `snap`).
const DRAG_THRESHOLD = 4;

interface SortableConfig {
  // The list; its direct children matching `item` are sorted.
  container: string;
  item: string;
  handle: string;
  // The handle is a link, still followed on a plain click (without a drag).
  isLink?: boolean;
  // Marks the list with `xSaving` while its new order is being saved.
  showSaving?: boolean;
  // The section whose order changes; `null` when the list can't be ordered.
  section(container: HTMLElement): string | null;
  id(item: HTMLElement): string | null;
  orderAction(
    site: string,
    section: string,
    id: string,
    nextId: string | null,
  ): unknown;
}

const SORTABLES: SortableConfig[] = [
  // Section entries, by the move button of their toolbar.
  {
    container: ENTRIES_LIST_SELECTOR,
    item: '.xEntry',
    handle: '.xEntryMove',
    section: (container) => classValue(container, 'xSection'),
    id: (item) => classValue(item, 'xEntryId'),
    orderAction: (site, section, id, nextId) =>
      new OrderSectionEntriesFromSyncAction(site, section, id, nextId),
  },
  // Portfolio thumbnails order the section's entries as well, so they can
  // only be ordered when its entries list can.
  {
    container: '.portfolioThumbnails',
    item: '.portfolioThumbnail',
    handle: '.xHandle',
    section: (container) => {
      const entriesList = container.ownerDocument.querySelector<HTMLElement>(
        ENTRIES_LIST_SELECTOR,
      );
      return entriesList ? classValue(entriesList, 'xSection') : null;
    },
    id: (item) => item.dataset['id'] ?? null,
    orderAction: (site, section, id, nextId) =>
      new OrderSectionEntriesFromSyncAction(site, section, id, nextId),
  },
  // Section tags (submenu), by their link.
  {
    container: '.subMenu.xAllowOrdering',
    item: 'li',
    handle: 'a.handle',
    isLink: true,
    showSaving: true,
    section: (container) => classValue(container, 'xSection'),
    id: (item) => classValue(item, 'xTag'),
    orderAction: (site, section, id, nextId) =>
      new OrderSectionTagsFromSyncAction(site, section, id, nextId),
  },
];

interface Sortable {
  config: SortableConfig;
  container: HTMLElement;
  item: HTMLElement;
  handle: HTMLElement;
}

interface SortSession extends Sortable {
  pointerId: number;
  start: Point;
  // Latest pointer position, to keep sorting while the page scrolls under it.
  pointer: Point;
  // Where the item started: tells whether the order changed, and puts the
  // item back on cancel.
  originalNext: Element | null;
  started: boolean;
  ghost: HTMLElement | null;
  // The point of the preview kept under the pointer: where the item was
  // grabbed.
  grabOffset: Point;
}

/**
 * The value of a `<prefix>-<value>` class (e.g. `xEntryId-12`), like the
 * legacy MooTools `getClassStoredValue`.
 */
function classValue(el: Element, prefix: string): string | null {
  const found = Array.from(el.classList).find((className) =>
    className.startsWith(`${prefix}-`),
  );

  return found ? found.slice(prefix.length + 1) : null;
}

function isGhost(el: Element): boolean {
  return el.classList.contains(GHOST_CLASS);
}

/**
 * The next sibling, skipping drag previews (which stay in the list until
 * they have landed).
 */
function nextSibling(el: Element): Element | null {
  let next = el.nextElementSibling;

  while (next && isGhost(next)) {
    next = next.nextElementSibling;
  }

  return next;
}

function nextItem(item: Element, selector: string): HTMLElement | null {
  let next = nextSibling(item);

  while (next && !next.matches(selector)) {
    next = nextSibling(next);
  }

  return next as HTMLElement | null;
}

/**
 * Inserts the item before `reference`, or at the end of the list but before
 * any drag preview there: after one, the item's `nth-child` index, which
 * template column rules depend on, would be off by one.
 */
function place(container: Element, item: Element, reference: Element | null) {
  const ghost = Array.from(container.children).find(isGhost) ?? null;

  container.insertBefore(item, reference ?? ghost);
}

function slideAnimations(el: Element): Animation[] {
  return el.getAnimations().filter((animation) => animation.id === SLIDE_ID);
}

function isSliding(el: Element): boolean {
  return slideAnimations(el).length > 0;
}

function prefersReducedMotion(win: Window): boolean {
  return !!win.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function isTransparent(color: string): boolean {
  return color === 'transparent' || color === 'rgba(0, 0, 0, 0)';
}

function pageBackground(doc: Document): string {
  const win = doc.defaultView;

  for (const el of [doc.body, doc.documentElement]) {
    const color = win?.getComputedStyle(el).backgroundColor;

    if (color && !isTransparent(color)) {
      return color;
    }
  }

  return '#fff';
}

/**
 * The element of an event target, which can also be a text node (e.g. a
 * dragged text selection). No `instanceof`: the nodes belong to the iframe's
 * window, not this one.
 */
function toElement(target: EventTarget | null): Element | null {
  const node = target as Node | null;

  return node?.nodeType === 1
    ? (node as Element)
    : (node?.parentElement ?? null);
}

/**
 * Drag-to-reorder for the section entries, portfolio thumbnails and section
 * tags (submenu) inside the (same-origin) preview iframe.
 *
 * Items are dragged by their handle with native pointer events, like
 * `DragPositionService`. A preview of the item follows the pointer while the
 * item itself, faded, moves within its list to where it would be dropped;
 * the items making way slide to their new places. On drop, the preview lands
 * on the item and the new order is saved as "the item now goes before
 * `next`" without rerendering the preview: the items are already in their
 * final order.
 */
@Injectable({
  providedIn: 'root',
})
export class SortableService {
  private boundDocument: Document | null = null;
  private session: SortSession | null = null;
  // The handle of the last drag; the click that follows it must not follow
  // the handle's link.
  private draggedHandle: HTMLElement | null = null;
  private scrollFrame: number | null = null;
  private scrollFrameWindow: Window | null = null;

  constructor(private store: Store) {}

  /**
   * Called every time the preview iframe (re)loads; safe to call repeatedly
   * since an already-bound document is skipped. Listeners are delegated, so
   * lists rerendered later need nothing more.
   */
  attach(iframe: HTMLIFrameElement) {
    const doc = iframe.contentDocument;

    if (!doc || doc === this.boundDocument) {
      return;
    }

    this.stopAutoScroll();
    this.boundDocument = doc;
    this.session = null;
    this.draggedHandle = null;

    doc.addEventListener('pointerdown', (event) => this.onPointerDown(event));
    doc.addEventListener('pointermove', (event) => this.onPointerMove(event));
    doc.addEventListener('pointerup', (event) => this.onPointerUp(event));
    doc.addEventListener('pointercancel', (event) =>
      this.onPointerCancel(event),
    );
    // Fires after a normal `pointerup` too, when the session is already
    // over; while it's still open, the list lost its capture some other way
    // (e.g. a rerender replaced it, and the event targets the document).
    // Not a touch's implicit capture by the handle, which is lost as soon as
    // the list takes the pointer over.
    doc.addEventListener('lostpointercapture', (event) => {
      const container = this.session?.container;

      if (container && (event.target === container || !container.isConnected)) {
        this.onPointerCancel(event);
      }
    });
    // The page scrolling under a resting pointer moves it over other items.
    doc.addEventListener('scroll', () => {
      if (this.session?.started) {
        this.sortToPointer(this.session);
      }
    });

    // Capture phase, so a handle click never reaches the page's own click
    // listeners and never follows the `href="#"` of an entry's move button.
    doc.addEventListener('click', (event) => this.onClick(event), true);
    // Links are natively draggable; a native drag would take the pointer
    // over (`pointercancel`).
    doc.addEventListener(
      'dragstart',
      (event) => {
        if (this.findSortable(event.target)) {
          event.preventDefault();
        }
      },
      true,
    );
    doc.addEventListener(
      'selectstart',
      (event) => {
        if (this.session) {
          event.preventDefault();
        }
      },
      true,
    );
  }

  /**
   * The sortable item and list for an event target, if the target is (inside)
   * the item's handle and the list can be ordered.
   */
  private findSortable(target: EventTarget | null): Sortable | null {
    const el = toElement(target);

    if (!el) {
      return null;
    }

    for (const config of SORTABLES) {
      const handle = el.closest<HTMLElement>(config.handle);
      const item = handle?.closest<HTMLElement>(config.item);
      const container = item?.parentElement;

      if (
        container?.matches(config.container) &&
        !isGhost(item) &&
        config.section(container) !== null &&
        config.id(item) !== null
      ) {
        return { config, container, item, handle };
      }
    }

    return null;
  }

  private onPointerDown(event: PointerEvent) {
    // A session whose item was replaced mid-drag may never get its
    // `pointerup`; don't let it block new drags.
    const stale = this.session;

    if (stale && !stale.item.isConnected) {
      this.endSession(stale.pointerId);
      this.land(stale);
    }

    this.draggedHandle = null;

    if (this.session || !event.isPrimary || event.button !== 0) {
      return;
    }

    const found = this.findSortable(event.target);

    if (!found) {
      return;
    }

    // Prevents text selection and the compatibility mouse events.
    event.preventDefault();

    const start = { x: event.clientX, y: event.clientY };

    this.session = {
      ...found,
      pointerId: event.pointerId,
      start,
      pointer: start,
      originalNext: nextSibling(found.item),
      started: false,
      ghost: null,
      grabOffset: { x: 0, y: 0 },
    };
  }

  private onPointerMove(event: PointerEvent) {
    const session = this.session;

    if (!session || event.pointerId !== session.pointerId) {
      return;
    }

    session.pointer = { x: event.clientX, y: event.clientY };

    if (!session.started) {
      const distance = Math.hypot(
        session.pointer.x - session.start.x,
        session.pointer.y - session.start.y,
      );

      if (distance <= DRAG_THRESHOLD) {
        return;
      }

      this.startDrag(session);
    }

    this.moveGhost(session);
    this.sortToPointer(session);
    this.startAutoScroll(session);
  }

  /**
   * First actual move of a pointer-down on a handle: the item's preview is
   * picked up, the item itself stays in its list as the drop placeholder.
   */
  private startDrag(session: SortSession) {
    const { container, item } = session;
    const rect = item.getBoundingClientRect();
    const ghostHeight = Math.min(rect.height, GHOST_MAX_HEIGHT);
    // Created before the item is marked, so it isn't faded like the item.
    const ghost = this.createGhost(item, rect, ghostHeight);

    session.started = true;
    session.ghost = ghost;
    session.grabOffset = {
      x: session.start.x - rect.left,
      y: Math.min(Math.max(session.start.y - rect.top, 0), ghostHeight),
    };

    // Only now, not on `pointerdown`: a captured pointer's `click` goes to
    // the capturing element, so a plain click on a link handle (a submenu
    // tag) would never reach the link.
    try {
      // Captured by the list rather than the handle, which moves (is
      // removed and reinserted) with its item.
      container.setPointerCapture(session.pointerId);
    } catch {
      // The pointer is no longer active; moves still arrive while it stays
      // inside the iframe.
    }

    // Inside the list, so the template's styles for its items apply; last,
    // so the items' `nth-of-type` indexes don't change.
    container.appendChild(ghost);
    item.classList.add(DRAGGING_CLASS);
    container.classList.add(ACTIVE_CLASS);
    container.ownerDocument.documentElement.classList.add(SORTING_CLASS);
  }

  private createGhost(
    item: HTMLElement,
    rect: DOMRect,
    height: number,
  ): HTMLElement {
    const doc = item.ownerDocument;
    const win = doc.defaultView;
    const ghost = item.cloneNode(true) as HTMLElement;
    const clipped = height < rect.height;

    ghost.classList.add(GHOST_CLASS);
    ghost.classList.toggle(GHOST_CLIPPED_CLASS, clipped);

    // No duplicate ids, and nothing `InlineEditService` could take for the
    // item's (re)rendered fields.
    [ghost, ...Array.from(ghost.querySelectorAll('[id], [data-path]'))].forEach(
      (el) => {
        el.removeAttribute('id');
        el.removeAttribute('data-path');
      },
    );
    ghost
      .querySelectorAll(GHOST_STRIPPED_SELECTOR)
      .forEach((el) => el.remove());

    Object.assign(ghost.style, {
      position: 'fixed',
      left: '0',
      top: '0',
      margin: '0',
      boxSizing: 'border-box',
      width: `${rect.width}px`,
      height: `${height}px`,
      overflow: 'hidden',
      zIndex: '2147483647',
      pointerEvents: 'none',
      transition: 'none',
    });

    // A see-through item gets the page's background, so its preview stays
    // readable over the content it's dragged across.
    if (win && isTransparent(win.getComputedStyle(item).backgroundColor)) {
      ghost.style.backgroundColor = pageBackground(doc);
    }

    return ghost;
  }

  private moveGhost({ ghost, pointer, grabOffset }: SortSession) {
    ghost.style.transform = `translate(${pointer.x - grabOffset.x}px, ${pointer.y - grabOffset.y}px)`;
  }

  private onPointerUp(event: PointerEvent) {
    const session = this.endSession(event.pointerId);

    if (!session?.started) {
      return;
    }

    this.draggedHandle = session.handle;

    const { container, item } = session;

    // Not replaced by a rerender mid-drag, and not dropped where it started.
    if (
      item.isConnected &&
      item.parentElement === container &&
      nextSibling(item) !== session.originalNext
    ) {
      this.save(session);
    }

    this.land(session);
  }

  /**
   * The browser took over the pointer (e.g. a touch scroll) or the list was
   * replaced: put the item back where it was.
   */
  private onPointerCancel(event: PointerEvent) {
    const session = this.endSession(event.pointerId);

    if (session?.started) {
      this.restore(session);
      this.land(session);
    }
  }

  /**
   * Stops following the pointer. The item and its list stay marked until
   * the preview has landed (`land`).
   */
  private endSession(pointerId: number): SortSession | null {
    const session = this.session;

    if (!session || pointerId !== session.pointerId) {
      return null;
    }

    this.session = null;
    this.stopAutoScroll();

    if (session.container.hasPointerCapture(pointerId)) {
      session.container.releasePointerCapture(pointerId);
    }

    session.container.ownerDocument.documentElement.classList.remove(
      SORTING_CLASS,
    );

    return session;
  }

  /**
   * Glides the preview onto the item's place in its list, then removes it
   * and unmarks the item.
   */
  private land({ ghost, item, container }: SortSession) {
    const done = () => {
      ghost?.remove();

      // The same item or list may be dragged again by now.
      if (this.session?.item !== item) {
        item.classList.remove(DRAGGING_CLASS);
      }

      if (this.session?.container !== container) {
        container.classList.remove(ACTIVE_CLASS);
      }
    };
    const win = container.ownerDocument.defaultView;

    if (!ghost || !item.isConnected || !win || prefersReducedMotion(win)) {
      done();
      return;
    }

    // Lands where the item ends up, not where it's shown mid-slide.
    slideAnimations(item).forEach((animation) => animation.finish());

    const rect = item.getBoundingClientRect();

    ghost
      .animate(
        [
          { transform: ghost.style.transform },
          { transform: `translate(${rect.left}px, ${rect.top}px)` },
        ],
        { duration: ANIMATION_MS, easing: 'ease-in-out' },
      )
      .finished.then(done, done);
  }

  /**
   * Moves the item before or after the item under the pointer. The pointer
   * is kept inside the list's visible part, so dragging past its start/end
   * (or past the iframe while it auto-scrolls) moves the item to the
   * first/last item in view.
   */
  private sortToPointer(session: SortSession) {
    const { config, container, item } = session;
    const win = container.ownerDocument.defaultView;

    if (!win || !item.isConnected || item.parentElement !== container) {
      return;
    }

    // `elementFromPoint` finds nothing outside the viewport.
    const visible = intersectBox(container.getBoundingClientRect(), {
      left: 0,
      top: 0,
      right: win.innerWidth,
      bottom: win.innerHeight,
    });

    if (!visible) {
      return;
    }

    const point = clampPoint(session.pointer, visible);
    const target = container.ownerDocument
      .elementFromPoint(point.x, point.y)
      ?.closest<HTMLElement>(config.item);

    if (
      !target ||
      target === item ||
      isGhost(target) ||
      target.parentElement !== container
    ) {
      return;
    }

    // Boxes are offset while sliding, which could flip the decision back
    // and forth; sorts again once the slide is over.
    if (isSliding(item) || isSliding(target)) {
      return;
    }

    const reference =
      insertPosition(
        target.getBoundingClientRect(),
        item.getBoundingClientRect(),
        point,
      ) === 'before'
        ? target
        : nextSibling(target);

    if (reference !== item && nextSibling(item) !== reference) {
      this.slide(
        container,
        () => place(container, item, reference),
        () => {
          if (this.session === session) {
            this.sortToPointer(session);
          }
        },
      );
    }
  }

  /**
   * Reorders the list's items with `move`, then slides each moved item from
   * where it was shown to its new place (FLIP) instead of letting it jump.
   * `settled` runs once all of them got there.
   */
  private slide(
    container: HTMLElement,
    move: () => void,
    settled?: () => void,
  ) {
    const win = container.ownerDocument.defaultView;
    const items = Array.from(container.children).filter(
      (el) => !isGhost(el),
    ) as HTMLElement[];
    // Where they're shown now, including mid-slide offsets.
    const shown = items.map((el) => el.getBoundingClientRect());

    items.forEach((el) =>
      slideAnimations(el).forEach((animation) => animation.cancel()),
    );

    move();

    if (!win || prefersReducedMotion(win)) {
      return;
    }

    // All measured before any is animated: a new animation would make the
    // next measurement recalculate the styles again.
    const placed = items.map((el) => el.getBoundingClientRect());
    const animations = items.flatMap((el, index) => {
      const dx = shown[index].left - placed[index].left;
      const dy = shown[index].top - placed[index].top;

      if (!dx && !dy) {
        return [];
      }

      return [
        el.animate(
          [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
          { duration: ANIMATION_MS, easing: 'ease-out', id: SLIDE_ID },
        ),
      ];
    });

    if (settled && animations.length) {
      // Rejects when canceled by the next slide, which settles instead.
      Promise.all(animations.map((animation) => animation.finished)).then(
        settled,
        () => {},
      );
    }
  }

  /**
   * Scrolls the page while the pointer is near (or past) the top/bottom of
   * the iframe; the pointer capture keeps the moves coming from outside it.
   */
  private startAutoScroll(session: SortSession) {
    const win = session.container.ownerDocument.defaultView;

    if (
      !win ||
      this.scrollFrame !== null ||
      !autoScrollStep(session.pointer.y, win.innerHeight)
    ) {
      return;
    }

    const scroll = () => {
      const step =
        this.session === session
          ? autoScrollStep(session.pointer.y, win.innerHeight)
          : 0;

      if (!step) {
        this.scrollFrame = null;
        return;
      }

      win.scrollBy(0, step);
      this.scrollFrame = win.requestAnimationFrame(scroll);
    };

    this.scrollFrameWindow = win;
    this.scrollFrame = win.requestAnimationFrame(scroll);
  }

  private stopAutoScroll() {
    if (this.scrollFrame !== null) {
      this.scrollFrameWindow?.cancelAnimationFrame(this.scrollFrame);
      this.scrollFrame = null;
    }
  }

  private onClick(event: MouseEvent) {
    const draggedHandle = this.draggedHandle;
    this.draggedHandle = null;

    const found = this.findSortable(event.target);

    // A plain click on a link handle (a submenu tag) still follows it.
    if (!found || (found.config.isLink && found.handle !== draggedHandle)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  }

  private save(session: SortSession) {
    const { config, container, item } = session;
    const doc = container.ownerDocument;
    const next = nextItem(item, config.item);
    const action = config.orderAction(
      new URLSearchParams(doc.location.search).get('site') ?? '',
      config.section(container),
      config.id(item),
      next ? config.id(next) : null,
    );

    if (config.showSaving) {
      container.classList.add(SAVING_CLASS);
    }

    const saved = () => {
      if (config.showSaving) {
        container.classList.remove(SAVING_CLASS);
      }
    };

    this.store.dispatch(action).subscribe({
      next: saved,
      error: () => {
        saved();
        this.restore(session);
      },
    });
  }

  /**
   * Puts the item back where its drag started.
   */
  private restore({ container, item, originalNext }: SortSession) {
    if (
      item.parentElement === container &&
      (originalNext === null || originalNext.parentElement === container)
    ) {
      this.slide(container, () => place(container, item, originalNext));
    }
  }
}
