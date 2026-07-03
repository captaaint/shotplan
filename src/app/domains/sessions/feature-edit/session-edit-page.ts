import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { ErrorState } from '../../../shared/ui/error-state/error-state';
import { LoadingState } from '../../../shared/ui/loading-state/loading-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { ClientStore } from '../../clients/data-access/client.store';
import { SessionForm } from '../components/session-form/session-form';
import { CreateSessionRequest } from '../data-access/session.models';
import { SessionStore } from '../data-access/session.store';

@Component({
  selector: 'app-session-edit-page',
  imports: [EmptyState, ErrorState, LoadingState, PageHeader, RouterLink, SessionForm],
  templateUrl: './session-edit-page.html',
  styleUrl: './session-edit-page.scss',
})
export class SessionEditPage {
  readonly id = input.required<string>();

  private readonly router = inject(Router);
  protected readonly clientStore = inject(ClientStore);
  protected readonly sessionStore = inject(SessionStore);

  protected readonly submitting = signal(false);
  protected readonly session = computed(() => this.sessionStore.sessionById(this.id()));

  private readonly loadSessionEffect = effect(() => {
    this.sessionStore.loadSession(this.id()).subscribe();
  });

  protected updateSession(session: CreateSessionRequest): void {
    this.submitting.set(true);

    this.sessionStore.updateSession(this.id(), session).subscribe({
      next: (updatedSession) => {
        this.submitting.set(false);
        void this.router.navigate(['/sessions', updatedSession.id]);
      },
      error: () => {
        this.submitting.set(false);
      },
    });
  }

  protected retryLoad(): void {
    this.sessionStore.loadSession(this.id()).subscribe();
    this.clientStore.loadClients();
  }
}
