import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

/**
 * This service is meant to manage input in text elements. And should be injected only in component directly so that
 * each component has it's own instance.
 */
@Injectable()
export class TextInputService {
  private lastValue: string|null = null;
  private hideIcon = false;
  private isLongInput = false;

  public value = new Subject<string>();
  public focus = new BehaviorSubject<boolean>(false);
  public showIcon = new BehaviorSubject<boolean>(true);


  initValue(value, {hideIcon, isLongInput}: {hideIcon?: boolean, isLongInput?: boolean}) {
    this.lastValue = value;
    this.hideIcon = !!hideIcon;
    this.isLongInput = !!isLongInput;

    if (!value && !this.hideIcon) {
      this.showIcon.next(true);
    } else {
      this.showIcon.next(false);
    }
  }

  getLastValue() {
    return this.lastValue;
  }

  onComponentFocused() {
    this.focus.next(true);
    if (!this.hideIcon) {
      this.showIcon.next(false);
    }
  }

  onComponentBlurred(event) {
    this.focus.next(false);
    if (!event.target.value && !this.hideIcon) {
      this.showIcon.next(true);
    }
    this.updateField(event);
  }

    const bigUnits = ['px', '%', 'pt'];
    const litleUnits = ['em', 'rem', 'vw', 'vh'];

    if (event instanceof KeyboardEvent && (event.key === 'Escape' || event.keyCode === 27)) {
      (event.target as HTMLInputElement).value = this.lastValue;
      (event.target as HTMLInputElement).blur();
      return null;
    }
      const regex  = /[a-z]+/g;
      const regex1 = /-?[0-9]\d*(\.\d+)?/g;
      const found = event.target.value.match(regex);
      const digit = event.target.value.match(regex1);
      let value = Number(digit === null ? null : digit.shift());
      const unit = found === null ? null : found.shift();
      let i = 0;

      if (value != null) {

        if (value === null || found === null || bigUnits.includes(unit)) {
          i = 1;
        } else if (litleUnits.includes(unit)) {
          i = 0.1;
        }

        if (event.ctrlKey === true) {
          i = i * 10;
        }

    if (event.key === 'ArrowDown' || event.keyCode === 40) {
          value = Math.round((value - i) * 10) / 10;
    }

    if (event.key === 'ArrowUp' || event.keyCode === 38) {
          value = Math.round((value + i) * 10) / 10;
        }
          (event.target as HTMLInputElement).value = value + unit; // fonction pour changer la value
          return null;
        }
      }
    }

    if (event.target.value === this.lastValue) {
      return null;
    }

    if (event instanceof KeyboardEvent &&
        ((this.isLongInput && !event.ctrlKey) || !(event.key === 'Enter' || event.keyCode === 13))) {
      return null;
    }

    this.lastValue = event.target.value;
    if (event instanceof KeyboardEvent) {
      (event.target as HTMLInputElement).blur();
    }
    this.value.next(event.target.value);
  }
}
