import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SessionStore } from '../data-access/session.store';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';

@Component({
  selector: 'app-session-detail-page',
  imports: [CurrencyPipe, DatePipe, EmptyState, PageHeader, RouterLink],
  templateUrl: './session-detail-page.html',
  styleUrl: './session-detail-page.scss',
})
export class SessionDetailPage {
  readonly id = input.required<string>();

  protected readonly sessionStore = inject(SessionStore);
  protected readonly session = computed(() => this.sessionStore.sessionById(this.id()));
}
