export interface Client {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  instagramHandle: string;
  notes: string;
}

export type CreateClientRequest = Omit<Client, 'id'>;
