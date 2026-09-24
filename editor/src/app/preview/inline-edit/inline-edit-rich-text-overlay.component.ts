import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';

// Berta's floppy-disk Save icon, registered as a custom icon pack. TinyMCE
// falls back to the "default" icon pack for any icon a named pack doesn't
// define, so only `save` needs overriding.
const BERTA_ICON_PACK = 'berta';
const BERTA_SAVE_ICON =
  '<svg width="24" height="24"><path d="m5 2c-1.645 0-3 1.355-3 3v14c0 1.645 1.355 3 3 3h14c1.645 0 3-1.355 3-3v-11a1.0001 1.0001 0 0 0-0.29297-0.70703l-5-5a1.0001 1.0001 0 0 0-0.70703-0.29297h-9zm0 2h1v4a1.0001 1.0001 0 0 0 1 1h8a1 1 0 0 0 1-1 1 1 0 0 0-1-1h-7v-3h7.5859l4.4141 4.4141v10.586c0 0.56413-0.43587 1-1 1h-1v-7a1.0001 1.0001 0 0 0-1-1h-10a1.0001 1.0001 0 0 0-1 1v7h-1c-0.56413 0-1-0.43587-1-1v-14c0-0.56413 0.43587-1 1-1zm3 10h8v6h-8z"/></svg>';

// Content-area floor/cap for the `autoresize` plugin: grows/shrinks to fit
// what's actually typed instead of always reserving a fixed block (which,
// combined with `applyContentStyle` painting the surrounding page's
// background onto the editor body, made short content leave an obvious
// empty colored block below it). `autoresize_bottom_margin` is TinyMCE's
// own default breathing room below the content (50px) — reduced here since
// a compact inline popup doesn't need as much as a full-page editor.
export const RICH_TEXT_MIN_HEIGHT = 100;
const RICH_TEXT_MAX_HEIGHT = 500;

const RICH_TEXT_BASE_CONFIG = {
  menubar: false,
  branding: false,
  promotion: false,
  license_key: 'gpl',
  min_height: RICH_TEXT_MIN_HEIGHT,
  max_height: RICH_TEXT_MAX_HEIGHT,
  autoresize_bottom_margin: 10,
  invalid_elements: 'script',
  block_formats: 'Paragraph=p; Heading 2=h2; Heading 3=h3',
  convert_urls: false,
  relative_urls: false,
  // Without this, TinyMCE 6+'s default sandboxing of its own editing iframe
  // changes how embedded content (e.g. a pasted video embed) behaves while
  // being re-edited.
  sandbox_iframes: false,
  icons: BERTA_ICON_PACK,
};

const RICH_TEXT_FULL_CONFIG = {
  ...RICH_TEXT_BASE_CONFIG,
  plugins: 'save code table lists link autoresize',
  toolbar:
    'save undo redo bold italic forecolor backcolor bullist numlist link unlink code | fontsize blocks alignleft aligncenter alignright alignjustify outdent indent table removeformat',
};

const RICH_TEXT_SIMPLE_CONFIG = {
  ...RICH_TEXT_BASE_CONFIG,
  plugins: 'save link code autoresize',
  toolbar: 'save bold italic link unlink removeformat code',
};

/**
 * Hosts a TinyMCE instance for `.xNgEditableRTE`/`.xNgEditableRTESimple`
 * fields. Unlike `InlineEditOverlayComponent`'s plain `<textarea>`, saving
 * happens only via TinyMCE's own toolbar Save button
 * (`save_onsavecallback`); there is no blur-to-save. `InlineEditService`
 * supplies the click-away-to-discard behavior instead, via a CDK backdrop.
 */
@Component({
  selector: 'berta-inline-edit-rich-text-overlay',
  // Not an `[innerHTML]` binding: Angular's built-in HTML sanitizer strips
  // `style` attributes unconditionally (its attribute allowlist has no
  // `style` entry at all), which silently drops any forecolor/backcolor
  // formatting already saved in `value` before TinyMCE ever sees it. Set
  // via a plain DOM write in `ngAfterViewInit` instead, matching how
  // `InlineEditService` already writes this same kind of content elsewhere
  // (`writeRichTextValue`/`writeFieldValue`) without going through Angular's
  // template bindings.
  template: `<div #targetEl></div>`,
  styles: [
    `
      /*
       * The pane (.cdk-overlay-pane) is a flex container with no
       * flex-direction/align-items override, so browser defaults apply:
       * align-items: stretch already fills our height to match the pane's
       * fixed height, but the main axis (width, since direction is row)
       * does not auto-stretch — without an explicit width here, the host
       * only takes its content's width (~0 until TinyMCE renders in),
       * causing the same visible size-jump width had before this rule.
       */
      :host {
        display: block;
        width: 100%;
        background: #fff;
      }
    `,
  ],
  standalone: false,
})
export class InlineEditRichTextOverlayComponent
  implements AfterViewInit, OnDestroy
{
  @Input() value = '';
  @Input() simple = false;
  @Input() contentStyle: Record<string, string> = {};
  @Output() save = new EventEmitter<string>();
  /**
   * Fires with the editor's current rendered height (toolbar chrome +
   * autoresized content area) once on TinyMCE's `init` — since the overlay
   * was first sized against an empty div, before TinyMCE rendered in — and
   * again on every `autoresize` plugin `ResizeEditor` event as the user
   * types. The caller resizes/repositions the CDK overlay to match each
   * time, since CDK has no built-in awareness of its content growing.
   */
  @Output() resize = new EventEmitter<number>();

  @ViewChild('targetEl') private targetEl!: ElementRef<HTMLElement>;

  private editor: any = null;
  private destroyed = false;

  async ngAfterViewInit() {
    this.targetEl.nativeElement.innerHTML = this.value;

    const tinymce = (await import('tinymce/tinymce')).default;

    await Promise.all([
      import('tinymce/icons/default'),
      import('tinymce/themes/silver'),
      import('tinymce/models/dom/model'),
      import('tinymce/plugins/save'),
      import('tinymce/plugins/code'),
      import('tinymce/plugins/table'),
      import('tinymce/plugins/lists'),
      import('tinymce/plugins/link'),
      import('tinymce/plugins/autoresize'),
      import('tinymce/skins/ui/oxide/skin.js'),
      import('tinymce/skins/ui/oxide/content.js'),
      import('tinymce/skins/content/default/content.js'),
    ]);

    // The overlay can be closed (backdrop click) while TinyMCE is still
    // loading — initializing it then would leave an orphaned editor bound
    // to a detached element.
    if (this.destroyed) {
      return;
    }

    tinymce.IconManager.add(BERTA_ICON_PACK, {
      icons: { save: BERTA_SAVE_ICON },
    });

    const config = this.simple
      ? RICH_TEXT_SIMPLE_CONFIG
      : RICH_TEXT_FULL_CONFIG;

    tinymce.init({
      target: this.targetEl.nativeElement,
      ...config,
      save_onsavecallback: () => this.save.emit(this.editor.getContent()),
      setup: (editor: any) => {
        this.editor = editor;
        const emitHeight = () =>
          this.resize.emit(editor.getContainer().offsetHeight);

        editor.on('init', () => {
          this.applyContentStyle(editor);
          emitHeight();
        });
        editor.on('ResizeEditor', emitHeight);
      },
    });
  }

  ngOnDestroy() {
    this.destroyed = true;
    this.editor?.remove();
  }

  /**
   * `contentStyle` is fully assembled by `InlineEditService` (which has
   * access to the edited element and its page context) — this just applies
   * whatever it computed onto the TinyMCE iframe's body.
   */
  private applyContentStyle(editor: any) {
    const body = editor.getBody();

    Object.entries(this.contentStyle).forEach(([prop, value]) => {
      if (value) {
        editor.dom.setStyle(body, prop, value);
      }
    });
  }
}
