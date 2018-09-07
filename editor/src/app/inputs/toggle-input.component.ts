import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SettingModel, SettingConfigModel } from '../shared/interfaces';

@Component({
  selector: 'berta-toggle-input',
  template: `
    <div class="form-group">
      <label>
        {{ label }}

        <div class="toggle-wrapper">
          <input [checked]="isChecked(value)"
                 (change)="onChange($event)"
                 type="checkbox">
        </div>
      </label>
    </div>`
})
export class ToggleInputComponent {
  @Input() label: string;
  @Input() value: SettingModel['value'];
  @Input() values: SettingConfigModel['values'];
  @Output() update = new EventEmitter();

  private activeValues = ['yes'];

  isChecked(value) {
    return this.activeValues.some(val => val === value);
  }

  getCheckedValue() {
    return this.values.find(val => this.isChecked(val.value)).value;
  }

  getUncheckedValue() {
    return this.values.find(val => !this.isChecked(val.value)).value;
  }

  onChange($event) {
    let value;
    if ($event.target.checked) {
      value = this.getCheckedValue();
    } else {
      value = this.getUncheckedValue();
    }

    this.update.emit(value);
  }
}
