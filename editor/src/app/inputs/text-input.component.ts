import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'berta-text-input',
  template: `
    <label *ngIf="label">{{ label }}</label>
    <input [value]="value"
           (keydown)="updateField($event)"
           (blur)="updateField($event)">
           type="text">`
})
export class TextInputComponent {
  @Input() label: string;
  @Input() value: string;
  @Output() update = new EventEmitter();

  updateField($event) {
    // @todo: must fix - keydown ENTER event also fires blur event, this fires event twice
    if ($event instanceof KeyboardEvent && !($event.key === 'Enter' || $event.keyCode === 13)) {
      return;
    }
    this.update.emit($event.target);
  }
}
