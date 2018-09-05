import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { SettingModel } from '../shared/interfaces';

@Component({
  selector: 'berta-text-input',
  template: `
    <div class="form-group">
      <label>
        {{ label }}
        <input [value]="value"
               (keydown)="updateField($event)"
               (blur)="updateField($event)"
               type="text">
      </label>
    </div>`
})
export class TextInputComponent implements OnInit {
  @Input() label: string;
  @Input() value: string;
  @Output() update = new EventEmitter();

  private lastValue: SettingModel['value'];

  ngOnInit() {
    // Cache the value, so we don't update if nothing changes
    this.lastValue = this.value;
  }

  updateField($event) {
    if ($event.target.value === this.lastValue) {
      return;
    }

    if ($event instanceof KeyboardEvent && !($event.key === 'Enter' || $event.keyCode === 13)) {
      return;
    }
    this.lastValue = $event.target.value;
    $event.target.disabled = true;

    this.update.emit($event.target.value);
  }
}
