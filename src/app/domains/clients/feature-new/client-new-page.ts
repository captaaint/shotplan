import { Component, inject, signal, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { HasUnsavedChanges } from '../../../core/guards/unsaved-changes.guard';
import { NotificationService } from '../../../core/services/notification.service';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { ClientForm } from '../components/client-form/client-form';
import { CreateClientRequest } from '../data-access/client.models';
import { ClientStore } from '../data-access/client.store';

@Component({
  selector: 'app-client-new-page',
  imports: [ClientForm, PageHeader, RouterLink],
  templateUrl: './client-new-page.html',
  styleUrl: './client-new-page.scss',
})
export class ClientNewPage implements HasUnsavedChanges {
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);
  protected readonly clientStore = inject(ClientStore);

  private readonly clientForm = viewChild(ClientForm);
  protected readonly submitting = signal(false);

  protected createClient(client: CreateClientRequest): void {
    this.submitting.set(true);

    this.clientStore.createClient(client).subscribe({
      next: () => {
        this.submitting.set(false);
        this.clientForm()?.markSaved();
        this.notificationService.success('Client created.');
        void this.router.navigateByUrl('/clients');
      },
      error: () => {
        this.submitting.set(false);
        this.notificationService.error('Could not create the client.');
      },
    });
  }

  hasUnsavedChanges(): boolean {
    return this.clientForm()?.isDirty() ?? false;
  }
}
