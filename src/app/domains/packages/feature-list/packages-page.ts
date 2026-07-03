import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { ErrorState } from '../../../shared/ui/error-state/error-state';
import { LoadingState } from '../../../shared/ui/loading-state/loading-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { PackageStore } from '../data-access/package.store';

@Component({
  selector: 'app-packages-page',
  imports: [
    CurrencyPipe,
    EmptyState,
    ErrorState,
    LoadingState,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    PageHeader,
    RouterLink,
  ],
  templateUrl: './packages-page.html',
  styleUrl: './packages-page.scss',
})
export class PackagesPage {
  protected readonly packageStore = inject(PackageStore);
  protected readonly displayedColumns = ['name', 'price', 'durationMinutes', 'actions'];
}
