import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LeadStore } from '../leads/data-access/lead.store';
import { LocationStore } from '../locations/data-access/location.store';
import { PackageStore } from '../packages/data-access/package.store';
import { SessionStore } from '../sessions/data-access/session.store';
import { PageHeader } from '../../shared/ui/page-header/page-header';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, PageHeader, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  protected readonly leadStore = inject(LeadStore);
  protected readonly locationStore = inject(LocationStore);
  protected readonly packageStore = inject(PackageStore);
  protected readonly sessionStore = inject(SessionStore);

  protected readonly openLeadsCount = computed(
    () => this.leadStore.leads().filter((lead) => lead.status !== 'converted').length,
  );

  protected readonly followUpsDueCount = computed(
    () => this.leadStore.leads().filter((lead) => lead.status === 'contacted').length,
  );

  protected readonly bookedSessionsCount = computed(
    () => this.sessionStore.sessions().filter((session) => session.status === 'booked').length,
  );
}
