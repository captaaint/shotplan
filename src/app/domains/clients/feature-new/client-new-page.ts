import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

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
export class ClientNewPage {
  private readonly router = inject(Router);
  protected readonly clientStore = inject(ClientStore);

  protected readonly submitting = signal(false);

  protected createClient(client: CreateClientRequest): void {
    this.submitting.set(true);

    this.clientStore.createClient(client).subscribe({
      next: () => {
        this.submitting.set(false);
        void this.router.navigateByUrl('/clients');
      },
      error: () => {
        this.submitting.set(false);
      },
    });
  }
}
