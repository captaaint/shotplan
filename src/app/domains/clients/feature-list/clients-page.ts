import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { ErrorState } from '../../../shared/ui/error-state/error-state';
import { LoadingState } from '../../../shared/ui/loading-state/loading-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { ClientStore } from '../data-access/client.store';

@Component({
  selector: 'app-clients-page',
  imports: [EmptyState, ErrorState, LoadingState, PageHeader, RouterLink],
  templateUrl: './clients-page.html',
  styleUrl: './clients-page.scss',
})
export class ClientsPage {
  protected readonly clientStore = inject(ClientStore);
}
