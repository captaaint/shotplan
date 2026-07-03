import { AbstractControl, ValidationErrors } from '@angular/forms';

type ErrorMessageFactory = (error: unknown, label: string) => string;

const ERROR_MESSAGES: Record<string, ErrorMessageFactory> = {
  required: (_error, label) => `${label} is required.`,
  email: () => 'Enter a valid email address.',
  min: (error, label) => {
    const minError = error as { min: number };

    return `${label} must be at least ${minError.min}.`;
  },
  timeRange: () => 'End time must be after start time.',
};

export function getControlErrorMessage(
  control: AbstractControl | null,
  label: string,
): string | null {
  if (!control || !shouldShowErrors(control) || !control.errors) {
    return null;
  }

  return getFirstErrorMessage(control.errors, label);
}

function shouldShowErrors(control: AbstractControl): boolean {
  return control.invalid && (control.touched || control.dirty);
}

function getFirstErrorMessage(errors: ValidationErrors, label: string): string | null {
  const [errorName, errorValue] = Object.entries(errors)[0] ?? [];

  if (!errorName) {
    return null;
  }

  const messageFactory = ERROR_MESSAGES[errorName];

  return messageFactory ? messageFactory(errorValue, label) : `${label} is invalid.`;
}
