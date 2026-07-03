import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function endTimeAfterStartTimeValidator(
  startControlName = 'startTime',
  endControlName = 'endTime',
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const startTime = control.get(startControlName)?.value;
    const endTime = control.get(endControlName)?.value;

    if (!startTime || !endTime) {
      return null;
    }

    return endTime > startTime ? null : { timeRange: true };
  };
}
