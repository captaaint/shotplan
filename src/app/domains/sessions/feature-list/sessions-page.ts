import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { RouterLink } from '@angular/router';

import { ConfirmationService } from '../../../core/services/confirmation.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SessionStore } from '../data-access/session.store';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { ErrorState } from '../../../shared/ui/error-state/error-state';
import { LoadingState } from '../../../shared/ui/loading-state/loading-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { SearchBox } from '../../../shared/ui/search-box/search-box';
import { Session } from '../data-access/session.models';

@Component({
  selector: 'app-sessions-page',
  imports: [
    CurrencyPipe,
    DatePipe,
    EmptyState,
    ErrorState,
    LoadingState,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSortModule,
    MatTableModule,
    PageHeader,
    RouterLink,
    SearchBox,
  ],
  templateUrl: './sessions-page.html',
  styleUrl: './sessions-page.scss',
})
export class SessionsPage {
  private readonly confirmationService = inject(ConfirmationService);
  private readonly notificationService = inject(NotificationService);
  protected readonly sessionStore = inject(SessionStore);
  protected readonly displayedColumns = [
    'clientName',
    'type',
    'date',
    'status',
    'price',
    'actions',
  ];
  protected readonly sort = signal<Sort>({ active: 'date', direction: 'asc' });

  protected readonly sortedSessions = computed(() => {
    const sort = this.sort();
    const sessions = [...this.sessionStore.filteredSessions()];

    if (!sort.direction) {
      return sessions;
    }

    return sessions.sort((left, right) => {
      const result = this.compareSessions(left, right, sort.active);

      return sort.direction === 'asc' ? result : -result;
    });
  });

  protected sortSessions(sort: Sort): void {
    this.sort.set(sort);
  }

  protected addTestSession(): void {
    this.sessionStore.addTestSession().subscribe({
      next: () => this.notificationService.success('Test session created.'),
      error: () => this.notificationService.error('Could not create the test session.'),
    });
  }

  protected markSessionDone(session: Session): void {
    this.sessionStore.updateSession(session.id, { status: 'done' }).subscribe({
      next: () => this.notificationService.success(`${session.clientName} marked done.`),
      error: () => this.notificationService.error('Could not update the session.'),
    });
  }

  protected deleteSession(session: Session): void {
    this.confirmationService
      .confirm({
        title: 'Delete session?',
        message: `Delete ${session.clientName}'s ${session.type} session? This cannot be undone.`,
        confirmLabel: 'Delete',
      })
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }

        this.sessionStore.deleteSession(session.id).subscribe({
          next: () => this.notificationService.success('Session deleted.'),
          error: () => this.notificationService.error('Could not delete the session.'),
        });
      });
  }

  private compareSessions(left: Session, right: Session, active: string): number {
    switch (active) {
      case 'clientName':
        return left.clientName.localeCompare(right.clientName);
      case 'type':
        return left.type.localeCompare(right.type);
      case 'date':
        return left.date.localeCompare(right.date);
      case 'status':
        return left.status.localeCompare(right.status);
      case 'price':
        return left.price - right.price;
      default:
        return 0;
    }
  }
}
