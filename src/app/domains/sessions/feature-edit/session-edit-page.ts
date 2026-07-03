import { Component, computed, effect, inject, input, signal, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { HasUnsavedChanges } from '../../../core/guards/unsaved-changes.guard';
import { NotificationService } from '../../../core/services/notification.service';
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
export class SessionEditPage implements HasUnsavedChanges {
  readonly id = input.required<string>();

  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  protected readonly clientStore = inject(ClientStore);
  protected readonly sessionStore = inject(SessionStore);

  private readonly sessionForm = viewChild(SessionForm);
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
        this.sessionForm()?.markSaved();
        this.notificationService.success('Session updated.');
        void this.router.navigate(['/sessions', updatedSession.id]);
      },
      error: () => {
        this.submitting.set(false);
        this.notificationService.error('Could not update the session.');
      },
    });
  }

  protected retryLoad(): void {
    this.sessionStore.loadSession(this.id()).subscribe();
    this.clientStore.loadClients();
  }

  hasUnsavedChanges(): boolean {
    return this.sessionForm()?.isDirty() ?? false;
  }
}
