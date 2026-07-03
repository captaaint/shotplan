import { Routes } from '@angular/router';
import { ClientsPage } from './feature-list/clients-page';
import { ClientNewPage } from './feature-new/client-new-page';

export const CLIENTS_ROUTES: Routes = [
  {
    path: 'new',
    component: ClientNewPage,
  },
  {
    path: '',
    component: ClientsPage,
  },
];
