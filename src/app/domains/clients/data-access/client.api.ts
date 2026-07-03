import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Client, CreateClientRequest, UpdateClientRequest } from './client.models';

@Injectable({ providedIn: 'root' })
export class ClientApi {
  private readonly http = inject(HttpClient);
  private readonly clientsUrl = '/clients';

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.clientsUrl);
  }

  getClient(clientId: string): Observable<Client> {
    return this.http.get<Client>(`${this.clientsUrl}/${clientId}`);
  }

  createClient(client: CreateClientRequest): Observable<Client> {
    return this.http.post<Client>(this.clientsUrl, client);
  }

  updateClient(clientId: string, changes: UpdateClientRequest): Observable<Client> {
    return this.http.patch<Client>(`${this.clientsUrl}/${clientId}`, changes);
  }
}
