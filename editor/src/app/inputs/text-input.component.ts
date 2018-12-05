import { tap } from 'rxjs/operators';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TextInputService } from './text-input.service';

@Component({
  selector: 'berta-text-input',
  template: `
    <div class="form-group"
         [class.bt-focus]="textInputService.focus | async"
         [class.bt-disabled]="disabled"
         [class.no-label]="!label"
         [attr.title]="title">
      <label>
        <span class="label-text">{{ label }}</span>
        <div class="text-input-wrapper">
          <svg *ngIf="textInputService.showIcon | async" class="icon-empty" xmlns="http://www.w3.org/2000/svg" width="16" height="16" version="1.1" viewBox="0 0 16 16">
            <path class="icon" d="m3.8 14.6 1-1-2.5-2.5-1 1v1.1h1.4v1.4zm5.5-9.8q0-0.2-0.2-0.2-0.1 0-0.2 0.1l-5.7 5.7q-0.1 0.1-0.1 0.2 0 0.2 0.2 0.2 0.1 0 0.2-0.1l5.7-5.7q0.1-0.1 0.1-0.2zm-0.6-2 4.4 4.4-8.8 8.8h-4.4v-4.4zm7.2 1q0 0.6-0.4 1l-1.8 1.8-4.4-4.4 1.8-1.7q0.4-0.4 1-0.4 0.6 0 1 0.4l2.5 2.5q0.4 0.4 0.4 1z" stroke-width="0"/>
          </svg>
          <input [value]="value"
                 [attr.name]="(name || null)"
                 [attr.disabled]="(disabled ? '' : null)"
                 [attr.placeholder]="placeholder"
                 [attr.type]="(type || 'text')"
                 (focus)="onFocus()"
                 (keydown)="updateField($event)"
                 (blur)="onBlur($event)">
        </div>
      </label>
    </div>`,
  styles: [`
    :host {
      display: block;
    }
  `],
  /* Provide text input service here, so each component has it's own service */
  providers: [TextInputService]
})
export class TextInputComponent implements OnInit {
  @Input() label?: string;
  @Input() name?: string;
  @Input() title?: string;
  @Input() type?: string;
  @Input() placeholder?: string;
  @Input() disabled?: boolean;
  @Input() enabledOnUpdate?: boolean;
  @Input() hideIcon?: boolean;
  @Input() value: string;
  @Output() update = new EventEmitter<string>();
  @Output() inputFocus = new EventEmitter<boolean>();


  constructor (
    public textInputService: TextInputService) {
  }

  ngOnInit() {
    this.textInputService.initValue(this.value, {hideIcon: !!this.hideIcon});
    this.textInputService.value.pipe(
      tap(() => {
        if (!this.enabledOnUpdate) {
          this.disabled = true;
        }
      })
    ).subscribe((value) => this.update.emit(value));
  }

  onFocus() {
    this.textInputService.onComponentFocused();
    this.inputFocus.emit(true);
  }

  onBlur(event) {
    this.textInputService.onComponentBlurred(event);

    // Waiting for possible click on app overlay
    this.inputFocus.emit(false);
  }

  updateField(event) {
    const value = this.textInputService.updateField(event);
    if (value === null) {
      return;
    }
  }
}
