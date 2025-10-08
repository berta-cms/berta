import { tap } from 'rxjs/operators';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TextInputService } from './text-input.service';

@Component({
    selector: 'berta-url-input',
    template: ` <div
      class="form-group"
      [class.bt-focus]="textInputService.focus | async"
      [class.bt-disabled]="disabled"
      [class.no-label]="!label"
      [attr.title]="title"
      >
      <label>
        <span class="label-text">{{ label }}</span>
        <div class="text-input-wrapper">
          @if (textInputService.showIcon | async) {
            <svg
              class="icon-empty"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              version="1.1"
              viewBox="0 0 16 16"
              >
              <path
                class="icon"
                d="m3.8 14.6 1-1-2.5-2.5-1 1v1.1h1.4v1.4zm5.5-9.8q0-0.2-0.2-0.2-0.1 0-0.2 0.1l-5.7 5.7q-0.1 0.1-0.1 0.2 0 0.2 0.2 0.2 0.1 0 0.2-0.1l5.7-5.7q0.1-0.1 0.1-0.2zm-0.6-2 4.4 4.4-8.8 8.8h-4.4v-4.4zm7.2 1q0 0.6-0.4 1l-1.8 1.8-4.4-4.4 1.8-1.7q0.4-0.4 1-0.4 0.6 0 1 0.4l2.5 2.5q0.4 0.4 0.4 1z"
                stroke-width="0"
                />
            </svg>
          }
          <input
            [value]="value"
            [attr.name]="name || null"
            [attr.disabled]="disabled ? '' : null"
            [attr.placeholder]="placeholder"
            [attr.type]="type || 'text'"
            (focus)="onFocus()"
            (keydown)="onKeyDown($event)"
            (blur)="onBlur($event)"
            />
          @if (allowBlank && value) {
            <svg
              (click)="clearValue($event)"
              role="button"
              tabindex="0"
              aria-label="clear"
              class="icon clear"
              width="14"
              height="13"
              viewBox="0 0 14 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              >
              <title>clear</title>
              <path
                d="M9.8284 9.19243L4.17155 3.53557"
                stroke="#9B9B9B"
                stroke-linecap="square"
                class="icon-remove"
                />
              <path
                d="M9.82844 3.53552L4.17159 9.19237"
                stroke="#9B9B9B"
                stroke-linecap="square"
                class="icon-remove"
                />
            </svg>
          }
        </div>
      </label>
    </div>`,
    styles: [
        `
      :host {
        display: block;
      }
    `,
    ],
    /* Provide text input service here, so each component has it's own service */
    providers: [TextInputService],
    standalone: false
})
export class UrlInputComponent implements OnInit {
  @Input() label?: string;
  @Input() name?: string;
  @Input() title?: string;
  @Input() type?: string;
  @Input() placeholder?: string;
  @Input() disabled?: boolean;
  @Input() enabledOnUpdate?: boolean;
  @Input() hideIcon?: boolean;
  @Input() value: string;
  @Input() allowBlank?: boolean;
  @Output() update = new EventEmitter<string>();
  @Output() inputFocus = new EventEmitter<boolean>();

  constructor(public textInputService: TextInputService) {}

  ngOnInit() {
    this.textInputService.initValue(this.value, { hideIcon: !!this.hideIcon });
    this.textInputService.value
      .pipe(
        tap(() => {
          if (!this.enabledOnUpdate) {
            this.disabled = true;
          }
        })
      )
      .subscribe((value) => {
        value = value.trim();
        if (value && !/^http(s)?:\/\//i.test(value)) {
          value = `https://${value}`;
        }

        return this.update.emit(value);
      });
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

  onKeyDown(event) {
    this.textInputService.updateField(event);
  }

  clearValue(event) {
    event.preventDefault();
    this.value = '';
    this.update.emit(this.value);
  }
}
