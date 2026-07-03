import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateLeadRequest, Lead, UpdateLeadRequest } from './lead.models';

@Injectable({ providedIn: 'root' })
export class LeadApi {
  private readonly http = inject(HttpClient);
  private readonly leadsUrl = '/leads';

  getLeads(): Observable<Lead[]> {
    return this.http.get<Lead[]>(this.leadsUrl);
  }

  getLead(leadId: string): Observable<Lead> {
    return this.http.get<Lead>(`${this.leadsUrl}/${leadId}`);
  }

  createLead(lead: CreateLeadRequest): Observable<Lead> {
    return this.http.post<Lead>(this.leadsUrl, lead);
  }

  updateLead(leadId: string, changes: UpdateLeadRequest): Observable<Lead> {
    return this.http.patch<Lead>(`${this.leadsUrl}/${leadId}`, changes);
  }
}
