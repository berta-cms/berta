import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'berta-inline-edit-overlay',
  template: `
    <textarea
      #textareaEl
      bertaAutofocus
      [value]="value"
      [disabled]="saving"
      [ngStyle]="fontStyle"
      (input)="onInput($event)"
      (keydown)="onKeydown($event)"
      (blur)="onBlur($event)"
    ></textarea>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      textarea {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        border: none;
        background: #fff;
        color: inherit;
        resize: none;
        overflow: hidden;
        word-break: break-word;
        outline: 2px solid #0c4dff;
        outline-offset: 0;
        border-radius: 3px;
      }

      textarea:focus {
        outline: 2px solid #0c4dff;
      }
    `,
  ],
  standalone: false,
})
export class InlineEditOverlayComponent implements AfterViewInit {
  @Input() value = '';
  @Input() fontStyle: Record<string, string> = {};
  @Input() multiline = false;
  @Output() save = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();
  @Output() input = new EventEmitter<string>();

  @ViewChild('textareaEl') private textareaEl!: ElementRef<HTMLTextAreaElement>;

  saving = false;
  private closed = false;
  private viewReady = false;

  ngAfterViewInit() {
    this.viewReady = true;
  }

  /**
   * Lets the service trigger the exact same blur flow a user's own blur
   * would go through (save-if-changed/cancel-if-unchanged via `onBlur`),
   * for cases where something outside this component needs to end editing
   * — e.g. the field's container closing/hiding elsewhere in the page,
   * which wouldn't otherwise blur an overlay living in a different
   * document.
   *
   * Can be called before the view has finished initializing — the
   * mouseleave this serves can, in rare cases, misfire that early (the
   * geometric check that decides whether it's spurious runs before the
   * overlay's pane has been fully sized/positioned). Deliberately a no-op
   * in that case rather than deferring the blur until the view is ready:
   * deferring it means it fires moments later on a freshly-opened,
   * unchanged textarea, which immediately cancels and tears the overlay
   * back down — turning a rare misfire into the field never appearing to
   * open at all. Doing nothing risks only the narrower cosmetic case this
   * mechanism exists to fix (the overlay not closing in sync with the
   * dropdown) in that same rare window, which is the safer trade-off.
   */
  blurNow() {
    if (!this.viewReady) {
      return;
    }

    this.textareaEl.nativeElement.blur();
  }

  onInput(event: Event) {
    this.input.emit((event.target as HTMLTextAreaElement).value);
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closed = true;
      this.cancel.emit();
      return;
    }

    if (event.key === 'Enter' && !this.multiline) {
      event.preventDefault();
      (event.target as HTMLTextAreaElement).blur();
    }
  }

  onBlur(event: FocusEvent) {
    if (this.closed || this.saving) {
      return;
    }

    const newValue = this.normalize(
      (event.target as HTMLTextAreaElement).value,
    );

    if (newValue === this.value) {
      this.closed = true;
      this.cancel.emit();
      return;
    }

    this.saving = true;
    this.save.emit(newValue);
  }

  /**
   * Single-line fields are conceptually one line of text that only wraps
   * visually — pasted or otherwise inserted line breaks are collapsed to
   * spaces so the persisted value never contains a literal newline.
   * Multi-line fields keep internal newlines as-is; only outer whitespace
   * is trimmed.
   */
  private normalize(value: string): string {
    if (this.multiline) {
      return value.trim();
    }

    const collapsed = value.replace(/\s*\n+\s*/g, ' ').trim();

    // Matches legacy's `elementEdit_save` (BertaEditorBase.js): a value
    // ending in " px"/" pt"/" em" drops the space before the unit.
    return collapsed.replace(/\s(px|pt|em)$/i, '$1');
  }
}
