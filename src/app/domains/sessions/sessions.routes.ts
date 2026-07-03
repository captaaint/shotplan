import { Routes } from '@angular/router';
import { unsavedChangesGuard } from '../../core/guards/unsaved-changes.guard';
import { SessionDetailPage } from './feature-detail/session-detail-page';
import { SessionEditPage } from './feature-edit/session-edit-page';
import { SessionsPage } from './feature-list/sessions-page';
import { SessionNewPage } from './feature-new/session-new-page';

export const SESSIONS_ROUTES: Routes = [
  {
    path: 'new',
    component: SessionNewPage,
    canDeactivate: [unsavedChangesGuard],
  },
  {
    path: ':id/edit',
    component: SessionEditPage,
    canDeactivate: [unsavedChangesGuard],
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
