import { Component, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, isPlatformBrowser } from '@angular/common';
import { SessionStore } from './domains/sessions/data-access/session.store';
import { SessionCard } from './domains/sessions/components/session-card/session-card';
import { EmptyState } from './shared/ui/empty-state/empty-state';
import { PageHeader } from './shared/ui/page-header/page-header';
import { SearchBox } from './shared/ui/search-box/search-box';

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe, DatePipe, EmptyState, PageHeader, SearchBox, SessionCard],
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
