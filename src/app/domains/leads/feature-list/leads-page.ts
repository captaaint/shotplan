import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';

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
  private readonly router = inject(Router);
  protected readonly leadStore = inject(LeadStore);
  readonly status = input<string | undefined>();
  readonly type = input<string | undefined>();
  protected readonly displayedColumns = ['fullName', 'sessionType', 'source', 'status', 'actions'];
  protected readonly statusFilter = computed(() => this.status() ?? 'all');
  protected readonly typeFilter = computed(() => this.type() ?? 'all');
  protected readonly filteredLeads = computed(() => {
    const status = this.statusFilter();
    const type = this.typeFilter().toLowerCase();

    return this.leadStore.leads().filter((lead) => {
      const matchesStatus = status === 'all' || lead.status === status;
      const matchesType = type === 'all' || lead.sessionType.toLowerCase() === type;

      return matchesStatus && matchesType;
    });
  });

  protected setStatusFilter(status: string): void {
    void this.router.navigate([], {
      queryParams: { status: status === 'all' ? null : status },
      queryParamsHandling: 'merge',
    });
  }

  protected setTypeFilter(type: string): void {
    void this.router.navigate([], {
      queryParams: { type: type === 'all' ? null : type },
      queryParamsHandling: 'merge',
    });
  }
}
