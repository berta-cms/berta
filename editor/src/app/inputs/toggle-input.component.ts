import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SettingModel, SettingConfigModel } from '../shared/interfaces';

@Component({
  selector: 'berta-toggle-input',
  template: ` <div class="form-group" [class.bt-disabled]="disabled">
    <label>
      {{ label }}

      <div class="toggle-wrapper">
        <input
          [checked]="isChecked(value)"
          (change)="onChange($event)"
          type="checkbox"
        />
        <span></span>
      </div>
    </label>
  </div>`,
})
export class ToggleInputComponent {
  @Input() label: string;
  @Input() value: SettingModel['value'];
  @Input() values: SettingConfigModel['values'];
  @Input() enabledOnUpdate?: boolean;
  @Output() update = new EventEmitter();
  disabled = false;

  private activeValues = ['yes', '1'];

  isChecked(value) {
    return this.activeValues.some((val) => val === value);
  }

  getCheckedValue() {
    return this.values.find((val) => this.isChecked(val.value)).value;
  }

  getUncheckedValue() {
    return this.values.find((val) => !this.isChecked(val.value)).value;
  }

  onChange($event) {
    let value;
    if ($event.target.checked) {
      value = this.getCheckedValue();
    } else {
      value = this.getUncheckedValue();
    }

    if (!this.enabledOnUpdate) {
      $event.target.disabled = true;
      this.disabled = true;
    }
    this.update.emit(value);
  }
}
