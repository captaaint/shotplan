import { Injectable, NotFoundException } from '@nestjs/common';

import { SessionEntity } from './session.entity';

@Injectable()
export class SessionsService {
  private readonly sessions: SessionEntity[] = [
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

  findAll(): SessionEntity[] {
    return this.sessions;
  }

  findOne(id: string): SessionEntity {
    const session = this.sessions.find((currentSession) => currentSession.id === id);

    if (!session) {
      throw new NotFoundException(`Session ${id} was not found.`);
    }

    return session;
  }
}
