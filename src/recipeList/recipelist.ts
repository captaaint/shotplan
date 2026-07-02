import { Component, signal, computed } from '@angular/core';
import { recipes } from '../app/mock-recipes';
import { RecipeModel } from '../app/models';
import { RecipeDetails } from './recipedetails';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'recipe-list',
  templateUrl: './recipelist.html',
  standalone: true,
  imports: [RecipeDetails, FormsModule],
})
export class RecipeList {
  constructor() {
    console.log('RecipeList component initialized.');
  }
  protected readonly recipes = signal<RecipeModel[]>(recipes);
  protected readonly selectedRecipe = signal<RecipeModel>(recipes[0]);
  protected readonly query = signal('');

  protected choose(recipeId: string): void {
    this.selectedRecipe.set(recipes.find((r) => r.id === recipeId) || recipes[0]);
    console.log(`You chose: ${this.selectedRecipe()?.name}`);
  }

  protected filteredRecipes = computed(() => {
    const q = this.query().toLowerCase();
    return this.recipes().filter((recipe) => recipe.name.toLowerCase().includes(q));
  });
}
