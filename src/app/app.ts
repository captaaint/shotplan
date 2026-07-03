import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('shotplan');
  protected readonly session = signal({
    name: 'Anna',
    type: 'Portrait',
    date: new Date('2026-07-15'),
    galleryLink: '/gallery'
  });
}
