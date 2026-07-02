import { Component, signal, computed, inject } from '@angular/core';
import { RecipeModel } from '../app/models';
import { RecipeDetails } from './recipedetails';
import { FormsModule } from '@angular/forms';
import { RecipeService } from './recipeservice';

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
  protected readonly recipeService = inject(RecipeService);
  protected readonly recipes = signal<RecipeModel[]>(this.recipeService.getRecipes());
  protected readonly selectedRecipe = signal<RecipeModel>(this.recipes()[0]);
  protected readonly query = signal('');

  protected choose(recipeId: string): void {
    this.selectedRecipe.set(this.recipeService.getRecipeById(recipeId) || this.recipes()[0]);
    console.log(`You chose: ${this.selectedRecipe()?.name}`);
  }

  protected filteredRecipes = computed(() => {
    const q = this.query().toLowerCase();
    return this.recipes().filter((recipe) => recipe.name.toLowerCase().includes(q));
  });
}
