import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'berta-inline-text-input',
  template: `
    <span *ngIf="!focus" class="input-placeholder">{{ value || '...' }}</span>
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
         width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path class="icon" d="M6 34.5v7.5h7.5l22.13-22.13-7.5-7.5-22.13 22.13zm35.41-20.41c.78-.78.78-2.05 0-2.83l-4.67-4.67c-.78-.78-2.05-.78-2.83 0l-3.66 3.66 7.5 7.5 3.66-3.66z"/>
      <path d="M0 0h48v48h-48z" fill="none"/>
    </svg>
    `,
    styles: [`
      :host {
        display: inline-block;
      }
    `]
})
export class InlineTextInputComponent implements OnInit {
  @Input() value: string;
  @Output() update = new EventEmitter();
  @Output() inputFocus = new EventEmitter();
  focus = false;

  private lastValue: string;

  ngOnInit() {
    // Cache the value, so we don't update if nothing changes
    this.lastValue = this.value;
  }

  onFocus() {
    this.focus = true;
    this.inputFocus.emit(true);
  }

  onBlur($event) {
    this.focus = false;

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

    if ($event instanceof KeyboardEvent && !($event.key === 'Enter' || $event.keyCode === 13)) {
      return;
    }

    this.lastValue = $event.target.value;
    $event.target.disabled = true;

    this.update.emit($event.target.value);
  }
}
