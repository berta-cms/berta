import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'berta-action-button',
  template: `<button type="button" class="button" (click)="runAction()">
    {{ label }}
  </button>`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ActionButton {
  @Input() label: string;
  @Input() action: string;
  @Output() emitAction = new EventEmitter<{ action: string }>();

  constructor() {}

  runAction() {
    this.emitAction.emit({ action: this.action });
  }
}
