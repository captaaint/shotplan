import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

type SessionStatus = 'inquiry' | 'booked' | 'done';

interface Session {
  id: string;
  clientName: string;
  type: string;
  date: Date;
  status: SessionStatus;
  galleryUrl?: string;
}

@Component({
  selector: 'app-root',
  imports: [DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Shotplan');
  protected readonly sessions = signal<Session[]>([
    {
      id: 's-101',
      clientName: 'Anna',
      type: 'Portrait',
      date: new Date('2026-07-15'),
      status: 'booked',
      galleryUrl: '/gallery/anna-portrait',
    },
    {
      id: 's-102',
      clientName: 'Mark',
      type: 'Engagement',
      date: new Date('2026-07-18'),
      status: 'inquiry',
    },
    {
      id: 's-103',
      clientName: 'Elena',
      type: 'Family',
      date: new Date('2026-07-22'),
      status: 'booked',
      galleryUrl: '/gallery/elena-family',
    },
    {
      id: 's-104',
      clientName: 'David',
      type: 'Headshots',
      date: new Date('2026-07-29'),
      status: 'done',
      galleryUrl: '/gallery/david-headshots',
    },
    {
      id: 's-105',
      clientName: 'Sophie',
      type: 'Branding',
      date: new Date('2026-08-03'),
      status: 'inquiry',
    },
  ]);
}
