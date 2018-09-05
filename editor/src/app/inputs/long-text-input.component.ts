import { Component } from '@angular/core';
import { TextInputComponent } from './text-input.component';

@Component({
  selector: 'berta-long-text-input',
  template: `
    <div class="form-group">
      <label>
        {{ label }}
        <textarea (blur)="updateField($event)">{{ value }}</textarea>
      </label>
    </div>`,
  styles: [`
    :host label {
      display: block;
    }

    textarea {
      display: block;
      width: 100%;
      margin: .75em 0 0;
    }
  `]
})
export class LongTextInputComponent extends TextInputComponent {
}
