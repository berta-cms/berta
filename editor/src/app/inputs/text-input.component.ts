import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { SettingModel } from '../shared/interfaces';

@Component({
  selector: 'berta-text-input',
  template: `
    <div class="form-group" [class.bt-focus]="focus" [class.bt-disabled]="disabled">
      <label>
        {{ label }}
        <div class="text-input-wrapper">
          <svg *ngIf="showIcon" width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path class="icon" d="M6 34.5v7.5h7.5l22.13-22.13-7.5-7.5-22.13 22.13zm35.41-20.41c.78-.78.78-2.05 0-2.83l-4.67-4.67c-.78-.78-2.05-.78-2.83 0l-3.66 3.66 7.5 7.5 3.66-3.66z"/>
            <path d="M0 0h48v48h-48z" fill="none"/>
          </svg>
          <input [value]="value"
                 (focus)="onFocus()"
                 (keydown)="updateField($event)"
                 (blur)="onBlur($event)"
                 type="text">
        </div>
      </label>
    </div>`
})
export class TextInputComponent implements OnInit {
  @Input() label: string;
  @Input() value: string;
  @Output() update = new EventEmitter();
  focus = false;
  showIcon = false;
  disabled = false;

  private lastValue: SettingModel['value'];

  ngOnInit() {
    // Cache the value, so we don't update if nothing changes
    this.lastValue = this.value;

    if (!this.value) {
      this.showIcon = true;
    }
  }

  onFocus() {
    this.focus = true;
    this.showIcon = false;
  }

  onBlur($event) {
    this.focus = false;
    if (!$event.target.value) {
      this.showIcon = true;
    }
    this.updateField($event);
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
    this.disabled = true;

    this.update.emit($event.target.value);
  }
}
