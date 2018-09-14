import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { SettingModel } from '../shared/interfaces';
import { FileUploadService } from '../sites/shared/file-upload.service';
import { AppShowLoading, AppHideLoading } from '../app-state/app.actions';

@Component({
  selector: 'berta-file-input',
  template: `
    <div class="form-group" [class.error]="hasError" [class.bt-disabled]="disabled">
      <label>
        {{ label }}

        <div class="file-input-wrapper">
          <div class="file-input">{{ value || 'Add file...'  }}</div>
          <input #fileInput
                 [accept]="accept"
                 type="file"
                 (change)="onChange($event)">
          <svg *ngIf="!value" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12Z" fill="#9b9b9b" class="icon"/>
            <path d="M6 3.33333V8.66667" stroke="white" stroke-linecap="square"/><path d="M8.66671 6H3.33337" stroke="white" stroke-linecap="square"/>
          </svg>
          <svg *ngIf="value"
               (click)="removeFile($event, fileInput)"
               width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.8284 9.19243L4.17155 3.53557" stroke="#9B9B9B" stroke-linecap="square" class="icon-remove"/>
            <path d="M9.82844 3.53552L4.17159 9.19237" stroke="#9B9B9B" stroke-linecap="square" class="icon-remove"/>
          </svg>
        </div>
      </label>
    </div>`
})
export class FileInputComponent implements OnInit {
  @Input() label: string;
  @Input() templateSlug: string;
  @Input() groupSlug: string;
  @Input() property: string;
  @Input() value: string;
  @Input() accept: string;
  @Output() update = new EventEmitter();

  hasError = false;
  disabled = false;
  private lastValue: SettingModel['value'];

  constructor(
    private store: Store,
    private fileUploadService: FileUploadService) {
  }

  ngOnInit() {
    // Cache the value, so we don't update if nothing changes
    this.lastValue = this.value;
  }

  onChange($event) {
    this.disabled = true;
    $event.target.disabled = true;
    this.store.dispatch(new AppShowLoading());
    let url = this.groupSlug + '/' + this.property;

    if (this.templateSlug) {
      url = this.templateSlug + '/' + url;
    }

    this.fileUploadService.upload(url, $event.target.files[0]).subscribe({
      next: (response: any) => {
        this.hasError = false;
        this.value = response.filename;
        this.disabled = false;
        $event.target.disabled = false;
        this.store.dispatch(new AppHideLoading());
        this.updateField(this.value);
      },
      error: (error) => {
        this.hasError = true;
        this.disabled = false;
        $event.target.disabled = false;
        this.store.dispatch(new AppHideLoading());
        console.error(error);
      }
    });
  }

  removeFile($event, fileInput) {
    $event.stopPropagation();
    $event.preventDefault();
    this.value = '';
    this.disabled = true;
    fileInput.disabled = true;
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
