import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { SettingModel, SettingConfigModel } from '../shared/interfaces';

@Component({
    selector: 'berta-select-input',
    template: ` <div
    class="form-group"
    [class.bt-focus]="focus"
    [class.bt-disabled]="disabled"
  >
    <label>
      <span class="label-text">
        {{ label
        }}<berta-help-tooltip *ngIf="tip" [content]="tip"></berta-help-tooltip>
      </span>

      <div class="select-wrapper">
        <div class="button-wrapper">
          <button
            #dropDownAnchor
            type="button"
            [title]="getCurrentTitleByValue(value)"
            (click)="toggleDropDown()"
            (keydown)="onKeyDown($event)"
            (blur)="onBlur()"
          >
            {{ getCurrentTitleByValue(value) }}
          </button>
          <svg
            class="drop-icon"
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 1L4.75736 5.24264L0.514719 1"
              stroke="#9b9b9b"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <ul>
          <li
            *ngFor="let val of values"
            [title]="val.title"
            (click)="updateField(val.value)"
          >
            {{ val.title }}
          </li>
        </ul>
      </div>
    </label>
  </div>`,
    standalone: false
})
export class SelectInputComponent implements OnInit {
  @Input() label: string;
  @Input() tip?: string;
  @Input() value: SettingModel['value'];
  @Input() values: SettingConfigModel['values'];
  @Output() update = new EventEmitter();
  @Output() inputFocus = new EventEmitter();
  @Input() enabledOnUpdate?: boolean;

  @ViewChild('dropDownAnchor') dropDownAnchor: ElementRef<HTMLButtonElement>;
  focus = false;
  disabled = false;
  blurTimeoutId: any;

  private lastValue: SettingModel['value'];

  ngOnInit() {
    // Cache the value, so we don't update if nothing changes
    this.lastValue = this.value;
  }

  toggleDropDown() {
    if (this.disabled) {
      return;
    }

    this.focus = !this.focus;
    this.inputFocus.emit(this.focus);
  }

  onKeyDown($event: KeyboardEvent) {
    if ($event.key === 'Escape' || $event.key === 'Esc') {
      this.closeDropDown();
      this.dropDownAnchor.nativeElement.blur();
    }
  }

  onBlur() {
    this.clearBlurTimeout();

    if (!this.focus) {
      return;
    }

    this.blurTimeoutId = setTimeout(() => {
      this.closeDropDown();
    }, 200);
  }

  closeDropDown() {
    this.focus = false;
    this.inputFocus.emit(false);
  }

  getCurrentTitleByValue(value) {
    const currentValue = this.values.find((val) => {
      return val.value === value;
    });

    if (!currentValue) {
      return '-';
    }

    return currentValue.title;
  }

  updateField(value) {
    this.clearBlurTimeout();

    if (value !== this.lastValue) {
      this.lastValue = value;
      if (!this.enabledOnUpdate) {
        this.disabled = true;
      }
      this.update.emit(value);
    }

    if (!this.enabledOnUpdate) {
      this.closeDropDown();
    }

    this.dropDownAnchor.nativeElement.blur();
  }

  private clearBlurTimeout() {
    if (this.blurTimeoutId) {
      clearTimeout(this.blurTimeoutId);
      this.blurTimeoutId = null;
    }
  }
}
