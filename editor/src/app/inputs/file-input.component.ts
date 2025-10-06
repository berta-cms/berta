import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { SettingModel } from '../shared/interfaces';

@Component({
    selector: 'berta-file-input',
    template: ` <div
      class="form-group"
      [class.error]="error"
      [class.bt-disabled]="disabled"
      >
      <label>
        {{ label }}
    
        <div class="file-input-wrapper">
          <div class="file-input">{{ value || 'Add file...' }}</div>
          <input
            #fileInput
            [accept]="accept"
            [disabled]="disabled"
            type="file"
            (change)="onChange(fileInput)"
            />
          @if (!value) {
            <svg
              role="button"
              tabindex="0"
              aria-label="add"
              class="add"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              >
              <title>add</title>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12Z"
                fill="#9b9b9b"
                class="icon"
                />
              <path d="M6 3.33333V8.66667" stroke="white" stroke-linecap="square" />
              <path d="M8.66671 6H3.33337" stroke="white" stroke-linecap="square" />
            </svg>
          }
          @if (!disableRemove && value) {
            <svg
              (click)="removeFile($event, fileInput)"
              role="button"
              tabindex="0"
              aria-label="clear"
              class="icon clear"
              width="14"
              height="13"
              viewBox="0 0 14 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              >
              <title>clear</title>
              <path
                d="M9.8284 9.19243L4.17155 3.53557"
                stroke="#9B9B9B"
                stroke-linecap="square"
                class="icon-remove"
                />
              <path
                d="M9.82844 3.53552L4.17159 9.19237"
                stroke="#9B9B9B"
                stroke-linecap="square"
                class="icon-remove"
                />
            </svg>
          }
        </div>
      </label>
      <div class="error-message" [style.display]="error ? '' : 'none'">
        {{ error }}
      </div>
    </div>`,
    standalone: false
})
export class FileInputComponent implements OnInit {
  @Input() label: string;
  @Input() templateSlug: string;
  @Input() property: string;
  @Input() value: string | File;
  @Input() accept: string;
  @Input() disabled: string;
  @Input() disableRemove?: boolean;
  @Input() error: string;
  @Output() update = new EventEmitter();

  maxFileSize = 10485760; // 10 MB
  private lastValue: SettingModel['value'] | File;

  ngOnInit() {
    // Cache the value, so we don't update if nothing changes
    this.lastValue = this.value;
  }

  onChange(fileInput: HTMLInputElement) {
    if (!this.validate(fileInput) || this.disabled) {
      return;
    }
    this.updateField(fileInput.files[0]);
  }

  validate(fileInput: HTMLInputElement) {
    if (fileInput.files[0].size > this.maxFileSize) {
      this.error = `File exceeds the maximum file-size limit ${
        this.maxFileSize / 1024 / 1024
      } MB`;
      return false;
    }
    return true;
  }

  removeFile($event, fileInput: HTMLInputElement) {
    $event.stopPropagation();
    $event.preventDefault();

    if (this.disabled) {
      return;
    }

    this.value = '';
    this.updateField(this.value);
  }

  updateField(value) {
    if (value === this.lastValue) {
      return;
    }
    this.lastValue = value;
    this.update.emit(value);
  }
}
