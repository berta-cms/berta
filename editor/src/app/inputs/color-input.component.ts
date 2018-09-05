import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { SettingModel } from '../shared/interfaces';

@Component({
  selector: 'berta-color-input',
  template: `
    <div class="form-group">
      <label>
        {{ label }}
        <input [(colorPicker)]="value"
               [value]="value"
               (colorPickerSelect)="updateField($event)"
               [cpOKButton]="true"
               [cpCancelButton]="true"
               type="text">
      </label>
    </div>`,
  styles: [`
    color-picker {
      position: absolute !important;
    }
  `]
})
export class ColorInputComponent implements OnInit {
  @Input() label: string;
  @Input() value: string;
  @Output() update = new EventEmitter();

  private lastValue: SettingModel['value'];

  ngOnInit() {
    // Cache the value, so we don't update if nothing changes
    this.lastValue = this.value;
  }

  updateField(value) {
    if (value === this.lastValue) {
      return;
    }
    this.lastValue = value;

    this.update.emit(value);
  }
}
