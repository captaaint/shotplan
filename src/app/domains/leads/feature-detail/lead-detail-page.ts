import { Component, computed, effect, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { NotificationService } from '../../../core/services/notification.service';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { ErrorState } from '../../../shared/ui/error-state/error-state';
import { LoadingState } from '../../../shared/ui/loading-state/loading-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { ClientStore } from '../../clients/data-access/client.store';
import { LeadStore } from '../data-access/lead.store';

@Component({
  selector: 'app-lead-detail-page',
  imports: [EmptyState, ErrorState, LoadingState, MatButtonModule, PageHeader, RouterLink],
  templateUrl: './lead-detail-page.html',
  styleUrl: './lead-detail-page.scss',
})
export class LeadDetailPage {
  readonly id = input.required<string>();

  private readonly clientStore = inject(ClientStore);
  private readonly notificationService = inject(NotificationService);
  protected readonly leadStore = inject(LeadStore);
  protected readonly lead = computed(() => this.leadStore.leadById(this.id()));

  private readonly loadLeadEffect = effect(() => {
    this.leadStore.loadLead(this.id()).subscribe();
  });

  protected convertLead(): void {
    const lead = this.lead();

    if (!lead) {
      return;
    }

    this.clientStore
      .createClient({
        fullName: lead.fullName,
        email: lead.email,
        phone: lead.phone,
        instagramHandle: '',
        notes: `Converted from ${lead.source} lead. ${lead.notes}`,
      })
      .subscribe({
        next: (client) => {
          this.leadStore
            .updateLead(lead.id, { status: 'converted', convertedClientId: client.id })
            .subscribe(() => this.notificationService.success('Lead converted to client.'));
        },
        error: () => this.notificationService.error('Could not convert the lead.'),
      });
  }
}
