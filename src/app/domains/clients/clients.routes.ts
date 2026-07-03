import { Routes } from '@angular/router';
import { unsavedChangesGuard } from '../../core/guards/unsaved-changes.guard';
import { ClientEditPage } from './feature-edit/client-edit-page';
import { ClientsPage } from './feature-list/clients-page';
import { ClientNewPage } from './feature-new/client-new-page';

export const CLIENTS_ROUTES: Routes = [
  {
    path: 'new',
    component: ClientNewPage,
    canDeactivate: [unsavedChangesGuard],
  },
  {
    path: ':id/edit',
    component: ClientEditPage,
    canDeactivate: [unsavedChangesGuard],
  },
  {
    path: '',
    component: ClientsPage,
  },
];
