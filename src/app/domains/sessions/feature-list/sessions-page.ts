import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SessionCard } from '../components/session-card/session-card';
import { SessionStore } from '../data-access/session.store';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { SearchBox } from '../../../shared/ui/search-box/search-box';

@Component({
  selector: 'app-sessions-page',
  imports: [CurrencyPipe, EmptyState, PageHeader, RouterLink, SearchBox, SessionCard],
  templateUrl: './sessions-page.html',
  styleUrl: './sessions-page.scss',
})
export class SessionsPage {
  protected readonly sessionStore = inject(SessionStore);
}
