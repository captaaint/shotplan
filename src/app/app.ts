import { Component, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, isPlatformBrowser } from '@angular/common';
import { SessionCard } from './domains/sessions/components/session-card/session-card';
import { Session } from './session.model';
import { SearchBox } from './shared/ui/search-box/search-box';

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe, DatePipe, SearchBox, SessionCard],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly title = signal('Shotplan');
  protected readonly selectedSessionId = signal<string | null>(null);
  protected readonly query = signal('');
  protected readonly sessions = signal<Session[]>([
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
  ]);

  protected readonly selectedSession = computed(() => {
    const selectedId = this.selectedSessionId();

    return this.sessions().find((session) => session.id === selectedId) ?? null;
  });

  protected readonly upcomingCount = computed(
    () => this.sessions().filter((session) => session.status !== 'done').length,
  );

  protected readonly bookedRevenue = computed(() =>
    this.sessions()
      .filter((session) => session.status === 'booked')
      .reduce((total, session) => total + session.price, 0),
  );

  protected readonly filteredSessions = computed(() => {
    const query = this.query().trim().toLowerCase();

    if (!query) {
      return this.sessions();
    }

    return this.sessions().filter((session) =>
      session.clientName.toLowerCase().includes(query),
    );
  });

  private readonly titleEffect = effect(() => {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const session = this.selectedSession();
    document.title = session ? `${session.clientName} - ${this.title()}` : this.title();
  });

  protected selectSession(sessionId: string): void {
    this.selectedSessionId.set(sessionId);
  }

  protected markSessionDone(sessionId: string): void {
    this.sessions.update((sessions) =>
      sessions.map((session) =>
        session.id === sessionId ? { ...session, status: 'done' } : session,
      ),
    );
  }

  protected addTestSession(): void {
    const sessionNumber = this.sessions().length + 1;
    const newSession: Session = {
      id: `s-${Date.now()}`,
      clientName: `Test Client ${sessionNumber}`,
      type: 'Mini Session',
      date: new Date('2026-08-10'),
      price: 150,
      status: 'booked',
    };

    this.sessions.update((sessions) => [...sessions, newSession]);
    this.selectedSessionId.set(newSession.id);
  }
}
