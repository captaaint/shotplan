import { Injectable } from '@nestjs/common';

export type Session = {
  id: string;
  clientName: string;
  type: string;
  date: string;
  status: 'inquiry' | 'booked' | 'done';
};

@Injectable()
export class SessionsService {
  private readonly sessions: Session[] = [
    {
      id: 's-101',
      clientName: 'Anna Kovacs',
      type: 'Portrait',
      date: '2026-07-15',
      status: 'booked',
    },
    {
      id: 's-102',
      clientName: 'Mark Turner',
      type: 'Engagement',
      date: '2026-07-18',
      status: 'inquiry',
    },
  ];

  findAll(): Session[] {
    return this.sessions;
  }
}
