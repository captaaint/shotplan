import { Component, signal } from '@angular/core';
import { recipes } from './mock-recipes';
import { RecipeModel } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly appTitle = signal('Smart Recipe Box');
  protected readonly selectedRecipe = signal<RecipeModel | null>(recipes[0]);

  constructor() {
    console.log('App component initialized.', recipes);
  }

  protected choose(recipeId: string): void {
    this.selectedRecipe.set(recipes.find(r => r.id === recipeId) || recipes[0]);
    console.log(`You chose: ${this.selectedRecipe()?.name}`);
  }
}
