import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { SessionApi } from './session.api';
import { CreateSessionRequest, Session, UpdateSessionRequest } from './session.models';

@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly api = inject(SessionApi);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly sessionsSignal = signal<Session[]>([]);
  private readonly selectedSessionIdSignal = signal<string | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly query = signal('');
  readonly sessions = this.sessionsSignal.asReadonly();
  readonly selectedSessionId = this.selectedSessionIdSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

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
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.api.getSessions().subscribe({
      next: (sessions) => {
        this.sessionsSignal.set(sessions);
        this.loadingSignal.set(false);
      },
      error: () => {
        this.loadingSignal.set(false);
        this.errorSignal.set('Could not load sessions. Check that the mock API is running.');
      },
    });
  }

  loadSession(sessionId: string): Observable<Session> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.api.getSession(sessionId).pipe(
      tap({
        next: (loadedSession) => {
          this.upsertSession(loadedSession);
          this.loadingSignal.set(false);
        },
        error: () => {
          this.loadingSignal.set(false);
          this.errorSignal.set('Could not load this session. Check that the mock API is running.');
        },
      }),
    );
  }

  sessionById(sessionId: string): Session | null {
    return this.sessionsSignal().find((session) => session.id === sessionId) ?? null;
  }

  selectSession(sessionId: string): void {
    this.selectedSessionIdSignal.set(sessionId);
  }

  markSessionDone(sessionId: string): void {
    this.errorSignal.set(null);

    this.api.updateSession(sessionId, { status: 'done' }).subscribe({
      next: (updatedSession) => {
        this.sessionsSignal.update((sessions) =>
          sessions.map((session) => (session.id === sessionId ? updatedSession : session)),
        );
      },
      error: () => {
        this.errorSignal.set('Could not update the session. Try again in a moment.');
      },
    });
  }

  createSession(session: CreateSessionRequest): Observable<Session> {
    this.errorSignal.set(null);

    return this.api.createSession(session).pipe(
      tap({
        next: (createdSession) => {
          this.sessionsSignal.update((sessions) => [...sessions, createdSession]);
          this.selectedSessionIdSignal.set(createdSession.id);
        },
        error: () => {
          this.errorSignal.set('Could not create the session. Try again in a moment.');
        },
      }),
    );
  }

  updateSession(sessionId: string, changes: UpdateSessionRequest): Observable<Session> {
    this.errorSignal.set(null);

    return this.api.updateSession(sessionId, changes).pipe(
      tap({
        next: (updatedSession) => {
          this.upsertSession(updatedSession);
        },
        error: () => {
          this.errorSignal.set('Could not update the session. Try again in a moment.');
        },
      }),
    );
  }

  addTestSession(): void {
    this.errorSignal.set(null);

    const sessionNumber = this.sessionsSignal().length + 1;
    const newSession: CreateSessionRequest = {
      clientId: 'c-101',
      clientName: `Test Client ${sessionNumber}`,
      type: 'Mini Session',
      date: '2026-08-10',
      startTime: '10:00',
      endTime: '11:00',
      price: 150,
      status: 'booked',
      shotList: ['Arrival portraits', 'Favorite detail shots'],
    };

    this.createSession(newSession).subscribe({
      error: () => {
        this.errorSignal.set('Could not create the test session. Try again in a moment.');
      },
    });
  }

  private upsertSession(nextSession: Session): void {
    this.sessionsSignal.update((sessions) => {
      const existingSession = sessions.some((session) => session.id === nextSession.id);

      if (!existingSession) {
        return [...sessions, nextSession];
      }

      return sessions.map((session) => (session.id === nextSession.id ? nextSession : session));
    });
  }
}
