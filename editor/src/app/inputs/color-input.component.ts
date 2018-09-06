import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { SettingModel } from '../shared/interfaces';

@Component({
  selector: 'berta-color-input',
  template: `
    <div class="form-group">
      <label>
        {{ label }}
        <div class="color-picker-wrapper">
          <input [(colorPicker)]="value"
                 [value]="value"
                 (colorPickerClose)="saveColor(value)"
                 (colorPickerCancel)="cancelColor()"
                 [cpOKButton]="true"
                 [cpCancelButton]="true"
                 [cpSaveClickOutside]="true"
                 type="text"
                 readonly>
          <div class="color-preview"
               [style.background-color]="value">
          </div>
        </div>
      </label>
    </div>`
})
export class ColorInputComponent implements OnInit {
  @Input() label: string;
  @Input() value: SettingModel['value'];
  @Output() update = new EventEmitter();

  private lastValue: SettingModel['value'];
  private colorIsCancelled = false;

  ngOnInit() {
    // Cache the value, so we don't update if nothing changes
    this.lastValue = this.value;
  }

  saveColor(value) {
    // We need a setTimeout here because `cancel` event is triggered after picker is closed
    setTimeout(() => {
      if (this.colorIsCancelled) {
        this.colorIsCancelled = false;
        return;
      }
      this.updateField(value);
    }, 200);
  }

  updateField(value) {
    if (value === this.lastValue) {
      return;
    }
    this.lastValue = value;
    this.update.emit(value);
  }

  cancelColor() {
    this.colorIsCancelled = true;
    this.value = this.lastValue;
  }
}
