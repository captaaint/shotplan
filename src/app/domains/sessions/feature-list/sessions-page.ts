import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SessionCard } from '../components/session-card/session-card';
import { SessionStore } from '../data-access/session.store';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { SearchBox } from '../../../shared/ui/search-box/search-box';

@Component({
  selector: 'app-sessions-page',
  imports: [CurrencyPipe, DatePipe, EmptyState, PageHeader, SearchBox, SessionCard],
  templateUrl: './sessions-page.html',
  styleUrl: './sessions-page.scss',
})
export class SessionsPage {
  protected readonly sessionStore = inject(SessionStore);
}
