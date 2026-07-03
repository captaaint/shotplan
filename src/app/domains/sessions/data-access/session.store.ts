import { Injectable, computed, signal } from '@angular/core';
import { Session } from './session.models';

const INITIAL_SESSIONS: Session[] = [
  {
    id: 's-101',
    clientName: 'Anna',
    type: 'Portrait',
    date: new Date('2026-07-15'),
    price: 240,
    status: 'booked',
    galleryUrl: '/gallery/anna-portrait',
  },
  {
    id: 's-102',
    clientName: 'Mark',
    type: 'Engagement',
    date: new Date('2026-07-18'),
    price: 420,
    status: 'inquiry',
  },
  {
    id: 's-103',
    clientName: 'Elena',
    type: 'Family',
    date: new Date('2026-07-22'),
    price: 320,
    status: 'booked',
    galleryUrl: '/gallery/elena-family',
  },
  {
    id: 's-104',
    clientName: 'David',
    type: 'Headshots',
    date: new Date('2026-07-29'),
    price: 180,
    status: 'done',
    galleryUrl: '/gallery/david-headshots',
  },
  {
    id: 's-105',
    clientName: 'Sophie',
    type: 'Branding',
    date: new Date('2026-08-03'),
    price: 560,
    status: 'inquiry',
  },
];

@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly sessionsSignal = signal<Session[]>(INITIAL_SESSIONS);
  private readonly selectedSessionIdSignal = signal<string | null>(null);

  readonly query = signal('');
  readonly sessions = this.sessionsSignal.asReadonly();
  readonly selectedSessionId = this.selectedSessionIdSignal.asReadonly();

  readonly selectedSession = computed(() => {
    const selectedId = this.selectedSessionIdSignal();

    return this.sessionsSignal().find((session) => session.id === selectedId) ?? null;
  });

  readonly upcomingCount = computed(
    () => this.sessionsSignal().filter((session) => session.status !== 'done').length,
  );

  readonly bookedRevenue = computed(() =>
    this.sessionsSignal()
      .filter((session) => session.status === 'booked')
      .reduce((total, session) => total + session.price, 0),
  );

  readonly filteredSessions = computed(() => {
    const query = this.query().trim().toLowerCase();

    if (!query) {
      return this.sessionsSignal();
    }

    return this.sessionsSignal().filter((session) =>
      session.clientName.toLowerCase().includes(query),
    );
  });

  selectSession(sessionId: string): void {
    this.selectedSessionIdSignal.set(sessionId);
  }

  markSessionDone(sessionId: string): void {
    this.sessionsSignal.update((sessions) =>
      sessions.map((session) =>
        session.id === sessionId ? { ...session, status: 'done' } : session,
      ),
    );
  }

  addTestSession(): void {
    const sessionNumber = this.sessionsSignal().length + 1;
    const newSession: Session = {
      id: `s-${Date.now()}`,
      clientName: `Test Client ${sessionNumber}`,
      type: 'Mini Session',
      date: new Date('2026-08-10'),
      price: 150,
      status: 'booked',
    };

    this.sessionsSignal.update((sessions) => [...sessions, newSession]);
    this.selectedSessionIdSignal.set(newSession.id);
  }
}
