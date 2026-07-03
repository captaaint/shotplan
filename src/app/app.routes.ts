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
      {
        path: 'leads',
        loadChildren: () => import('./domains/leads/leads.routes').then((m) => m.LEADS_ROUTES),
      },
      {
        path: 'locations',
        loadChildren: () =>
          import('./domains/locations/locations.routes').then((m) => m.LOCATIONS_ROUTES),
      },
      {
        path: 'packages',
        loadChildren: () =>
          import('./domains/packages/packages.routes').then((m) => m.PACKAGES_ROUTES),
      },
    ],
  },
];
