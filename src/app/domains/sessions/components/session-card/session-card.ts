import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Session } from '../../data-access/session.models';

@Component({
  selector: 'app-session-card',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './session-card.html',
  styleUrl: './session-card.scss',
})
export class SessionCard {
  readonly session = input.required<Session>();
  readonly selected = input(false);
  readonly select = output<string>();
  readonly markDone = output<string>();

  protected selectSession(): void {
    this.select.emit(this.session().id);
  }

  protected markSessionDone(event: Event): void {
    event.stopPropagation();
    this.markDone.emit(this.session().id);
  }
}
