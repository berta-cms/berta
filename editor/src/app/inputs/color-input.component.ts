import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'berta-color-input',
  template: `
    <div class="form-group" [class.bt-focus]="focus" [class.bt-disabled]="disabled">
      <label>
        {{ label }}
        <div class="color-picker-wrapper">
          <input [(colorPicker)]="value"
                 [value]="value"
                 (colorPickerOpen)="onColorPickerOpen()"
                 (colorPickerClose)="saveColor(value)"
                 (colorPickerCancel)="cancelColor()"
                 [cpOKButton]="true"
                 [cpOKButtonClass]="'button'"
                 [cpCancelButton]="true"
                 [cpCancelButtonClass]="'button secondary'"
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
  @Input() value: string;
  @Output() update = new EventEmitter();
  @Output() inputFocus = new EventEmitter();

  focus = false;
  disabled = false;
  private lastValue: string;
  private colorIsCancelled = false;

  ngOnInit() {
    // Cache the value, so we don't update if nothing changes
    this.lastValue = this.value;
  }

  onColorPickerOpen() {
    this.focus = true;
    this.inputFocus.emit(true);
  }

  saveColor(value) {
    this.focus = false;
    this.inputFocus.emit(false);

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
    this.disabled = true;
    this.update.emit(value);
  }

  cancelColor() {
    this.colorIsCancelled = true;
    this.value = this.lastValue;
  }
}
