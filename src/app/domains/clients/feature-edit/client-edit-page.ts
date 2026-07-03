import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { ErrorState } from '../../../shared/ui/error-state/error-state';
import { LoadingState } from '../../../shared/ui/loading-state/loading-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { ClientForm } from '../components/client-form/client-form';
import { CreateClientRequest } from '../data-access/client.models';
import { ClientStore } from '../data-access/client.store';

@Component({
  selector: 'app-client-edit-page',
  imports: [ClientForm, EmptyState, ErrorState, LoadingState, PageHeader, RouterLink],
  templateUrl: './client-edit-page.html',
  styleUrl: './client-edit-page.scss',
})
export class ClientEditPage {
  readonly id = input.required<string>();

  private readonly router = inject(Router);
  protected readonly clientStore = inject(ClientStore);

  protected readonly submitting = signal(false);
  protected readonly client = computed(() => this.clientStore.clientById(this.id()));

  private readonly loadClientEffect = effect(() => {
    this.clientStore.loadClient(this.id()).subscribe();
  });

  protected updateClient(client: CreateClientRequest): void {
    this.submitting.set(true);

    this.clientStore.updateClient(this.id(), client).subscribe({
      next: () => {
        this.submitting.set(false);
        void this.router.navigateByUrl('/clients');
      },
      error: () => {
        this.submitting.set(false);
      },
    });
  }

  protected retryLoad(): void {
    this.clientStore.loadClient(this.id()).subscribe();
  }
}
