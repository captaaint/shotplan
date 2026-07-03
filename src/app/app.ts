import { Component, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SessionStore } from './domains/sessions/data-access/session.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly sessionStore = inject(SessionStore);

  protected readonly title = signal('Shotplan');

  private readonly titleEffect = effect(() => {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const session = this.sessionStore.selectedSession();
    document.title = session ? `${session.clientName} - ${this.title()}` : this.title();
  });
}
