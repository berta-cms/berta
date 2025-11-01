import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import {
  AngularEditorComponent,
  AngularEditorConfig,
} from '@kolkov/angular-editor';

@Component({
  selector: 'berta-rich-text-input',
  template: ` <div class="form-group">
    <label>{{ label }}</label>
    <angular-editor #editor [(ngModel)]="value" [config]="editorConfig">
    </angular-editor>
  </div>`,
  styles: [
    `
      :host label {
        display: block;
        margin-bottom: 0.5em;
      }
    `,
  ],
  standalone: false,
})
export class RichTextInputComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  constructor() {}
  @Input() label?: string;
  @Input() name?: string;
  @Input() title?: string;
  @Input() type?: string;
  @Input() placeholder?: string;
  @Input() disabled?: boolean;
  @Input() disabledReason?: string;
  @Input() enabledOnUpdate?: boolean;
  @Input() value: string;
  @Output() update = new EventEmitter<string>();

  editorConfig: AngularEditorConfig = {
    editable: true,
    height: 'auto',
    minHeight: '3em',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    toolbarHiddenButtons: [
      [
        'undo',
        'redo',
        'underline',
        'strikeThrough',
        'subscript',
        'superscript',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'indent',
        'outdent',
        'insertUnorderedList',
        'insertOrderedList',
        'heading',
        'fontName',
      ],
      [
        'fontSize',
        'textColor',
        'backgroundColor',
        'customClasses',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
      ],
    ],
  };

  @ViewChild('editor') private editor: AngularEditorComponent;
  private isClickingToolbar = false;
  private timeoutRef: number | null = null;
  private mouseUpListener: (() => void) | null = null;
  private toolbarListener: (() => void) | null = null;
  private blurListener: (() => void) | null = null;
  private lastSavedValue: string = '';

  private saveContent(editorElement: HTMLElement) {
    const newValue = editorElement.innerHTML;
    if (newValue !== this.lastSavedValue) {
      this.lastSavedValue = newValue;
      this.update.emit(newValue);
    }
  }

  ngOnInit() {
    this.editorConfig.placeholder = this.placeholder;
  }

  ngAfterViewInit() {
    // Get the contenteditable div element
    const editorElement = this.editor.textArea.nativeElement;
    this.lastSavedValue = editorElement.innerHTML; // Store initial value

    const editorWrapper = editorElement.closest('.angular-editor');
    const toolbar = editorWrapper?.querySelector('.angular-editor-toolbar');

    // Track toolbar interactions
    this.toolbarListener = () => {
      this.isClickingToolbar = true;
    };
    toolbar?.addEventListener('mousedown', this.toolbarListener);

    this.mouseUpListener = () => {
      if (this.timeoutRef) {
        window.clearTimeout(this.timeoutRef);
      }
      this.timeoutRef = window.setTimeout(() => {
        if (!this.isClickingToolbar) return; // Don't reset if already reset
        this.isClickingToolbar = false;
        this.timeoutRef = null;
      }, 100);
    };
    document.addEventListener('mouseup', this.mouseUpListener);

    // Save only when actually leaving the editor
    this.blurListener = () => {
      if (!this.isClickingToolbar) {
        this.saveContent(editorElement);
      }
    };
    editorElement.addEventListener('blur', this.blurListener);
  }

  ngOnDestroy() {
    // Clear ALL timeouts to prevent any delayed actions
    if (this.timeoutRef) {
      window.clearTimeout(this.timeoutRef);
      this.timeoutRef = null;
    }

    // Reset toolbar state immediately
    this.isClickingToolbar = false;

    // Remove all event listeners before saving to prevent any new events
    if (this.mouseUpListener) {
      document.removeEventListener('mouseup', this.mouseUpListener);
      this.mouseUpListener = null;
    }

    const editorElement = this.editor?.textArea?.nativeElement;
    if (editorElement) {
      if (this.blurListener) {
        editorElement.removeEventListener('blur', this.blurListener);
        this.blurListener = null;
      }

      const toolbar = editorElement
        .closest('.angular-editor')
        ?.querySelector('.angular-editor-toolbar');
      if (toolbar && this.toolbarListener) {
        toolbar.removeEventListener('mousedown', this.toolbarListener);
        this.toolbarListener = null;
      }

      // Save any unsaved changes as the very last step
      // Only if we still have access to the editor element
      this.saveContent(editorElement);
    }
  }
}
