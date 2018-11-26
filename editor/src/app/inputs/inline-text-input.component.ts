import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'berta-inline-text-input',
  template: `
    <span *ngIf="!focus"
          class="input-placeholder"
          (click)="onTextClick()">{{ value || '...' }}</span>
    <input *ngIf="focus"
           bertaAutofocus
           [value]="value"
           (focus)="onFocus()"
           (keydown)="updateField($event)"
           (blur)="onBlur($event)"
           type="text">
    <svg *ngIf="!focus"
         (click)="onFocus()"
         class="edit-icon"
         title="Edit"
         type="button"
         xmlns="http://www.w3.org/2000/svg" width="16" height="16" version="1.1" viewBox="0 0 16 16">
      <path class="icon" d="m3.8 14.6 1-1-2.5-2.5-1 1v1.1h1.4v1.4zm5.5-9.8q0-0.2-0.2-0.2-0.1 0-0.2 0.1l-5.7 5.7q-0.1 0.1-0.1 0.2 0 0.2 0.2 0.2 0.1 0 0.2-0.1l5.7-5.7q0.1-0.1 0.1-0.2zm-0.6-2 4.4 4.4-8.8 8.8h-4.4v-4.4zm7.2 1q0 0.6-0.4 1l-1.8 1.8-4.4-4.4 1.8-1.7q0.4-0.4 1-0.4 0.6 0 1 0.4l2.5 2.5q0.4 0.4 0.4 1z" stroke-width="0"/>
    </svg>
    `,
    styles: [`
      :host {
        display: flex;
        align-items: center;
      }

      :host.clickable-text .input-placeholder {
        cursor: pointer;
      }
    `]
})
export class InlineTextInputComponent implements OnInit {
  @Input() value: string;
  @Output() update = new EventEmitter();
  @Output() inputFocus = new EventEmitter();
  @Output() textClick = new EventEmitter();
  focus = false;

  private lastValue: string;

  ngOnInit() {
    // Cache the value, so we don't update if nothing changes
    this.lastValue = this.value;
  }

  onTextClick() {
    this.textClick.emit(true);
  }

  onFocus() {
    this.focus = true;
    setTimeout(() => {
      this.inputFocus.emit(true);
    });
  }

  onBlur($event) {
    this.focus = false;

    // Waiting for possible click on app overlay
    setTimeout(() => {
      this.inputFocus.emit(false);
    });

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

    if ($event instanceof KeyboardEvent && !($event.key === 'Enter' || $event.keyCode === 13)) {
      return;
    }

    this.lastValue = $event.target.value;
    $event.target.disabled = true;

    this.update.emit($event.target.value);
  }
}
