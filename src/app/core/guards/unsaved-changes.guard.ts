import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { ConfirmationService } from '../services/confirmation.service';

export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) => {
  if (!component.hasUnsavedChanges()) {
    return true;
  }

  return inject(ConfirmationService).confirm({
    title: 'Leave this page?',
    message: 'You have unsaved changes. If you leave now, your edits will be lost.',
    confirmLabel: 'Leave',
    cancelLabel: 'Stay',
  });
};
