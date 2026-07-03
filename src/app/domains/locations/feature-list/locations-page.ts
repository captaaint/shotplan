import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { ErrorState } from '../../../shared/ui/error-state/error-state';
import { LoadingState } from '../../../shared/ui/loading-state/loading-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { LocationStore } from '../data-access/location.store';

@Component({
  selector: 'app-locations-page',
  imports: [
    EmptyState,
    ErrorState,
    LoadingState,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    PageHeader,
    RouterLink,
  ],
  templateUrl: './locations-page.html',
  styleUrl: './locations-page.scss',
})
export class LocationsPage {
  protected readonly locationStore = inject(LocationStore);
  protected readonly displayedColumns = ['name', 'address', 'indoor', 'actions'];
}
