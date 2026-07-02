import { Component, computed, signal } from '@angular/core';
import { RecipeList } from '../recipeList/recipelist';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [RecipeList],
})
export class App {
  protected readonly appTitle = signal('Smart Recipe Box');

  constructor() {
    console.log('App component initialized.');
  }
}
