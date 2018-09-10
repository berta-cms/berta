import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { SettingModel } from '../shared/interfaces';

@Component({
  selector: 'berta-file-input',
  template: `
    <div class="form-group">
      <label>
        {{ label }}

        <div class="file-input-wrapper">
          <div class="file-input" [class.has-file]="value">
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
  @Input() value: string;
  @Output() update = new EventEmitter();

  private lastValue: SettingModel['value'];

  ngOnInit() {
    // Cache the value, so we don't update if nothing changes
    this.lastValue = this.value;
  }

  onChange($event) {
    console.log('file changed', $event);
  }

  removeFile($event) {
    $event.stopPropagation();
    $event.preventDefault();

    this.value = '';
    // updateField
  }

  updateField($event) {
    if ($event.target.value === this.lastValue) {
      return;
    }

    this.lastValue = $event.target.value;
    $event.target.disabled = true;

    this.update.emit($event.target.value);
  }
}
