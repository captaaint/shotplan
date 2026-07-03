export type SessionStatus = 'inquiry' | 'booked' | 'done';

export interface Session {
  id: string;
  clientName: string;
  type: string;
  date: Date;
  price: number;
  status: SessionStatus;
  galleryUrl?: string;
}
