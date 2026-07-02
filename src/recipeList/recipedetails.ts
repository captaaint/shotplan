import { Component, input, signal, computed, inject } from '@angular/core';
import { RecipeModel } from '../app/models';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RecipeService } from './recipeservice';

@Component({
  selector: 'recipe-details',
  templateUrl: './recipedetails.html',
  styleUrl: './recipedetails.css',
  standalone: true,
  imports: [RouterModule],
})
export class RecipeDetails {
  protected readonly servings = signal(1);
  private activatedRoute = inject(ActivatedRoute);
  private recipeService = inject(RecipeService);

  protected readonly recipe = computed(() => {
    const recipeId = this.activatedRoute.snapshot.paramMap.get('id');
    return recipeId ? this.recipeService.getRecipeById(recipeId) : undefined;
  });

  protected readonly ingredients = computed(() => {
    return (
      this.recipeService
        .getRecipeById(this.activatedRoute.snapshot.paramMap.get('id') || '')
        ?.ingredients.map((ingredient) => ({
          ...ingredient,
          quantity: ingredient.quantity * this.servings(),
        })) || []
    );
  });

  protected increase(): void {
    this.servings.update((s) => s + 1);
    console.log(`Servings increased to: ${this.servings()}`);
  }

  protected decrease(): void {
    this.servings.update((s) => Math.max(1, s - 1));
    console.log(`Servings decreased to: ${this.servings()}`);
  }
}
