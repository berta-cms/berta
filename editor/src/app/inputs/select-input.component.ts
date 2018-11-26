import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { SettingModel, SettingConfigModel } from '../shared/interfaces';

@Component({
  selector: 'berta-select-input',
  template: `
    <div class="form-group" [class.bt-focus]="focus" [class.bt-disabled]="disabled">
      <label>
        {{ label }}

        <div class="select-wrapper">
          <div class="button-wrapper">
            <button type="button"
                    [title]="getCurrentTitleByValue(value)"
                    (click)="toggleDropDown()"
                    (keydown)="onKeyDown($event)"
                    (blur)="closeDropDown()">{{ getCurrentTitleByValue(value) }}</button>
            <svg class="drop-icon" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 1L4.75736 5.24264L0.514719 1" stroke="#9b9b9b" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <ul>
            <li *ngFor="let val of values" [title]="val.title" (click)="updateField(val.value)">{{ val.title }}</li>
          </ul>
        </div>
      </label>
    </div>`
})
export class SelectInputComponent implements OnInit {
  @Input() label: string;
  @Input() value: SettingModel['value'];
  @Input() values: SettingConfigModel['values'];
  @Output() update = new EventEmitter();
  @Output() inputFocus = new EventEmitter();
  focus = false;
  disabled = false;

  private lastValue: SettingModel['value'];

  ngOnInit() {
    // Cache the value, so we don't update if nothing changes
    this.lastValue = this.value;
  }

  toggleDropDown() {
    if (this.disabled) {
      return;
    }
    this.focus = !this.focus;

    setTimeout(() => {
      this.inputFocus.emit(this.focus);
    }, 200);
  }

  onKeyDown($event) {
    if ($event.key === 'Escape' || $event.keyCode === 27) {
      this.closeDropDown();
    }
  }

  closeDropDown() {
    if (!this.focus) {
      return;
    }

    // Wait for `li` click event
    setTimeout(() => {
      this.focus = false;
      this.inputFocus.emit(false);
    }, 200);
  }

  getCurrentTitleByValue(value) {
    const currentValue = this.values.find(val => {
      return val.value === value;
    });

    if (!currentValue) {
      return '-';
    }

    return currentValue.title;
  }

  updateField(value) {
    if (value === this.lastValue) {
      return;
    }
    this.lastValue = value;
    this.disabled = true;
    this.update.emit(value);
  }
}
