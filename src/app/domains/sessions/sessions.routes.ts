import { Routes } from '@angular/router';
import { SessionDetailPage } from './feature-detail/session-detail-page';
import { SessionsPage } from './feature-list/sessions-page';

export const SESSIONS_ROUTES: Routes = [
  {
    path: '',
    component: SessionsPage,
  },
  {
    path: ':id',
    component: SessionDetailPage,
  },
];
