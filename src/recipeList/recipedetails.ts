import { Component, input, signal, computed } from '@angular/core';
import { RecipeModel } from '../app/models';
import { IngredientModel } from '../app/models';

@Component({
  selector: 'recipe-details',
  templateUrl: './recipedetails.html',
  standalone: true,
})
export class RecipeDetails {

    protected readonly recipe = input.required<RecipeModel>();
    protected readonly servings = signal(1);

  protected readonly ingredients = computed(() => {
    return this.recipe().ingredients.map(ingredient => ({
      ...ingredient,
      quantity: ingredient.quantity * this.servings(),
    }));
  });

    protected increase(): void {
        this.servings.update(s => s + 1);
        console.log(`Servings increased to: ${this.servings()}`);
    }

    protected decrease(): void {
        this.servings.update(s => Math.max(1, s - 1));
        console.log(`Servings decreased to: ${this.servings()}`);
    }
}
    