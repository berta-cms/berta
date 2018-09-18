import { Component } from '@angular/core';
import { TextInputComponent } from './text-input.component';

@Component({
  selector: 'berta-long-text-input',
  template: `
    <div class="form-group" [class.bt-focus]="focus" [class.bt-disabled]="disabled">
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
  `]
})
export class LongTextInputComponent extends TextInputComponent {
}
