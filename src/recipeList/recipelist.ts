import { Component, signal, computed, inject } from '@angular/core';
import { RecipeService } from './recipeservice';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'recipe-list',
  templateUrl: './recipelist.html',
  standalone: true,
  imports: [RouterLink, FormsModule],
})
export class RecipeList {
  constructor() {
    console.log('RecipeList component initialized.');
  }
  protected readonly recipeService = inject(RecipeService);
  protected readonly query = signal('');

  protected filteredRecipes = computed(() => {
    const q = this.query().toLowerCase();
    return this.recipeService
      .getRecipes()
      .filter((recipe) => recipe.name.toLowerCase().includes(q));
  });
}
