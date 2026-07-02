import { Injectable, signal } from '@angular/core';
import { RecipeModel } from '../app/models';
import { recipes } from '../app/mock-recipes';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly recipes = signal<RecipeModel[]>(recipes);

  getRecipes() {
    return this.recipes();
  }

  getRecipeById(recipeId: string): RecipeModel | undefined {
    return this.recipes().find((r) => r.id === recipeId);
  }
}