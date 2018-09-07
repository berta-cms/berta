import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { SettingModel, SettingConfigModel } from '../shared/interfaces';

@Component({
  selector: 'berta-select-input',
  template: `
    <div class="form-group">
      <label>
        {{ label }}

        <div class="select-wrapper" >
          <button #toggleDropDown
                  type="button"
                  [title]="getCurrentTitleByValue(value)"
                  (click)="openDropDown(toggleDropDown)"
                  (blur)="closeDropDown(toggleDropDown)">{{ getCurrentTitleByValue(value) }}</button>
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

  private lastValue: SettingModel['value'];

  ngOnInit() {
    // Cache the value, so we don't update if nothing changes
    this.lastValue = this.value;
  }

  openDropDown(toggleDropDown) {
    toggleDropDown.classList.add('open');
  }

  closeDropDown(toggleDropDown) {
    // Wait for `li` click event
    setTimeout(() => {
      toggleDropDown.classList.remove('open');
    }, 200);
  }

  getCurrentTitleByValue(value) {
    const currentValue = this.values.find(val => {
      return val.value === value;
    });
    return currentValue.title;
  }

  updateField(value) {
    if (value === this.lastValue) {
      return;
    }
    this.lastValue = value;
    this.update.emit(value);
  }
}
