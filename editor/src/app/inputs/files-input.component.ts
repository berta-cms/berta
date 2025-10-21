import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'berta-files-input',
  template: `<div
    class="form-group"
    [class.error]="errors.length > 0"
    [class.bt-disabled]="disabled"
  >
    <label>
      <div class="file-input-wrapper">
        <div class="file-input">{{ label || 'Add files...' }}</div>
        <input
          #fileInput
          [accept]="accept"
          [disabled]="disabled"
          type="file"
          multiple
          (change)="onChange(fileInput)"
        />
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
      </div>
    </label>
    @for (error of errors; track error) {
      <div class="error-message">
        {{ error }}
      </div>
    }
  </div>`,
  standalone: false,
})
export class FilesInputComponent implements OnInit {
  @Input() label: string;
  @Input() accept: string;
  @Input() disabled: string;
  @Input() errors: string[];
  @Output() update = new EventEmitter();

  maxFileSize = 10485760; // 10 MB

  ngOnInit() {
    this.errors = this.errors || [];
  }

  onChange(fileInput: HTMLInputElement) {
    this.errors = [];
    if (this.disabled || !fileInput.files.length) {
      return;
    }

    this.updateField(fileInput.files);
  }

  validate(file: File) {
    if (file.type !== 'video/mp4' && file.size > this.maxFileSize) {
      this.errors.push(
        `File ${file.name} exceeds the maximum file-size limit ${
          this.maxFileSize / 1024 / 1024
        } MB`,
      );
      return false;
    }
    return true;
  }

  updateField(fileList: FileList) {
    const files = Array.from(fileList).filter((f) => this.validate(f));

    if (files.length) {
      this.update.emit(files);
    }
  }
}
