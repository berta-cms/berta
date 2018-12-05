import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * This service is meant to manage input in text elements. And should be injected only in component directly so that
 * each component has it's own instance.
 */
@Injectable()
export class TextInputService {
  private lastValue: string|null = null;
  private hideIcon = false;
  private isLongInput = false;

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
  }

  updateField(event) {
    if (event instanceof KeyboardEvent && (event.key === 'Escape' || event.keyCode === 27)) {
      (event.target as HTMLInputElement).value = this.lastValue;
      (event.target as HTMLInputElement).blur();
      return null;
    }

    if (event.target.value === this.lastValue) {
      return null;
    }

    if (event instanceof KeyboardEvent &&
        ((this.isLongInput && !event.ctrlKey) || !(event.key === 'Enter' || event.keyCode === 13))) {
      return null;
    }

    this.lastValue = event.target.value;

    return event.target.value;
  }
}
