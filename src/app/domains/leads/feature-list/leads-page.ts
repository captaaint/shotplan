import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { ErrorState } from '../../../shared/ui/error-state/error-state';
import { LoadingState } from '../../../shared/ui/loading-state/loading-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { LeadStore } from '../data-access/lead.store';

@Component({
  selector: 'app-leads-page',
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
  templateUrl: './leads-page.html',
  styleUrl: './leads-page.scss',
})
export class LeadsPage {
  protected readonly leadStore = inject(LeadStore);
  protected readonly displayedColumns = ['fullName', 'sessionType', 'source', 'status', 'actions'];
}
