import { Routes } from '@angular/router';

import { LocationDetailPage } from './feature-detail/location-detail-page';
import { LocationsPage } from './feature-list/locations-page';
import { LocationNewPage } from './feature-new/location-new-page';

export const LOCATIONS_ROUTES: Routes = [
  {
    path: 'new',
    component: LocationNewPage,
  },
  {
    path: ':id',
    component: LocationDetailPage,
  },
  {
    path: '',
    component: LocationsPage,
  },
];
