import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';

import { SiteSettingsState } from '../../sites/settings/site-settings.state';
import {
  PositionUpdate,
  resolveDragPositionActions,
} from './drag-position-path.resolver';
import {
  Position,
  centeringOffset,
  clampGroupDelta,
  clampPosition,
  normalizeGridStep,
  snapToGrid,
  toSavedValue,
} from './drag-position.math';

const DRAGGABLE_CLASS = 'xNgEditableDragXY';
// The messy template's "create new entry" button: dragged freely (no grid,
// no guard) and never saved.
const FREE_DRAGGABLE_SELECTOR = '.xCreateNewEntry.mess';
const DRAG_ROOT_SELECTOR = `.${DRAGGABLE_CLASS}, ${FREE_DRAGGABLE_SELECTOR}`;
const HANDLE_CLASS = 'xHandle';
const ENTRY_CLASS = 'xEntry';
const FIXED_CLASS = 'xFixed';
const CENTERED_CLASS = 'xCentered';
const EDITING_CLASS = 'xEditing';
const SAVING_CLASS = 'xSaving';
// Shift + drag on an entry moves all of these together.
const GROUP_SELECTOR = '#pageEntries .xEntry.mess';
const COORDS_ID = 'xCoords';
const GUIDE_LINE_CLASS = 'xGuideLine';
const GUIDE_LINE_X_ID = 'xGuideLineX';
const GUIDE_LINE_Y_ID = 'xGuideLineY';

interface DragItem {
  el: HTMLElement;
  start: Position;
}

interface DragSession {
  root: HTMLElement;
  handle: HTMLElement;
  pointerId: number;
  startPageX: number;
  startPageY: number;
  free: boolean;
  isEntry: boolean;
  started: boolean;
  gridStep: number;
  // The dragged element first, then the rest of the group (if any).
  items: DragItem[];
  coords: HTMLElement | null;
}

/**
 * Drag-to-position for `.xNgEditableDragXY` elements (entries of the messy
 * and mashup templates, menus, site heading, banners, additional text,
 * shopping cart) inside the (same-origin) preview iframe.
 *
 * Elements are dragged by their `.xHandle` with native pointer events.
 * `setPointerCapture` keeps the moves coming even when the pointer leaves
 * the iframe, which an editor-document drag library like `@angular/cdk`'s
 * can't do. Positions snap to the `pageLayout/gridStep` grid and are kept
 * inside the page's top/left edges; horizontal/vertical guide lines and an
 * `X:… Y:…` badge show the position. Shift + dragging an entry moves all
 * entries of the section. On drop, the new `"left,top"` values are saved to
 * each element's `data-path` without rerendering the preview: the elements
 * are already in their final position.
 */
@Injectable({
  providedIn: 'root',
})
export class DragPositionService {
  private boundDocument: Document | null = null;
  private session: DragSession | null = null;
  private hoveredHandle: HTMLElement | null = null;
  private handlesObserver: MutationObserver | null = null;
  private handlesFrame: number | null = null;
  private handlesFrameWindow: Window | null = null;

  constructor(private store: Store) {}

  /**
   * Called every time the preview iframe (re)loads; safe to call repeatedly
   * since an already-bound document is skipped.
   */
  attach(iframe: HTMLIFrameElement) {
    const doc = iframe.contentDocument;

    if (!doc || doc === this.boundDocument) {
      return;
    }

    this.boundDocument = doc;
    this.session = null;
    this.hoveredHandle = null;

    // A frame requested on the previous (now unloaded) window may never run,
    // which would block all handle updates on the new document.
    if (this.handlesFrame !== null) {
      this.handlesFrameWindow?.cancelAnimationFrame(this.handlesFrame);
      this.handlesFrame = null;
    }

    doc.addEventListener('pointerdown', (event) =>
      this.onPointerDown(event, doc),
    );
    doc.addEventListener('pointermove', (event) => this.onPointerMove(event));
    doc.addEventListener('pointerup', (event) => this.onPointerUp(event));
    doc.addEventListener('pointercancel', (event) =>
      this.onPointerCancel(event),
    );
    // Fires after a normal `pointerup` too, when the session is already
    // over; while it's still open, the capture was lost some other way (e.g.
    // a rerender replaced the dragged element).
    doc.addEventListener('lostpointercapture', (event) =>
      this.onPointerCancel(event),
    );

    // Capture phase, so a handle click never reaches the element's own
    // click listeners (e.g. the "create new entry" button creating an entry)
    // and never follows the `href="#"` of an entry's move handle.
    doc.addEventListener(
      'click',
      (event) => {
        if (this.findHandle(event.target)) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      true,
    );

    doc.addEventListener('mouseover', (event) => this.onMouseOver(event));
    doc.addEventListener('mouseout', (event) => this.onMouseOut(event));

    // Rerenders replace whole regions of the page (entries, menus, heading),
    // so handles are (re)created and (re)positioned after every DOM change.
    this.handlesObserver?.disconnect();
    this.handlesObserver = new MutationObserver(() =>
      this.scheduleHandlesUpdate(doc),
    );
    this.handlesObserver.observe(doc.documentElement, {
      childList: true,
      subtree: true,
    });
    this.updateHandles(doc);
  }

  /**
   * The drag root and its handle for an event target, if the target is
   * (inside) the root's own handle.
   */
  private findHandle(
    target: EventTarget | null,
  ): { root: HTMLElement; handle: HTMLElement } | null {
    const handle = (target as Element)?.closest?.(
      `.${HANDLE_CLASS}`,
    ) as HTMLElement | null;
    const root = handle?.closest(DRAG_ROOT_SELECTOR) as HTMLElement | null;

    if (!handle || !root || root.querySelector(`.${HANDLE_CLASS}`) !== handle) {
      return null;
    }

    return { root, handle };
  }

  private onPointerDown(event: PointerEvent, doc: Document) {
    // A session whose element was replaced mid-drag may never get its
    // `pointerup`; don't let it block new drags.
    if (this.session && !this.session.root.isConnected) {
      this.cancelSession(this.endSession(this.session.pointerId));
    }

    if (this.session || !event.isPrimary || event.button !== 0) {
      return;
    }

    const found = this.findHandle(event.target);

    if (!found) {
      return;
    }

    // Prevents text selection and the compatibility mouse events.
    event.preventDefault();

    try {
      found.handle.setPointerCapture(event.pointerId);
    } catch {
      // The pointer is no longer active; moves still arrive while it stays
      // inside the iframe.
    }

    this.session = {
      root: found.root,
      handle: found.handle,
      pointerId: event.pointerId,
      startPageX: event.pageX,
      startPageY: event.pageY,
      free: found.root.matches(FREE_DRAGGABLE_SELECTOR),
      isEntry: found.root.classList.contains(ENTRY_CLASS),
      started: false,
      gridStep: 1,
      items: [{ el: found.root, start: this.readPosition(found.root, doc) }],
      coords: null,
    };
  }

  private onPointerMove(event: PointerEvent) {
    const session = this.session;

    if (!session || event.pointerId !== session.pointerId) {
      return;
    }

    const dx = event.pageX - session.startPageX;
    const dy = event.pageY - session.startPageY;

    if (!session.started) {
      if (dx === 0 && dy === 0) {
        return;
      }
      this.startDrag(session, event);
    }

    const [dragged, ...others] = session.items;
    let position: Position = {
      left: dragged.start.left + dx,
      top: dragged.start.top + dy,
    };

    if (!session.free) {
      position = clampPosition(
        {
          left: snapToGrid(position.left, session.gridStep),
          top: snapToGrid(position.top, session.gridStep),
        },
        session.isEntry,
      );
    }

    let delta: Position = {
      left: position.left - dragged.start.left,
      top: position.top - dragged.start.top,
    };

    // A group moves as one block, so none of its entries leaves the page;
    // entries that were already off it get pulled onto the edge.
    if (others.length) {
      delta = clampGroupDelta(
        delta,
        session.items.map(({ start }) => start),
        session.isEntry,
      );
    }

    session.items.forEach(({ el, start }) => {
      const moved = {
        left: start.left + delta.left,
        top: start.top + delta.top,
      };

      this.writePosition(
        el,
        session.free ? moved : clampPosition(moved, session.isEntry),
      );
    });

    if (session.coords) {
      session.coords.textContent = `X:${dragged.start.left + delta.left} Y:${dragged.start.top + delta.top}`;
    }

    this.drawGuideLines(session.root);
  }

  /**
   * First actual move of a pointer-down on a handle.
   */
  private startDrag(session: DragSession, event: PointerEvent) {
    const root = session.root;
    const doc = root.ownerDocument;

    session.started = true;

    if (session.free) {
      // The button is placed via `right`; `left` takes over while dragging.
      root.style.right = 'auto';
      return;
    }

    session.gridStep = this.readGridStep();

    if (event.shiftKey && session.isEntry) {
      const groupItems = Array.from(
        doc.querySelectorAll<HTMLElement>(GROUP_SELECTOR),
      )
        .filter((el) => el !== root)
        .map((el) => ({ el, start: this.readPosition(el, doc) }));

      session.items = [...session.items, ...groupItems];
    }

    root.classList.add(EDITING_CLASS);
    session.coords = doc.createElement('div');
    session.coords.id = COORDS_ID;
    root.prepend(session.coords);
    this.showGuideLines(root);
  }

  private onPointerUp(event: PointerEvent) {
    const session = this.endSession(event.pointerId);

    if (!session?.started) {
      return;
    }

    // Lines stay while the pointer rests on the handle, until it leaves it.
    if (this.isPointerOverHandle(event, session.handle)) {
      this.hoveredHandle = session.handle;
    } else {
      this.hideGuideLines();
    }

    if (session.free) {
      return;
    }

    this.save(session);
    this.updateHandlePositions(session.root.ownerDocument);
  }

  /**
   * The browser took over the pointer (e.g. a touch scroll) or the dragged
   * element was replaced: put everything back where it was.
   */
  private onPointerCancel(event: PointerEvent) {
    this.cancelSession(this.endSession(event.pointerId));
  }

  private cancelSession(session: DragSession | null) {
    if (!session?.started) {
      return;
    }

    this.hideGuideLines();
    session.items.forEach(({ el, start }) => this.writePosition(el, start));
  }

  private endSession(pointerId: number): DragSession | null {
    const session = this.session;

    if (!session || pointerId !== session.pointerId) {
      return null;
    }

    this.session = null;

    if (session.handle.hasPointerCapture(session.pointerId)) {
      session.handle.releasePointerCapture(session.pointerId);
    }

    session.coords?.remove();
    session.root.classList.remove(EDITING_CLASS);

    return session;
  }

  private save(session: DragSession) {
    const doc = session.root.ownerDocument;
    const win = doc.defaultView;
    const offset = centeringOffset(win, doc.getElementById('contentContainer'));
    // A detached element (replaced by a rerender mid-drag) has no
    // computed position left to save.
    const changed = session.items.filter(({ el, start }) => {
      if (!el.isConnected || !el.dataset['path']) {
        return false;
      }

      const position = this.readPosition(el, doc);
      return position.left !== start.left || position.top !== start.top;
    });

    if (!changed.length) {
      return;
    }

    const updates: PositionUpdate[] = changed.map(({ el }) => ({
      path: el.dataset['path'],
      value: toSavedValue(
        this.readPosition(el, doc),
        offset,
        el.classList.contains(FIXED_CLASS),
      ),
    }));

    let actions: any[];

    try {
      actions = resolveDragPositionActions(updates);
    } catch (error) {
      console.error(error);
      changed.forEach(({ el, start }) => this.writePosition(el, start));
      return;
    }

    changed.forEach(({ el }) => el.classList.add(SAVING_CLASS));

    this.store.dispatch(actions).subscribe({
      next: () =>
        changed.forEach(({ el }) => el.classList.remove(SAVING_CLASS)),
      error: () => {
        changed.forEach(({ el, start }) => {
          el.classList.remove(SAVING_CLASS);
          this.writePosition(el, start);
        });
        this.updateHandlePositions(doc);
      },
    });
  }

  private readGridStep(): number {
    const pageLayout = this.store
      .selectSnapshot(SiteSettingsState.getCurrentSiteSettings)
      ?.find((group) => group.slug === 'pageLayout');
    const gridStep = pageLayout?.settings.find(
      (setting) => setting.slug === 'gridStep',
    );

    return normalizeGridStep(gridStep?.value);
  }

  /**
   * The used `left`/`top` of a positioned element, even when it's placed
   * via `right`/`bottom` or not placed at all (`auto`).
   */
  private readPosition(el: HTMLElement, doc: Document): Position {
    const computed = doc.defaultView.getComputedStyle(el);

    return {
      left: Math.round(parseFloat(computed.left)) || 0,
      top: Math.round(parseFloat(computed.top)) || 0,
    };
  }

  private writePosition(el: HTMLElement, position: Position) {
    el.style.left = `${position.left}px`;
    el.style.top = `${position.top}px`;
  }

  private isPointerOverHandle(event: PointerEvent, handle: HTMLElement) {
    const doc = handle.ownerDocument;
    const el = doc.elementFromPoint(event.clientX, event.clientY);

    return !!el && handle.contains(el);
  }

  private onMouseOver(event: MouseEvent) {
    const found = this.findHandle(event.target);

    if (
      !found ||
      found.root.matches(FREE_DRAGGABLE_SELECTOR) ||
      found.handle === this.hoveredHandle
    ) {
      return;
    }

    this.hoveredHandle = found.handle;
    this.showGuideLines(found.root);
  }

  private onMouseOut(event: MouseEvent) {
    if (
      !this.hoveredHandle ||
      this.hoveredHandle.contains(event.relatedTarget as Node | null)
    ) {
      return;
    }

    this.hoveredHandle = null;

    // Kept visible while dragging; `onPointerUp` hides them if the pointer
    // is no longer over the handle when dropped.
    if (!this.session?.started) {
      this.hideGuideLines();
    }
  }

  /**
   * A horizontal line through the element's top and a vertical one through
   * its left edge, each spanning the whole page. The vertical line goes into
   * the centered container (when there is one) for in-flow elements, since
   * their `left` is relative to it.
   */
  private showGuideLines(root: HTMLElement) {
    const doc = root.ownerDocument;
    const isFixed = root.classList.contains(FIXED_CLASS);
    const lineX = this.getGuideLine(doc, GUIDE_LINE_X_ID);
    const lineY = this.getGuideLine(doc, GUIDE_LINE_Y_ID);
    const centeredContainer = isFixed
      ? null
      : (doc.querySelector(
          `#contentContainer.${CENTERED_CLASS}, #allContainer.${CENTERED_CLASS}`,
        ) as HTMLElement | null);

    lineX.style.width = `${doc.documentElement.scrollWidth}px`;
    lineY.style.height = `${doc.documentElement.scrollHeight}px`;
    // A fixed element's position is viewport-relative, so are its lines.
    lineX.style.position = isFixed ? 'fixed' : '';
    lineY.style.position = isFixed ? 'fixed' : '';

    doc.body.appendChild(lineX);
    (centeredContainer ?? doc.body).appendChild(lineY);

    this.drawGuideLines(root);
  }

  private drawGuideLines(root: HTMLElement) {
    const doc = root.ownerDocument;
    const lineX = doc.getElementById(GUIDE_LINE_X_ID);
    const lineY = doc.getElementById(GUIDE_LINE_Y_ID);

    if (!lineX || !lineY) {
      return;
    }

    const position = this.readPosition(root, doc);
    lineX.style.top = `${position.top}px`;
    lineY.style.left = `${position.left}px`;
  }

  private hideGuideLines() {
    this.boundDocument?.getElementById(GUIDE_LINE_X_ID)?.remove();
    this.boundDocument?.getElementById(GUIDE_LINE_Y_ID)?.remove();
  }

  private getGuideLine(doc: Document, id: string): HTMLElement {
    let line = doc.getElementById(id);

    if (!line) {
      line = doc.createElement('div');
      line.id = id;
      line.className = GUIDE_LINE_CLASS;
    }

    return line;
  }

  private scheduleHandlesUpdate(doc: Document) {
    if (this.handlesFrame !== null || this.session) {
      return;
    }

    const win = doc.defaultView;

    if (!win) {
      return;
    }

    this.handlesFrameWindow = win;
    this.handlesFrame = win.requestAnimationFrame(() => {
      this.handlesFrame = null;
      this.updateHandles(doc);
    });
  }

  private updateHandles(doc: Document) {
    this.ensureHandles(doc);
    this.updateHandlePositions(doc);
  }

  /**
   * Every draggable needs a handle; entries render theirs (the move button
   * in the entry toolbar), most other elements get a plain one added here.
   */
  private ensureHandles(doc: Document) {
    doc
      .querySelectorAll<HTMLElement>(`.${DRAGGABLE_CLASS}`)
      .forEach((el) => {
        if (!el.querySelector(`.${HANDLE_CLASS}`)) {
          const handle = doc.createElement('div');
          handle.className = HANDLE_CLASS;
          el.appendChild(handle);
        }
      });
  }

  /**
   * Handles sit to the left of their element (negative `margin-left`), so
   * for an element close to the page's left edge the handle is shifted right
   * to stay on screen.
   */
  private updateHandlePositions(doc: Document) {
    const win = doc.defaultView;

    if (!win) {
      return;
    }

    doc
      .querySelectorAll<HTMLElement>(`.${DRAGGABLE_CLASS}:not(.${ENTRY_CLASS})`)
      .forEach((el) => {
        const handle = el.querySelector<HTMLElement>(`.${HANDLE_CLASS}`);

        if (!handle) {
          return;
        }

        const handlePad = Math.abs(
          parseInt(win.getComputedStyle(handle).marginLeft, 10) || 0,
        );
        const left = parseInt(win.getComputedStyle(el).left, 10) || 0;
        const handleLeft = left < handlePad ? `${handlePad - left}px` : '0px';

        if (handle.style.left !== handleLeft) {
          handle.style.left = handleLeft;
        }
      });
  }
}
