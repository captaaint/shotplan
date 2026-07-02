import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [RouterOutlet],
})
export class App {
  protected readonly appTitle = signal('Smart Recipe Box');

  constructor() {
    console.log('App component initialized.');
  }
}
