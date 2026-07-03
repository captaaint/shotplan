import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SessionStore } from '../sessions/data-access/session.store';
import { PageHeader } from '../../shared/ui/page-header/page-header';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, PageHeader],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  protected readonly sessionStore = inject(SessionStore);
}
