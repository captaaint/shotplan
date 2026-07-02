import { Component, signal, computed, inject } from '@angular/core';
import { RecipeModel } from '../app/models';
import { FormsModule } from '@angular/forms';
import { RecipeService } from './recipeservice';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'recipe-list',
  templateUrl: './recipelist.html',
  standalone: true,
  imports: [FormsModule, RouterLink],
})
export class RecipeList {
  constructor() {
    console.log('RecipeList component initialized.');
  }
  protected readonly recipeService = inject(RecipeService);
  protected readonly selectedRecipe = signal<RecipeModel>(this.recipeService.getRecipes()[0]);
  protected readonly query = signal('');

  protected choose(recipeId: string): void {
    this.selectedRecipe.set(
      this.recipeService.getRecipeById(recipeId) || this.recipeService.getRecipes()[0],
    );

    console.log(`You chose: ${this.selectedRecipe()?.name}`);
  }

  protected filteredRecipes = computed(() => {
    const q = this.query().toLowerCase();
    return this.recipeService
      .getRecipes()
      .filter((recipe) => recipe.name.toLowerCase().includes(q));
  });
}
