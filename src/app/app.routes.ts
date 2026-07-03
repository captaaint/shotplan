import { Routes } from '@angular/router';
import { Shell } from './core/layout/shell';
import { Dashboard } from './domains/dashboard/dashboard';
import { SessionDetailPage } from './domains/sessions/feature-detail/session-detail-page';
import { SessionsPage } from './domains/sessions/feature-list/sessions-page';

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
        component: SessionsPage,
      },
      {
        path: 'sessions/:id',
        component: SessionDetailPage,
      },
    ],
  },
];
