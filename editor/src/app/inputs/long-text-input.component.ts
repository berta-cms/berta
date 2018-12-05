import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TextInputService } from './text-input.service';

@Component({
  selector: 'berta-long-text-input',
  template: `
    <div class="form-group" [class.bt-focus]="textInputService.focus | async" [class.bt-disabled]="disabled">
      <label>
        {{ label }}
        <textarea (focus)="onFocus()"
                  (keydown)="updateField($event)"
                  (blur)="onBlur($event)"
                  rows="3">{{ value }}</textarea>
      </label>
    </div>`,
  styles: [`
    :host label {
      display: block;
    }
  `],
    /* Provide text input service here, so each component has it's own service */
    providers: [TextInputService]
})
export class LongTextInputComponent implements OnInit {
  @Input() label?: string;
  @Input() name?: string;
  @Input() title?: string;
  @Input() type?: string;
  @Input() placeholder?: string;
  @Input() disabled?: boolean;
  @Input() enabledOnUpdate?: boolean;
  @Input() value: string;
  @Output() update = new EventEmitter<string>();
  @Output() inputFocus = new EventEmitter<boolean>();


  constructor (
    public textInputService: TextInputService) {
  }

  ngOnInit() {
    this.textInputService.initValue(this.value, {isLongInput: true});
  }

  onFocus() {
    this.textInputService.onComponentFocused();
    this.inputFocus.emit(true);
  }

  onBlur(event) {
    this.textInputService.onComponentBlurred(event);
    this.updateField(event);
    this.inputFocus.emit(false);
  }

  updateField(event) {
    const value = this.textInputService.updateField(event);
    if (value === null) {
      return;
    }

    if (!this.enabledOnUpdate) {
      this.disabled = true;
    }

    /* Blur the input, so it wont get blurred in the update process and cause errors */
    event.target.blur();
    this.update.emit(value);
  }
}
