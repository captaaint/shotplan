import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { CreateLeadRequest, Lead, UpdateLeadRequest } from './lead.models';
import { LeadApi } from './lead.api';

@Injectable({ providedIn: 'root' })
export class LeadStore {
  private readonly api = inject(LeadApi);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly leadsSignal = signal<Lead[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly leads = this.leadsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadLeads();
    }
  }

  loadLeads(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.api.getLeads().subscribe({
      next: (leads) => {
        this.leadsSignal.set(leads);
        this.loadingSignal.set(false);
      },
      error: () => {
        this.loadingSignal.set(false);
        this.errorSignal.set('Could not load leads. Check that the mock API is running.');
      },
    });
  }

  loadLead(leadId: string): Observable<Lead> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.api.getLead(leadId).pipe(
      tap({
        next: (lead) => {
          this.upsertLead(lead);
          this.loadingSignal.set(false);
        },
        error: () => {
          this.loadingSignal.set(false);
          this.errorSignal.set('Could not load this lead.');
        },
      }),
    );
  }

  leadById(leadId: string): Lead | null {
    return this.leadsSignal().find((lead) => lead.id === leadId) ?? null;
  }

  createLead(lead: CreateLeadRequest): Observable<Lead> {
    this.errorSignal.set(null);

    return this.api.createLead(lead).pipe(tap((createdLead) => this.upsertLead(createdLead)));
  }

  updateLead(leadId: string, changes: UpdateLeadRequest): Observable<Lead> {
    this.errorSignal.set(null);

    return this.api.updateLead(leadId, changes).pipe(tap((lead) => this.upsertLead(lead)));
  }

  private upsertLead(nextLead: Lead): void {
    this.leadsSignal.update((leads) => {
      const exists = leads.some((lead) => lead.id === nextLead.id);

      return exists
        ? leads.map((lead) => (lead.id === nextLead.id ? nextLead : lead))
        : [...leads, nextLead];
    });
  }
}
