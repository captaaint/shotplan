import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { ClientApi } from './client.api';
import { Client, CreateClientRequest, UpdateClientRequest } from './client.models';

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

  loadClient(clientId: string): Observable<Client> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.api.getClient(clientId).pipe(
      tap({
        next: (loadedClient) => {
          this.upsertClient(loadedClient);
          this.loadingSignal.set(false);
        },
        error: () => {
          this.loadingSignal.set(false);
          this.errorSignal.set('Could not load this client. Check that the mock API is running.');
        },
      }),
    );
  }

  clientById(clientId: string): Client | null {
    return this.clientsSignal().find((client) => client.id === clientId) ?? null;
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

  updateClient(clientId: string, changes: UpdateClientRequest): Observable<Client> {
    this.errorSignal.set(null);

    return this.api.updateClient(clientId, changes).pipe(
      tap({
        next: (updatedClient) => {
          this.upsertClient(updatedClient);
        },
        error: () => {
          this.errorSignal.set('Could not update the client. Try again in a moment.');
        },
      }),
    );
  }

  private upsertClient(nextClient: Client): void {
    this.clientsSignal.update((clients) => {
      const existingClient = clients.some((client) => client.id === nextClient.id);

      if (!existingClient) {
        return [...clients, nextClient];
      }

      return clients.map((client) => (client.id === nextClient.id ? nextClient : client));
    });
  }
}
