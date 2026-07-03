import { Component, computed, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

type SessionStatus = 'inquiry' | 'booked' | 'done';

interface Session {
  id: string;
  clientName: string;
  type: string;
  date: Date;
  price: number;
  status: SessionStatus;
  galleryUrl?: string;
}

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Shotplan');
  protected readonly selectedSessionId = signal<string | null>(null);
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

  protected selectSession(sessionId: string): void {
    this.selectedSessionId.set(sessionId);
  }

  protected markSelectedDone(): void {
    const selectedId = this.selectedSessionId();

    if (!selectedId) {
      return;
    }

    this.sessions.update((sessions) =>
      sessions.map((session) =>
        session.id === selectedId ? { ...session, status: 'done' } : session,
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
