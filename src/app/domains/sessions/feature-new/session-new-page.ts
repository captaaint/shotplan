import { Component, inject, signal, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { HasUnsavedChanges } from '../../../core/guards/unsaved-changes.guard';
import { ErrorState } from '../../../shared/ui/error-state/error-state';
import { LoadingState } from '../../../shared/ui/loading-state/loading-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { ClientStore } from '../../clients/data-access/client.store';
import { SessionForm } from '../components/session-form/session-form';
import { CreateSessionRequest } from '../data-access/session.models';
import { SessionStore } from '../data-access/session.store';

@Component({
  selector: 'app-session-new-page',
  imports: [ErrorState, LoadingState, PageHeader, RouterLink, SessionForm],
  templateUrl: './session-new-page.html',
  styleUrl: './session-new-page.scss',
})
export class SessionNewPage implements HasUnsavedChanges {
  private readonly router = inject(Router);
  protected readonly clientStore = inject(ClientStore);
  protected readonly sessionStore = inject(SessionStore);

  private readonly sessionForm = viewChild(SessionForm);
  protected readonly submitting = signal(false);

  protected createSession(session: CreateSessionRequest): void {
    this.submitting.set(true);

    this.sessionStore.createSession(session).subscribe({
      next: (createdSession) => {
        this.submitting.set(false);
        this.sessionForm()?.markSaved();
        void this.router.navigate(['/sessions', createdSession.id]);
      },
      error: () => {
        this.submitting.set(false);
      },
    });
  }

  hasUnsavedChanges(): boolean {
    return this.sessionForm()?.isDirty() ?? false;
  }
}
