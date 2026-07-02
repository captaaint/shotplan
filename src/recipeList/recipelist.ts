import { Component, signal, computed} from '@angular/core';
import { recipes } from '../app/mock-recipes';
import { RecipeModel } from '../app/models';

@Component({
  selector: 'recipe-list',
  templateUrl: './recipelist.html',
})
export class RecipeList {
  constructor() {
    console.log('RecipeList component initialized.');
  }

  protected readonly selectedRecipe = signal<RecipeModel>(recipes[0]);
  protected readonly servings = signal(1);

  protected readonly ingredients = computed(() => {
    return this.selectedRecipe().ingredients.map(ingredient => ({
      ...ingredient,
      quantity: ingredient.quantity * this.servings(),
    }));
  });

  protected choose(recipeId: string): void {
    this.selectedRecipe.set(recipes.find(r => r.id === recipeId) || recipes[0]);
    console.log(`You chose: ${this.selectedRecipe()?.name}`);
  }

  protected increase(): void {
    this.servings.update(s => s + 1);
    console.log(`Servings increased to: ${this.servings()}`);
  }

  protected decrease(): void {
    this.servings.update(s => Math.max(1, s - 1));
    console.log(`Servings decreased to: ${this.servings()}`);
  }


}