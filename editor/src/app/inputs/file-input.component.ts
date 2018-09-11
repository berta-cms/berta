import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { SettingModel } from '../shared/interfaces';
import { FileUploadService } from '../sites/shared/file-upload.service';
import { AppShowLoading, AppHideLoading } from '../app-state/app.actions';

@Component({
  selector: 'berta-file-input',
  template: `
    <div class="form-group">
      <label>
        {{ label }}

        <div class="file-input-wrapper">
          <div class="file-input" [class.has-file]="value" [class.error]="hasError">
            {{ value || 'Add file...'  }}

            <input #fileInput
                   type="file"
                   (change)="onChange($event)">
            <div *ngIf="value"
                 class="remove-file"
                 (click)="removeFile($event)"></div>
          </div>
        </div>
      </label>
    </div>`
})
export class FileInputComponent implements OnInit {
  @Input() label: string;
  @Input() groupSlug: string;
  @Input() property: string;
  @Input() value: string;
  @Output() update = new EventEmitter();

  private lastValue: SettingModel['value'];
  private hasError = false;

  constructor(
    private store: Store,
    private fileUploadService: FileUploadService) {
  }

  ngOnInit() {
    // Cache the value, so we don't update if nothing changes
    this.lastValue = this.value;
  }

  onChange($event) {
    $event.target.disabled = true;
    this.store.dispatch(new AppShowLoading());

    this.fileUploadService.upload(this.groupSlug + '/' + this.property, $event.target.files[0]).subscribe({
      next: (response: any) => {
        this.hasError = false;
        this.value = response.filename;
        $event.target.disabled = false;
        this.store.dispatch(new AppHideLoading());
        this.updateField(this.value);
      },
      error: (error) => {
        this.hasError = true;
        $event.target.disabled = false;
        this.store.dispatch(new AppHideLoading());
        console.error(error);
      }
    });
  }

  removeFile($event) {
    $event.stopPropagation();
    $event.preventDefault();
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
