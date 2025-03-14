import { Injectable } from '@angular/core';

/**
 * This service is meant to manage input in text elements. And should be injected only in component directly so that
 * each component has it's own instance.
 */
@Injectable()
export class ValidationService {
  public value: string;
  public allowBlank: boolean;
  public cssUnitsRequired: boolean;
  public validation: string;

  private ok: boolean;
  private message: string;

  validate(
    value: string,
    allowBlank: boolean,
    cssUnitsRequired: boolean,
    validation: string
  ) {
    this.value = value.trim();
    this.allowBlank = allowBlank;
    this.validation = validation;
    this.cssUnitsRequired = cssUnitsRequired;

    return this.validateValue();
  }

  validateValue() {
    if (!this.allowBlank && !this.value) {
      this.ok = false;
      this.message = 'This field is required';
    } else if (
      this.cssUnitsRequired &&
      !this.value.match(/^-?\d*\.?\d+(px|em|rem|vw|vh|pt|%)$/)
    ) {
      this.ok = false;
      this.message =
        'Invalid CSS unit, append value with px, em, rem, vw, vh, pt or %';
    } else if (
      this.validation === 'positive_integer' &&
      !this.value.match(/^[1-9]\d*$/)
    ) {
      this.ok = false;
      this.message = 'This field must be a positive integer';
    } else if (
      this.validation === 'zero_or_positive_integer' &&
      !this.value.match(/^\d+$/)
    ) {
      this.ok = false;
      this.message = 'This field must be a zero or positive integer';
    } else if (
      this.validation === 'positive_number' &&
      !this.value.match(/^(?!0$)(?!0\d+$)\d*\.?\d+$/)
    ) {
      this.ok = false;
      this.message = 'This field must be a positive number';
    } else if (
      this.validation === 'email' &&
      !this.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ) {
      this.ok = false;
      this.message = 'This field must be a valid email address';
    } else {
      this.ok = true;
      this.message = '';
    }

    return { ok: this.ok, message: this.message };
  }
}
