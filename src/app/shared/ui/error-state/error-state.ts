import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  templateUrl: './error-state.html',
  styleUrl: './error-state.scss',
})
export class ErrorState {
  readonly title = input('Something went wrong');
  readonly message = input.required<string>();
  readonly retry = output<void>();
}
