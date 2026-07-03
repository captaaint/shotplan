import { Routes } from '@angular/router';
import { Shell } from './core/layout/shell';
import { Dashboard } from './domains/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'sessions',
        loadChildren: () =>
          import('./domains/sessions/sessions.routes').then((m) => m.SESSIONS_ROUTES),
      },
      {
        path: 'clients',
        loadChildren: () =>
          import('./domains/clients/clients.routes').then((m) => m.CLIENTS_ROUTES),
      },
    ],
  },
];
