import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'berta-rich-text-input',
  template: ` <div class="form-group">
    <label>{{ label }}</label>
    <angular-editor
      [(ngModel)]="value"
      (ngModelChange)="this.valueUpdate.next($event)"
      [config]="editorConfig"
    >
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
export class RichTextInputComponent implements OnInit {
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
  @Output() inputFocus = new EventEmitter<boolean>();

  valueUpdate = new Subject<string>();

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

  constructor() {
    this.valueUpdate
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        this.update.emit(value);
      });
  }

  ngOnInit() {
    this.editorConfig.placeholder = this.placeholder;
  }
}
