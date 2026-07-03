import { Routes } from '@angular/router';

import { LeadDetailPage } from './feature-detail/lead-detail-page';
import { LeadsPage } from './feature-list/leads-page';
import { LeadNewPage } from './feature-new/lead-new-page';

export const LEADS_ROUTES: Routes = [
  {
    path: 'new',
    component: LeadNewPage,
  },
  {
    path: ':id',
    component: LeadDetailPage,
  },
  {
    path: '',
    component: LeadsPage,
  },
];
