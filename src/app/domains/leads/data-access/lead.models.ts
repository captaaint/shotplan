export type LeadStatus = 'new' | 'contacted' | 'converted';

export interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  sessionType: string;
  source: string;
  status: LeadStatus;
  notes: string;
  convertedClientId?: string;
}

export type CreateLeadRequest = Omit<Lead, 'id' | 'convertedClientId'>;
export type UpdateLeadRequest = Partial<Omit<Lead, 'id'>>;
