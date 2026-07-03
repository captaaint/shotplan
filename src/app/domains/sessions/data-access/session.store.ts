import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';

import { SessionApi } from './session.api';
import { Session } from './session.models';

@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly api = inject(SessionApi);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly sessionsSignal = signal<Session[]>([]);
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

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadSessions();
    }
  }

  loadSessions(): void {
    this.api.getSessions().subscribe({
      next: (sessions) => this.sessionsSignal.set(sessions),
      error: (error) => console.error('Could not load sessions', error),
    });
  }

  sessionById(sessionId: string): Session | null {
    return this.sessionsSignal().find((session) => session.id === sessionId) ?? null;
  }

  selectSession(sessionId: string): void {
    this.selectedSessionIdSignal.set(sessionId);
  }

  markSessionDone(sessionId: string): void {
    this.api.updateSession(sessionId, { status: 'done' }).subscribe({
      next: (updatedSession) => {
        this.sessionsSignal.update((sessions) =>
          sessions.map((session) => (session.id === sessionId ? updatedSession : session)),
        );
      },
      error: (error) => console.error('Could not update session', error),
    });
  }

  addTestSession(): void {
    const sessionNumber = this.sessionsSignal().length + 1;
    const newSession: Session = {
      id: `s-${Date.now()}`,
      clientName: `Test Client ${sessionNumber}`,
      type: 'Mini Session',
      date: '2026-08-10',
      price: 150,
      status: 'booked',
    };

    this.api.createSession(newSession).subscribe({
      next: (createdSession) => {
        this.sessionsSignal.update((sessions) => [...sessions, createdSession]);
        this.selectedSessionIdSignal.set(createdSession.id);
      },
      error: (error) => console.error('Could not create session', error),
    });
  }
}
