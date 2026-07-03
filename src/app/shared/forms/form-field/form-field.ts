import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { getControlErrorMessage } from '../form-error-messages';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
})
export class FormField {
  readonly label = input.required<string>();
  readonly control = input<AbstractControl | null>(null);
  readonly wide = input(false);
  readonly errorOnly = input(false);

  protected errorMessage(): string | null {
    return getControlErrorMessage(this.control(), this.label());
  }
}
