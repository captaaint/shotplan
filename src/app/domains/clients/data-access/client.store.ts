import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { ClientApi } from './client.api';
import { Client, CreateClientRequest } from './client.models';

@Injectable({ providedIn: 'root' })
export class ClientStore {
  private readonly api = inject(ClientApi);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly clientsSignal = signal<Client[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly clients = this.clientsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadClients();
    }
  }

  loadClients(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.api.getClients().subscribe({
      next: (clients) => {
        this.clientsSignal.set(clients);
        this.loadingSignal.set(false);
      },
      error: () => {
        this.loadingSignal.set(false);
        this.errorSignal.set('Could not load clients. Check that the mock API is running.');
      },
    });
  }

  createClient(client: CreateClientRequest): Observable<Client> {
    this.errorSignal.set(null);

    return this.api.createClient(client).pipe(
      tap({
        next: (createdClient) => {
          this.clientsSignal.update((clients) => [...clients, createdClient]);
        },
        error: () => {
          this.errorSignal.set('Could not create the client. Try again in a moment.');
        },
      }),
    );
  }
}
