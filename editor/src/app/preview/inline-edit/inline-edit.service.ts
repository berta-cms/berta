import { Injectable } from '@angular/core';
import {
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Store } from '@ngxs/store';

import { InlineEditOverlayComponent } from './inline-edit-overlay.component';
import { resolveInlineEditAction } from './inline-edit-path.resolver';

const EDITABLE_SELECTOR = '.xNgEditable, .xNgEditableTA';
const MULTILINE_CLASS = 'xNgEditableTA';
const DROPDOWN_BOX_SELECTOR = '.xEntryDropdownBox';

interface OpenEdit {
  el: HTMLElement;
  iframe: HTMLIFrameElement;
  originalHtml: string;
  overlayRef: OverlayRef;
  positionStrategy: FlexibleConnectedPositionStrategy;
  dropdownBox: HTMLElement | null;
  suppressDropdownClose: (event: Event) => void;
}

/**
 * Click-to-edit for `.xNgEditable` (single-line) and `.xNgEditableTA`
 * (multi-line) elements rendered inside the (same-origin) preview iframe.
 * This is the Angular-native replacement for the legacy MooTools
 * `elementEdit_init`/`inlineEdit` mechanism in `engine/js/BertaEditorBase.js`
 * / `engine/js/inline_edit.js` — adopted one field at a time by swapping a
 * field's server-rendered class from `xEditable`/`xEditableTA` to the
 * `xNgEditable`/`xNgEditableTA` markers this service listens for, so
 * migrated and not-yet-migrated fields can coexist on the same page.
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

    // The previewed site's own page can scroll independently of the app
    // shell around it.
    iframe.contentWindow?.addEventListener('scroll', () =>
      this.refreshOpenEditGeometry(),
    );
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
    // perspective, the mouse just left whatever was underneath. A field
    // nested inside `.xEntryDropdownBox` (e.g. cartAttributes/weight) sits
    // inside a menu that legacy (`BertaEditor.js`) closes on exactly that
    // `mouseleave`, which never happened before since legacy's own inline
    // editor replaces content in place, inside the same iframe document —
    // the mouse never actually left. The overlay's computed bounds can be
    // fractional/subpixel and don't always cover `el` with pixel-perfect
    // precision, so moving the cursor within the field can fire more than
    // one of these spurious events, not just one at open time — classify
    // each one instead of only eating the first: if the cursor is still
    // geometrically over the overlay when this fires, it's spurious
    // (suppress); if the cursor has genuinely moved elsewhere, it's a real
    // departure — let it through so the menu still closes exactly as before
    // migration, and also close our own overlay in sync (via a real blur,
    // running the normal save/cancel logic) since legacy's in-place editor
    // would have been auto-blurred by its container hiding, which an
    // overlay in a different document never gets for free.
    const dropdownBox = el.closest(DROPDOWN_BOX_SELECTOR) as HTMLElement | null;
    const suppressDropdownClose = (event: MouseEvent) => {
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

    if (dropdownBox) {
      dropdownBox.addEventListener('mouseleave', suppressDropdownClose, true);
    }

    this.openEdit = {
      el,
      iframe,
      originalHtml,
      overlayRef,
      positionStrategy,
      dropdownBox,
      suppressDropdownClose,
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
          this.writeFieldValue(el, finalValue, multiline);
          this.closeOpenOverlay(false);
        },
        error: () => this.closeOpenOverlay(),
      });
    });
  }

  /**
   * When empty, the server renders a visible `.xEmpty` placeholder span
   * inside the element (mirroring the legacy `makePlaceholderIfEmpty`
   * mechanism in `BertaEditorBase.js`) so the field stays visible/clickable.
   * The placeholder text is not the field's actual value, so it must be
   * excluded when reading the current value back out.
   *
   * Trimmed the same way legacy does (`inline_edit.js`'s
   * `this.oldContent.trim()`), since server templates are free to format
   * markup across multiple indented lines — harmless in normal CSS flow
   * (leading/trailing whitespace collapses), but it would otherwise leak
   * into the value verbatim once read via `innerHTML`/`textContent`.
   */
  private readFieldValue(el: HTMLElement, multiline: boolean): string {
    const isPlaceholder = !!el.querySelector(':scope > .xEmpty');

    if (isPlaceholder) {
      return '';
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

    const caption = el.dataset['emptyCaption'];
    el.innerHTML = caption
      ? `<span class="xEmpty">&nbsp;${this.escapeHtml(caption)}&nbsp;</span>`
      : '';
  }

  /**
   * Matches legacy's generic `xUnits-*` handling in `elementEdit_save`
   * (`BertaEditorBase.js`): a field carrying this class (e.g. `weight` via
   * `xUnits-{{ weightUnits }}`) stores an integer with the unit suffix
   * appended (e.g. "5" with units "kg" saves as "5kg"), regardless of what
   * property it is — detected generically from the class, not hardcoded to
   * one field, so it covers any other `xUnits-*` field migrated later.
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
   * Fields rendered with Twig's `|raw` filter (opted in via `data-ng-raw`,
   * e.g. site heading) bypass Twig's auto-escaping, so the stored value must
   * already be safe HTML — matching legacy's universal `addHTMLEntities`
   * encoding. Fields rendered without `|raw` (the majority) must NOT be
   * pre-encoded here: Twig already escapes them at render time, so encoding
   * on top would double-escape (e.g. a saved "&amp;" would render literally
   * as "&amp;amp;" instead of "&").
   */
  private applyRawEncoding(el: HTMLElement, value: string): string {
    return el.dataset['ngRaw'] ? this.encodeEntities(value) : value;
  }

  /**
   * Matches the net effect of legacy's `addHTMLEntities` + `escapeForJSON`
   * round-trip: `&`/`<`/`>` are encoded, `"` is deliberately left literal.
   */
  private encodeEntities(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /**
   * General-purpose HTML escaping (quotes included) used for building markup
   * this service constructs itself — the `.xEmpty` placeholder span and
   * `.xNgEditableTA` content via `textToHtml`/`textToDisplayHtml`. Distinct
   * from `encodeEntities`, which intentionally leaves `"` literal to match
   * legacy's specific saved-value convention.
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
   * breaks rather than real newlines, matching the legacy `.xEditableTA`
   * convention (`engine/js/inline_edit.js`'s `onSave`/`initialize`) so
   * existing stored content and unescaped-HTML template rendering
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

    const { el, iframe, overlayRef, positionStrategy } = this.openEdit;
    const rect = this.createVirtualOrigin(el, iframe);

    positionStrategy.setOrigin(rect);
    overlayRef.updatePosition();
    overlayRef.updateSize({ width: rect.width, height: rect.height });
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

    if (this.openEdit.dropdownBox) {
      this.openEdit.dropdownBox.removeEventListener(
        'mouseleave',
        this.openEdit.suppressDropdownClose,
        true,
      );
    }

    this.openEdit.overlayRef.dispose();
    this.openEdit = null;
  }
}
