import { Routes } from '@angular/router';
import { ClientEditPage } from './feature-edit/client-edit-page';
import { ClientsPage } from './feature-list/clients-page';
import { ClientNewPage } from './feature-new/client-new-page';

export const CLIENTS_ROUTES: Routes = [
  {
    path: 'new',
    component: ClientNewPage,
  },
  {
    path: ':id/edit',
    component: ClientEditPage,
  },
  {
    path: '',
    component: ClientsPage,
  },
];
