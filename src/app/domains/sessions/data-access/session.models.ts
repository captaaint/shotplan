export type SessionStatus = 'inquiry' | 'booked' | 'done';

export interface Session {
  id: string;
  clientId: string;
  clientName: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  status: SessionStatus;
  galleryUrl?: string;
  shotList: string[];
}

export type CreateSessionRequest = Omit<Session, 'id'>;
export type UpdateSessionRequest = Partial<CreateSessionRequest>;
