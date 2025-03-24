import { tap } from 'rxjs/operators';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TextInputService } from './text-input.service';

@Component({
  selector: 'berta-long-text-input',
  template: ` <div
    class="form-group"
    [class.bt-focus]="textInputService.focus | async"
    [class.bt-disabled]="disabled"
  >
    <label>
      {{ label }} <span [innerHTML]="disabledReason"></span>
      <textarea
        (focus)="onFocus()"
        (keydown)="onKeyDown($event)"
        (blur)="onBlur($event)"
        rows="3"
        >{{ value }}</textarea
      >
    </label>
  </div>`,
  styles: [
    `
      :host label {
        display: block;
      }
    `,
  ],
  /* Provide text input service here, so each component has it's own service */
  providers: [TextInputService],
})
export class LongTextInputComponent implements OnInit {
  @Input() label?: string;
  @Input() name?: string;
  @Input() title?: string;
  @Input() type?: string;
  @Input() placeholder?: string;
  @Input() disabled?: boolean;
  @Input() disabledReason?: string;
  @Input() enabledOnUpdate?: boolean;
  @Input() value: string;
  @Output() update = new EventEmitter<string>();
  @Output() inputFocus = new EventEmitter<boolean>();

  constructor(public textInputService: TextInputService) {}

  ngOnInit() {
    this.textInputService.initValue(this.value, { isLongInput: true });
    this.textInputService.value
      .pipe(
        tap(() => {
          if (!this.enabledOnUpdate) {
            this.disabled = true;
          }
        })
      )
      .subscribe((value) => this.update.emit(value));
  }

  onFocus() {
    this.textInputService.onComponentFocused();
    this.inputFocus.emit(true);
  }

  onBlur(event) {
    this.textInputService.onComponentBlurred(event);
    this.inputFocus.emit(false);
  }

  onKeyDown(event) {
    this.textInputService.updateField(event);
  }
}
