import { Routes } from '@angular/router';

import { PackageDetailPage } from './feature-detail/package-detail-page';
import { PackageNewPage } from './feature-new/package-new-page';
import { PackagesPage } from './feature-list/packages-page';

export const PACKAGES_ROUTES: Routes = [
  {
    path: 'new',
    component: PackageNewPage,
  },
  {
    path: ':id',
    component: PackageDetailPage,
  },
  {
    path: '',
    component: PackagesPage,
  },
];
