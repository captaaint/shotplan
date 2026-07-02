import { Component, inject, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { RecipeService } from './recipeservice';
import { RouterLink } from '@angular/router';
import { SubmitButton } from './submitbtn';

@Component({
  selector: 'create-recipe',
  templateUrl: './createrecipe.html',
  imports: [FormField, RouterLink, SubmitButton],
  standalone: true,
})
export class CreateRecipe {
  protected readonly recipeService = inject(RecipeService);

  protected readonly recipeModel = signal({
    name: '',
    description: '',
    authorEmail: '',
  });

  protected readonly recipeForm = form(this.recipeModel);

  constructor() {
    console.log('CreateRecipe component initialized.');
  }

  protected submit(event: Event): void {
    event.preventDefault();

    this.recipeService.addRecipe({
      id: Date.now().toString(),
      name: this.recipeModel().name || 'Unnamed Recipe',
      description: this.recipeModel().description || '',
      authorEmail: this.recipeModel().authorEmail || '',
      ingredients: [],
      imageUrl: 'https://placehold.co/600x400/000000/FFFFFF/png',
    });
  }
}
