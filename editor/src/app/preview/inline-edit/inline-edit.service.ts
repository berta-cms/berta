import { Injectable } from '@angular/core';
import {
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Store } from '@ngxs/store';

import { InlineEditOverlayComponent } from './inline-edit-overlay.component';
import {
  InlineEditRichTextOverlayComponent,
  RICH_TEXT_MIN_HEIGHT,
} from './inline-edit-rich-text-overlay.component';
import { resolveInlineEditAction } from './inline-edit-path.resolver';

const EDITABLE_SELECTOR = '.xNgEditable, .xNgEditableTA';
const MULTILINE_CLASS = 'xNgEditableTA';
const RICH_TEXT_SELECTOR = '.xNgEditableRTE, .xNgEditableRTESimple';
const RICH_TEXT_SIMPLE_CLASS = 'xNgEditableRTESimple';
const DROPDOWN_BOX_SELECTOR = '.xEntryDropdownBox';
const EDIT_WRAP_BUTTONS_SELECTOR = '.xEntryEditWrapButtons';
const EDIT_WRAP_SELECTOR = '.xEntryEditWrap';
const CHECKBOX_SELECTOR = '.xNgEditableCheckBox';
const FIXED_PROPERTY_CLASS = 'xProperty-fixed';
const SAVING_CLASS = 'xSaving';
const RICH_TEXT_STYLES_TO_COPY = [
  'font-size',
  'font-family',
  'font-weight',
  'font-style',
  'text-transform',
  'line-height',
  'letter-spacing',
  'color',
];
// CDK's flexible-position strategy shrinks the overlay's width to fit
// whatever space remains near a viewport edge by default — these are the
// floor it's never allowed to shrink below, so the toolbar doesn't get
// cramped for a field sitting close to the edge. `width` (below) stays the
// preferred size; `minWidth` only kicks in when there isn't room for it.
const RICH_TEXT_MIN_WIDTH_FULL = 560;
const RICH_TEXT_MIN_WIDTH_SIMPLE = 300;
// TinyMCE loads/renders asynchronously, so without a starting height the
// overlay would start at its (empty) natural height and visibly pop once
// ready. Pre-size to TinyMCE's own `min_height` floor plus a rough
// single-toolbar-row estimate — close enough that the first `resize`
// emission (which immediately corrects this to the real measured height)
// rarely needs to grow it by much.
const RICH_TEXT_TOOLBAR_CHROME_ESTIMATE = 44;
const RICH_TEXT_INITIAL_HEIGHT =
  RICH_TEXT_MIN_HEIGHT + RICH_TEXT_TOOLBAR_CHROME_ESTIMATE;

interface CheckBoxRollback {
  entryWasFixed: boolean;
  entryLeft: string;
}

interface OpenEdit {
  el: HTMLElement;
  iframe: HTMLIFrameElement;
  originalHtml: string;
  overlayRef: OverlayRef;
  positionStrategy: FlexibleConnectedPositionStrategy;
  legacyHideContainer: HTMLElement | null;
  suppressLegacyHideClose: (event: Event) => void;
  // Rich-text overlays use a fixed toolbar-driven size rather than tracking
  // the edited element's own (much smaller) rendered box, so geometry refreshes must reposition
  // without also resetting the overlay back to that box's size.
  syncSizeOnRefresh: boolean;
}

/**
 * Click-to-edit for `.xNgEditable` (single-line) and `.xNgEditableTA`
 * (multi-line) elements rendered inside the (same-origin) preview iframe,
 * plus `.xNgEditableRTE`/`.xNgEditableRTESimple` rich-text fields and
 * `.xNgEditableCheckBox` toggles. Editing happens in a CDK overlay in the
 * parent document, positioned over the edited element.
 */
@Injectable({
  providedIn: 'root',
})
export class InlineEditService {
  private boundDocument: Document | null = null;
  private openEdit: OpenEdit | null = null;

  constructor(
    private overlay: Overlay,
    private store: Store,
  ) {
    // The overlay's position is a static snapshot (see `createVirtualOrigin`),
    // not a live element CDK can re-measure on its own, so scrolling or
    // resizing anywhere has to explicitly trigger a re-anchor.
    window.addEventListener('resize', () => this.refreshOpenEditGeometry());
    window.addEventListener(
      'scroll',
      () => this.refreshOpenEditGeometry(),
      true,
    );
  }

  /**
   * Called every time the preview iframe (re)loads. Binds a single delegated
   * click listener plus a scroll listener to the new document; safe to call
   * repeatedly since it skips re-binding an already-bound document, so each
   * navigation attaches exactly one of each.
   */
  attach(iframe: HTMLIFrameElement) {
    const doc = iframe.contentDocument;

    if (!doc || doc === this.boundDocument) {
      return;
    }

    this.closeOpenOverlay();
    this.boundDocument = doc;

    doc.addEventListener('click', (event) => {
      const target = (event.target as HTMLElement)?.closest(
        EDITABLE_SELECTOR,
      ) as HTMLElement | null;

      if (!target) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      this.openEditor(target, iframe);
    });

    // `.xNgEditableCheckBox` fields (e.g. the entry dropdown's "Fixed
    // position"/"Marked" toggles) save immediately on click.
    doc.addEventListener('click', (event) => {
      const target = (event.target as HTMLElement)?.closest(
        CHECKBOX_SELECTOR,
      ) as HTMLElement | null;

      if (!target) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      this.toggleCheckBox(target, iframe);
    });

    doc.addEventListener('click', (event) => {
      const target = (event.target as HTMLElement)?.closest(
        RICH_TEXT_SELECTOR,
      ) as HTMLElement | null;

      if (!target) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      this.openRichTextEditor(target, iframe);
    });

    // The previewed site's own page can scroll independently of the app
    // shell around it.
    iframe.contentWindow?.addEventListener('scroll', () =>
      this.refreshOpenEditGeometry(),
    );
  }

  /**
   * Click-to-toggle-and-save-immediately handling for `.xNgEditableCheckBox`
   * fields. Unlike the text-overlay fields above, there's no separate
   * open/edit step: the checked state flips and saves in the same click.
   */
  private toggleCheckBox(el: HTMLElement, iframe: HTMLIFrameElement) {
    if (el.classList.contains(SAVING_CLASS)) {
      return;
    }

    const path = el.dataset['path'];
    const input = el.querySelector('input') as HTMLInputElement | null;

    if (!path || !input) {
      return;
    }

    const wasChecked = input.classList.contains('checked');
    const isFixedProperty = el.classList.contains(FIXED_PROPERTY_CLASS);
    const entry = isFixedProperty
      ? (el.closest('.xEntry') as HTMLElement | null)
      : null;
    const rollback: CheckBoxRollback | null = entry
      ? {
          entryWasFixed: entry.classList.contains('xFixed'),
          entryLeft: entry.style.left,
        }
      : null;

    input.classList.toggle('checked');
    const value = input.classList.contains('checked') ? '1' : '0';

    if (isFixedProperty && entry) {
      this.applyFixedPositionSideEffect(entry, value === '1', iframe);
    }

    el.classList.add(SAVING_CLASS);

    let action;
    try {
      action = resolveInlineEditAction(path, value);
    } catch (error) {
      console.error(error);
      this.rollbackCheckBox(el, input, wasChecked, entry, rollback);
      return;
    }

    this.store.dispatch(action).subscribe({
      next: () => el.classList.remove(SAVING_CLASS),
      error: () => {
        el.classList.remove(SAVING_CLASS);
        this.rollbackCheckBox(el, input, wasChecked, entry, rollback);
      },
    });
  }

  /**
   * Toggling `xProperty-fixed` also flips `.xFixed` on the ancestor
   * `.xEntry` and, when the page layout is centered, compensates the
   * entry's inline `left` for the coordinate-frame change `.xFixed` causes
   * (`position: fixed` switches it from container-relative to
   * viewport-relative). This compensation must stay exact: the engine's
   * drag-and-drop handler (`BertaEditorBase.js`) reads/re-applies the same
   * formula at drag-end, so an uncompensated value here would be silently
   * corrupted the next time the entry is dragged.
   */
  private applyFixedPositionSideEffect(
    entry: HTMLElement,
    becomingFixed: boolean,
    iframe: HTMLIFrameElement,
  ) {
    const contentWindow = iframe.contentWindow;
    const container =
      iframe.contentDocument?.getElementById('contentContainer');

    entry.classList.toggle('xFixed', becomingFixed);

    if (container?.classList.contains('xCentered') && contentWindow) {
      const currentLeft =
        parseInt(contentWindow.getComputedStyle(entry).left || '0', 10) || 0;
      const delta =
        (contentWindow.innerWidth - container.getBoundingClientRect().width) /
        2;

      entry.style.left = `${becomingFixed ? currentLeft + delta : currentLeft - delta}px`;
    }
  }

  private rollbackCheckBox(
    el: HTMLElement,
    input: HTMLInputElement,
    wasChecked: boolean,
    entry: HTMLElement | null,
    rollback: CheckBoxRollback | null,
  ) {
    el.classList.remove(SAVING_CLASS);
    input.classList.toggle('checked', wasChecked);

    if (entry && rollback) {
      entry.classList.toggle('xFixed', rollback.entryWasFixed);
      entry.style.left = rollback.entryLeft;
    }
  }

  /**
   * Finds the ancestor element (if any) whose `mouseleave` handler in the
   * engine's `BertaEditor.js` would prematurely hide `el`'s editor purely
   * because the CDK overlay covering `el` lives in the parent document, not
   * the iframe — see `openEditor`'s `suppressLegacyHideClose` for how the
   * returned element is used. Two distinct hide mechanisms are covered,
   * each toggling a different CSS-driven visibility class on a different
   * ancestor:
   *  - `.xEntryDropdownBox` (width/weight/cartAttributes, nested inside the
   *    entry's "..." dropdown menu): `mouseleave` is bound directly on this
   *    element, toggling its own `.xVisible` class.
   *  - the tags field (nested inside `.xEntryEditWrapButtons`): `mouseleave`
   *    is bound on `.xEntryEditWrap` — the OUTER wrapper, not
   *    `.xEntryEditWrapButtons` itself (`BertaEditor.js`'s
   *    `entryOnHover`/`entryOnUnHover`) — removing `.xEntryHover` from the
   *    ancestor `.xEntry`, which `.xEntryEditWrapButtons`'s own visibility
   *    is styled to depend on (`editor.css.php`). `.xEntryEditWrap` also
   *    contains title/url/description (via `entryContents`), which have no
   *    such mouseleave-driven hide behavior at all, so this only applies
   *    when `el` is specifically inside `.xEntryEditWrapButtons` — never
   *    unconditionally for every field under `.xEntryEditWrap`.
   */
  private findLegacyHideContainer(el: HTMLElement): HTMLElement | null {
    const dropdownBox = el.closest(DROPDOWN_BOX_SELECTOR) as HTMLElement | null;

    if (dropdownBox) {
      return dropdownBox;
    }

    const editWrapButtons = el.closest(
      EDIT_WRAP_BUTTONS_SELECTOR,
    ) as HTMLElement | null;

    return editWrapButtons
      ? (editWrapButtons.closest(EDIT_WRAP_SELECTOR) as HTMLElement | null)
      : null;
  }

  private openEditor(el: HTMLElement, iframe: HTMLIFrameElement) {
    const path = el.dataset['path'];

    if (!path) {
      return;
    }

    this.closeOpenOverlay();

    const multiline = el.classList.contains(MULTILINE_CLASS);
    const initialValue = this.readFieldValue(el, multiline);
    const originalHtml = el.innerHTML;

    // Server templates are free to format markup across multiple indented
    // lines, leaving real leading/trailing whitespace in `el`'s content —
    // harmless under normal CSS collapsing, but it must be removed before
    // measuring/editing (not just trimmed from the *string* `readFieldValue`
    // reads out), otherwise the `pre-wrap` override below turns that
    // incidental whitespace into a visible line break.
    el.innerHTML = el.innerHTML.trim();

    // A <textarea> always preserves whitespace and soft-wraps, regardless of
    // CSS `white-space` on it — that's not something we can override. `el`
    // normally collapses whitespace instead (default `white-space: normal`),
    // so while editing, make it match the textarea's actual behavior instead
    // of the other way around — otherwise a leading/repeated space collapses
    // in `el`'s measurement but not in the textarea's display, undersizing
    // the overlay. `pre-wrap` still wraps normally, so the existing
    // wrap-to-multiple-lines behavior is unaffected. Set *before* the first
    // measurement below, so the initial overlay size/position already
    // reflects the same rendering used throughout editing.
    el.style.whiteSpace = 'pre-wrap';

    // A block-level `el` (e.g. a narrow table-column field) stretches to
    // fill its container's width regardless of content, unlike an inline
    // element — so a single unbroken word longer than that container
    // silently overflows past `el`'s own measured box instead of growing
    // it. `fit-content` uses the standard shrink-to-fit algorithm: content
    // that already wraps within the available width is unaffected, but an
    // overflowing unbroken word is now reflected in the measured width
    // instead of being invisibly clamped.
    el.style.width = 'fit-content';

    // Safety net regardless of measurement precision: hide `el`'s own
    // rendering while editing (dimensions/wrapping are unaffected, so
    // measurement still works) so nothing it renders — overflow from the
    // above or any other edge case — can ever show through/around the
    // overlay. `visibility` (not `opacity`) also stops it receiving pointer
    // events, in case the overlay's coverage is ever imperfect for a frame.
    el.style.visibility = 'hidden';

    const origin = this.createVirtualOrigin(el, iframe);
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions([
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'top',
        },
      ]);
    const overlayRef = this.overlay.create({
      positionStrategy,
      width: origin.width,
      height: origin.height,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    const componentRef = overlayRef.attach(
      new ComponentPortal(InlineEditOverlayComponent),
    );
    componentRef.instance.value = initialValue;
    componentRef.instance.fontStyle = this.readFontStyle(el);
    componentRef.instance.multiline = multiline;

    // The overlay lives in the parent document, so whenever it covers `el`,
    // the iframe stops receiving pointer events there — from its own
    // perspective, the mouse just left whatever was underneath. Two
    // different `BertaEditor.js` `mouseleave` handlers can react to
    // that as if the mouse had genuinely left the field's whole surrounding
    // area, closing something that should have stayed open while editing:
    // `.xEntryDropdownBox` (e.g. cartAttributes/weight, nested inside the
    // entry's dropdown menu) removes its own `.xVisible` on `mouseleave`;
    // `.xEntryEditWrap` (e.g. the tags field, nested inside
    // `.xEntryEditWrapButtons`) removes `.xEntryHover` from the ancestor
    // `.xEntry` on `mouseleave`, which `.xEntryEditWrapButtons`'s own
    // visibility is styled to depend on. The overlay's computed bounds can be fractional/subpixel and
    // don't always cover `el` with pixel-perfect precision, so moving the
    // cursor within the field can fire more than one of these spurious
    // events, not just one at open time — classify each one instead of only
    // eating the first: if the cursor is still geometrically over the
    // overlay when this fires, it's spurious (suppress); if the cursor has
    // genuinely moved elsewhere, it's a real departure — let it through so
    // the container still closes/hides, and also close our own overlay in
    // sync (via a real blur, running the normal save/cancel logic) since an
    // overlay in a different document never gets auto-blurred by its
    // container hiding.
    const legacyHideContainer = this.findLegacyHideContainer(el);
    const suppressLegacyHideClose = (event: MouseEvent) => {
      const overlayRect = overlayRef.overlayElement.getBoundingClientRect();
      const iframeRect = iframe.getBoundingClientRect();
      const x = iframeRect.left + event.clientX;
      const y = iframeRect.top + event.clientY;
      const stillOverOverlay =
        x >= overlayRect.left &&
        x <= overlayRect.right &&
        y >= overlayRect.top &&
        y <= overlayRect.bottom;

      if (stillOverOverlay) {
        event.stopImmediatePropagation();
      } else {
        componentRef.instance.blurNow();
      }
    };

    if (legacyHideContainer) {
      legacyHideContainer.addEventListener(
        'mouseleave',
        suppressLegacyHideClose,
        true,
      );
    }

    this.openEdit = {
      el,
      iframe,
      originalHtml,
      overlayRef,
      positionStrategy,
      legacyHideContainer,
      suppressLegacyHideClose,
      syncSizeOnRefresh: true,
    };

    componentRef.instance.input.subscribe((draftValue: string) => {
      // Write the draft into the real element and re-measure its actual
      // rendered box: the page's own CSS (container width, wrapping, text
      // alignment) already knows how to lay this out correctly, so the
      // overlay can just match it instead of reimplementing text wrapping.
      if (multiline) {
        el.innerHTML = this.textToDisplayHtml(draftValue);
      } else {
        el.textContent = draftValue.trim().length ? draftValue : '\u00A0';
      }

      this.refreshOpenEditGeometry();
    });

    componentRef.instance.cancel.subscribe(() => this.closeOpenOverlay());

    componentRef.instance.save.subscribe((newValue: string) => {
      let action;
      let finalValue = newValue;
      let storedValue: string;

      if (multiline) {
        storedValue = this.textToHtml(newValue);
      } else {
        finalValue = this.applyUnits(el, newValue);
        finalValue = this.applyCssUnits(el, finalValue);
        finalValue = this.applyPriceParsing(el, finalValue);
        storedValue = this.applyRawEncoding(el, finalValue);
      }

      try {
        action = resolveInlineEditAction(path, storedValue);
      } catch (error) {
        console.error(error);
        this.closeOpenOverlay();
        return;
      }

      this.store.dispatch(action).subscribe({
        next: () => {
          const tags = el.classList.contains('xFormatModifier-toTags')
            ? this.formatTags(finalValue)
            : null;

          this.writeFieldValue(el, tags ? tags.display : finalValue, multiline);
          this.syncTitle(el, tags ? tags.real : finalValue);
          this.closeOpenOverlay(false);
        },
        error: () => this.closeOpenOverlay(),
      });
    });
  }

  /**
   * `.xNgEditableRTE`/`.xNgEditableRTESimple` fields (TinyMCE-backed rich
   * text). Unlike `openEditor`'s plain-text overlay, the value is raw HTML
   * (no entity-encoding round-trip), sizing is fixed rather than tracking
   * the field's own (usually much smaller) rendered box, and there's no
   * live-draft mirroring into `el` while typing — TinyMCE's own canvas is
   * the editing surface. Saving only happens via the overlay's TinyMCE
   * toolbar Save button; a CDK backdrop discards the draft on click-away
   * (see `InlineEditRichTextOverlayComponent`).
   */
  private openRichTextEditor(el: HTMLElement, iframe: HTMLIFrameElement) {
    const path = el.dataset['path'];

    if (!path) {
      return;
    }

    this.closeOpenOverlay();

    const simple = el.classList.contains(RICH_TEXT_SIMPLE_CLASS);
    const initialValue = this.readRichTextValue(el);
    const contentStyle = this.readRichTextStyles(el);
    const originalHtml = el.innerHTML;

    el.style.visibility = 'hidden';

    const origin = this.createVirtualOrigin(el, iframe);
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions([
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'top',
        },
      ]);
    // Full toolbar uses a fixed 563px regardless of the field's own width;
    // simple toolbar matches the field's width. Kept in a local
    // since the `resize` subscription below needs to reuse it on every
    // resize, not just at creation.
    const overlayWidth = simple ? origin.width : 563;
    const overlayRef = this.overlay.create({
      positionStrategy,
      width: overlayWidth,
      minWidth: simple ? RICH_TEXT_MIN_WIDTH_SIMPLE : RICH_TEXT_MIN_WIDTH_FULL,
      // Pre-sized close to TinyMCE's own `min_height` floor so there's no
      // visible pop for content that fits within it — the `resize`
      // subscription below immediately corrects this once TinyMCE reports
      // its actual rendered height, and again on every resize as the user
      // types (the `autoresize` plugin grows/shrinks the content area to
      // fit).
      height: RICH_TEXT_INITIAL_HEIGHT,
      hasBackdrop: true,
      // Angular CDK 21 renders overlays via the native Popover API by
      // default (host gets `popover="manual"`), which promotes them to the
      // browser's top layer — unconditionally above the entire normal
      // stacking order, regardless of z-index. TinyMCE's own popups
      // (dialogs/menus/tooltips) are ordinary CSS-positioned elements, not
      // top-layer, so a top-layer overlay always renders above them no
      // matter what z-index either side uses. Opting out here drops back
      // to classic z-index stacking, where the low z-index on
      // `.berta-rich-text-overlay-pane`/`-backdrop` (styles.scss) actually
      // means something: TinyMCE's own default z-index (1100-1300) then
      // properly outranks it.
      usePopover: false,
      backdropClass: [
        'cdk-overlay-transparent-backdrop',
        'berta-rich-text-overlay-backdrop',
      ],
      panelClass: 'berta-rich-text-overlay-pane',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    const componentRef = overlayRef.attach(
      new ComponentPortal(InlineEditRichTextOverlayComponent),
    );
    componentRef.instance.value = initialValue;
    componentRef.instance.simple = simple;
    componentRef.instance.contentStyle = contentStyle;

    // The only `.xNgEditableRTE` field (`description`, `_entryContents.twig`)
    // never sits inside `.xEntryEditWrapButtons` or `.xEntryDropdownBox`, so
    // there's no hide container to suppress here.
    this.openEdit = {
      el,
      iframe,
      originalHtml,
      overlayRef,
      positionStrategy,
      legacyHideContainer: null,
      suppressLegacyHideClose: () => {},
      syncSizeOnRefresh: false,
    };

    overlayRef.backdropClick().subscribe(() => this.closeOpenOverlay());

    // TinyMCE loads/renders asynchronously and then grows/shrinks with the
    // `autoresize` plugin as the user types — CDK has no built-in awareness
    // of content changing size, so every `resize` emission both resizes the
    // overlay to match and re-runs positioning (growth could push it
    // off-screen for a field near a viewport edge).
    componentRef.instance.resize.subscribe((height: number) => {
      overlayRef.updateSize({ width: overlayWidth, height });
      this.refreshOpenEditGeometry();
    });

    componentRef.instance.save.subscribe((html: string) => {
      let action;

      try {
        action = resolveInlineEditAction(path, html);
      } catch (error) {
        console.error(error);
        this.closeOpenOverlay();
        return;
      }

      this.store.dispatch(action).subscribe({
        next: () => {
          this.writeRichTextValue(el, html);
          this.closeOpenOverlay(false);
        },
        error: () => this.closeOpenOverlay(),
      });
    });
  }

  private readRichTextValue(el: HTMLElement): string {
    const isPlaceholder = !!el.querySelector(':scope > .xEmpty');

    return isPlaceholder ? '' : el.innerHTML.trim();
  }

  private writeRichTextValue(el: HTMLElement, html: string) {
    el.innerHTML = html.trim() !== '' ? html : this.emptyPlaceholderHtml(el);
  }

  /**
   * Copies the field's computed font/color styling onto the TinyMCE body so
   * the edited text doesn't look like a generic editor. Read before `el` is
   * hidden, same ordering as `readFontStyle`/`createVirtualOrigin` above.
   */
  private readRichTextStyles(el: HTMLElement): Record<string, string> {
    const view = el.ownerDocument.defaultView;

    if (!view) {
      return {};
    }

    const computed = view.getComputedStyle(el);
    const style: Record<string, string> = {};

    RICH_TEXT_STYLES_TO_COPY.forEach((prop) => {
      const value = computed.getPropertyValue(prop);
      if (value) {
        style[prop] = value;
      }
    });

    const body = el.closest('body');
    const bodyBackground = body
      ? view.getComputedStyle(body).getPropertyValue('background-color')
      : '';

    if (bodyBackground) {
      style['background-color'] = bodyBackground;
    }

    return style;
  }

  /**
   * When empty, the server renders a visible `.xEmpty` placeholder span
   * inside the element so the field stays visible/clickable.
   * The placeholder text is not the field's actual value, so it must be
   * excluded when reading the current value back out.
   *
   * The value is trimmed, since server templates are free to format
   * markup across multiple indented lines — harmless in normal CSS flow
   * (leading/trailing whitespace collapses), but it would otherwise leak
   * into the value verbatim once read via `innerHTML`/`textContent`.
   */
  private readFieldValue(el: HTMLElement, multiline: boolean): string {
    const isPlaceholder = !!el.querySelector(':scope > .xEmpty');

    if (isPlaceholder) {
      return '';
    }

    // `data-ng-edit-via-title` fields (entry width, cart price, tags) read
    // their editable raw value from `title` rather than the displayed
    // content. For cartPrice/tags the two differ (formatted/joined display
    // vs. raw value); width's two happen to be identical, but the flag stays
    // generic rather than special-casing which field needs it.
    if (!multiline && el.dataset['ngEditViaTitle']) {
      return (el.title ?? '').trim();
    }

    return multiline
      ? this.htmlToText(el.innerHTML.trim())
      : (el.textContent ?? '').trim();
  }

  private writeFieldValue(el: HTMLElement, value: string, multiline: boolean) {
    if (value.trim() !== '') {
      if (multiline) {
        el.innerHTML = this.textToHtml(value);
      } else {
        el.textContent = value;
      }
      return;
    }

    el.innerHTML = this.emptyPlaceholderHtml(el);
  }

  private emptyPlaceholderHtml(el: HTMLElement): string {
    const caption = el.dataset['emptyCaption'];
    return caption
      ? `<span class="xEmpty">&nbsp;${this.escapeHtml(caption)}&nbsp;</span>`
      : '';
  }

  /**
   * A field carrying an `xUnits-*` class (e.g. `weight` via
   * `xUnits-{{ weightUnits }}`) stores an integer with the unit suffix
   * appended (e.g. "5" with units "kg" saves as "5kg"), regardless of what
   * property it is — detected generically from the class, not hardcoded to
   * one field.
   */
  private applyUnits(el: HTMLElement, value: string): string {
    const match = el.className.match(/xUnits-(\S+)/);

    if (!match) {
      return value;
    }

    const numeric = parseInt(value, 10);

    return String(numeric || 0) + match[1];
  }

  /**
   * A field carrying `xCSSUnits-1` (currently only `content/width`) first
   * has a single space before a trailing unit collapsed ("300 px" ->
   * "300px"), then gets "px" appended when the value is a non-zero pure
   * integer; "0" is left as "0" (no suffix). An empty value fails the
   * numeric check (`parseInt("")` is `NaN`) and passes through untouched, so
   * the field is simply cleared. `Number(value) === parseInt(value, 10)` is
   * true only for values that are wholly an integer (e.g. rejects "12.5"
   * and "12abc").
   */
  private applyCssUnits(el: HTMLElement, value: string): string {
    if (!el.classList.contains('xCSSUnits-1')) {
      return value;
    }

    const normalized = value.replace(/\s(px|pt|em)$/i, '$1');

    if (Number(normalized) !== parseInt(normalized, 10)) {
      return normalized;
    }

    return normalized === '0' ? '0' : `${normalized}px`;
  }

  /**
   * On `xFormatModifier-toPrice` fields the saved value becomes a bare
   * `parseFloat` result, dropping any trailing formatting the user typed
   * (e.g. "19.990" -> "19.99"). A zero or unparseable result saves as
   * empty, so the field falls back to its `price` placeholder. The
   * currency-formatted display (`formatPrice`) comes from the entry rerender
   * that follows every successful entry save
   * (`TemplateRerenderService.handleSectionEntryUpdateRerender`), not from
   * the value written back here.
   */
  private applyPriceParsing(el: HTMLElement, value: string): string {
    if (!el.classList.contains('xFormatModifier-toPrice')) {
      return value;
    }

    const price = parseFloat(value);

    return price ? String(price) : '';
  }

  /**
   * Mirrors `Helpers::toTags` (`_api_app/app/Shared/Helpers.php`) and the two
   * differently-joined values `SectionEntriesDataService::saveValueByPath`
   * computes for a tags save: `display` becomes the visible content
   * (space-slash joined), `real` becomes `title` (comma-space joined).
   * Computed client-side rather than read out of the save response, so the
   * write-back can reuse the same success-callback shape as every other
   * field instead of threading the raw HTTP payload back to the
   * click-handling code. The entry rerender that follows the save
   * (`TemplateRerenderService.handleSectionEntryUpdateRerender`) then
   * replaces both with the state-rendered `tagList`.
   */
  private formatTags(value: string): { display: string; real: string } {
    const tags = Array.from(
      new Set(
        value
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      ),
    );

    return { display: tags.join(' / '), real: tags.join(', ') };
  }

  /**
   * Resyncs `title` after a successful save for `data-ng-edit-via-title`
   * fields, so the next edit opens with the new raw value. Assigning the DOM
   * `.title` property stores plain text, so no entity encoding/decoding is
   * needed. No-op for every other field.
   */
  private syncTitle(el: HTMLElement, value: string) {
    if (el.dataset['ngEditViaTitle']) {
      el.title = value;
    }
  }

  /**
   * Fields rendered with Twig's `|raw` filter (opted in via `data-ng-raw`,
   * e.g. site heading) bypass Twig's auto-escaping, so the stored value must
   * already be safe HTML. Fields rendered without `|raw` (the majority) must NOT be
   * pre-encoded here: Twig already escapes them at render time, so encoding
   * on top would double-escape (e.g. a saved "&amp;" would render literally
   * as "&amp;amp;" instead of "&").
   */
  private applyRawEncoding(el: HTMLElement, value: string): string {
    return el.dataset['ngRaw'] ? this.encodeEntities(value) : value;
  }

  /**
   * Encodes `&`/`<`/`>` for stored `|raw` values; `"` is deliberately left
   * literal, matching the existing stored-content convention.
   */
  private encodeEntities(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /**
   * General-purpose HTML escaping (quotes included) used for building markup
   * this service constructs itself — the `.xEmpty` placeholder span and
   * `.xNgEditableTA` content via `textToHtml`/`textToDisplayHtml`. Distinct
   * from `encodeEntities`, which intentionally leaves `"` literal to match
   * the stored-content convention.
   */
  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /**
   * `.xNgEditableTA` (multi-line) fields store literal `<br />` tags for line
   * breaks rather than real newlines, so existing stored content and unescaped-HTML template rendering
   * (`{{ ...|raw }}`) stay compatible. The true inverse of `textToHtml`: `<br>`
   * tags become newlines first, then parsing the result and reading
   * `textContent` decodes every HTML entity `escapeHtml` produced back to its
   * literal character. Reading entities back via `el.innerHTML` (as
   * `readFieldValue` does for multiline fields) re-serializes them into
   * escaped form, same as `escapeHtml` would — without this decoding step,
   * reopening the editor would show raw entities, and re-saving would
   * escape them a second time.
   */
  private htmlToText(html: string): string {
    const withNewlines = html.replace(/<br\s*\/?>/gi, '\n');
    const scratch = document.createElement('div');
    scratch.innerHTML = withNewlines;
    return scratch.textContent ?? '';
  }

  private textToHtml(value: string): string {
    return this.escapeHtml(value).replace(/\n/g, '<br />');
  }

  /**
   * Like `textToHtml`, but for the live measurement write only (never for
   * the persisted value): a trailing or leading blank line, or one between
   * two `<br>` tags, doesn't reliably get its own line box in
   * `getBoundingClientRect()` across browsers until there's real content
   * after it. Padding empty lines with a non-breaking space guarantees each
   * one always contributes real height while editing.
   */
  private textToDisplayHtml(value: string): string {
    return value
      .split('\n')
      .map((line) => (line.length ? this.escapeHtml(line) : '\u00A0'))
      .join('<br />');
  }

  /**
   * Copies the field's computed font styling onto the overlay input so it
   * doesn't look like a generic browser input.
   */
  private readFontStyle(el: HTMLElement): Record<string, string> {
    const computed = el.ownerDocument.defaultView?.getComputedStyle(el);

    if (!computed) {
      return {};
    }

    return {
      'font-size': computed.fontSize,
      'font-family': computed.fontFamily,
      'font-weight': computed.fontWeight,
      'font-style': computed.fontStyle,
      'line-height': computed.lineHeight,
      'text-align': computed.textAlign,
      'letter-spacing': computed.letterSpacing,
      'text-transform': computed.textTransform,
    };
  }

  private createVirtualOrigin(el: HTMLElement, iframe: HTMLIFrameElement) {
    const iframeRect = iframe.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    return {
      x: iframeRect.left + elRect.left,
      y: iframeRect.top + elRect.top,
      width: elRect.width,
      height: elRect.height,
    };
  }

  /**
   * Re-anchors the currently open overlay (if any) to the edited element's
   * current position/size. Called after every keystroke, and on window/page
   * scroll and resize, since the overlay's position strategy uses a static
   * snapshot origin that CDK has no way to re-measure on its own.
   */
  private refreshOpenEditGeometry() {
    if (!this.openEdit) {
      return;
    }

    const { el, iframe, overlayRef, positionStrategy, syncSizeOnRefresh } =
      this.openEdit;
    const rect = this.createVirtualOrigin(el, iframe);

    positionStrategy.setOrigin(rect);
    overlayRef.updatePosition();

    if (syncSizeOnRefresh) {
      overlayRef.updateSize({ width: rect.width, height: rect.height });
    }
  }

  /**
   * Disposes the currently open overlay, if any. By default also restores
   * the edited element's original content, since it's mutated live on every
   * keystroke while editing (see `openEditor`'s `input` subscription) — pass
   * `restore: false` only right after a successful save, where the element
   * has already been set to its correct final value.
   */
  private closeOpenOverlay(restore = true) {
    if (!this.openEdit) {
      return;
    }

    if (restore) {
      this.openEdit.el.innerHTML = this.openEdit.originalHtml;
    }

    this.openEdit.el.style.whiteSpace = '';
    this.openEdit.el.style.width = '';
    this.openEdit.el.style.visibility = '';

    if (this.openEdit.legacyHideContainer) {
      this.openEdit.legacyHideContainer.removeEventListener(
        'mouseleave',
        this.openEdit.suppressLegacyHideClose,
        true,
      );
    }

    this.openEdit.overlayRef.dispose();
    this.openEdit = null;
  }
}
