import { Routes } from '@angular/router';
import { SessionDetailPage } from './feature-detail/session-detail-page';
import { SessionEditPage } from './feature-edit/session-edit-page';
import { SessionsPage } from './feature-list/sessions-page';
import { SessionNewPage } from './feature-new/session-new-page';

export const SESSIONS_ROUTES: Routes = [
  {
    path: 'new',
    component: SessionNewPage,
  },
  {
    path: ':id/edit',
    component: SessionEditPage,
  },
  {
    path: '',
    component: SessionsPage,
  },
  {
    path: ':id',
    component: SessionDetailPage,
  },
];
