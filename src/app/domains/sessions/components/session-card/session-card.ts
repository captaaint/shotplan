import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Session } from '../../../../session.model';

@Component({
  selector: 'app-session-card',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './session-card.html',
  styleUrl: './session-card.scss',
})
export class SessionCard {
  readonly session = input.required<Session>();
  readonly selected = input(false);
}
