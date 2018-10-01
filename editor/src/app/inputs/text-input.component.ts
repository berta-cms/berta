import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'berta-text-input',
  template: `
    <div class="form-group"
         [class.bt-focus]="focus"
         [class.bt-disabled]="disabled"
         [class.no-label]="!label">
      <label>
        <span class="label-text">{{ label }}</span>
        <div class="text-input-wrapper">
          <svg *ngIf="!hideIcon && showIcon" class="icon-empty" width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path class="icon" d="M6 34.5v7.5h7.5l22.13-22.13-7.5-7.5-22.13 22.13zm35.41-20.41c.78-.78.78-2.05 0-2.83l-4.67-4.67c-.78-.78-2.05-.78-2.83 0l-3.66 3.66 7.5 7.5 3.66-3.66z"/>
            <path d="M0 0h48v48h-48z" fill="none"/>
          </svg>
          <input [value]="value"
                 [attr.disabled]="(disabled ? '' : null)"
                 [attr.placeholder]="placeholder"
                 [attr.type]="(type || 'text')"
                 (focus)="onFocus()"
                 (keydown)="updateField($event)"
                 (blur)="onBlur($event)">
        </div>
      </label>
    </div>`
})
export class TextInputComponent implements OnInit {
  @Input() label?: string;
  @Input() type?: string;
  @Input() placeholder?: string;
  @Input() disabled?: boolean;
  @Input() enabledOnUpdate?: boolean;
  @Input() hideIcon?: boolean;
  @Input() value: string;
  @Output() update = new EventEmitter<string>();
  @Output() inputFocus = new EventEmitter<boolean>();
  focus = false;
  showIcon = false;

  private lastValue: string;

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
    this.inputFocus.emit(true);
  }

  onBlur($event) {
    this.focus = false;
    if (!$event.target.value) {
      this.showIcon = true;
    }

    // Waiting for possible click on app overlay
    setTimeout(() => {
      this.inputFocus.emit(false);
    }, 200);

    this.updateField($event);
  }

  updateField($event) {
    if ($event instanceof KeyboardEvent && ($event.key === 'Escape' || $event.keyCode === 27)) {
      ($event.target as HTMLInputElement).value = this.lastValue;
      ($event.target as HTMLInputElement).blur();
      return;
    }

    if ($event.target.value === this.lastValue) {
      return;
    }

    if ($event instanceof KeyboardEvent &&
        (this.constructor.name === 'LongTextInputComponent' || !($event.key === 'Enter' || $event.keyCode === 13))) {
      return;
    }

    this.lastValue = $event.target.value;

    if (!this.enabledOnUpdate) {
      this.disabled = true;
    }

    this.update.emit($event.target.value);
  }
}
