import { Component, inject } from '@angular/core';
import { RecipeService } from './recipeservice';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SubmitButton } from "./submitbtn";

@Component({
  selector: 'create-recipe',
  templateUrl: './createrecipe.html',
  imports: [ReactiveFormsModule, RouterLink, SubmitButton],
  standalone: true,
})
export class CreateRecipe {
  protected readonly recipeService = inject(RecipeService);
  private readonly formBuilder = inject(FormBuilder);
  constructor() {
    console.log('CreateRecipe component initialized.');
  }

  protected readonly recipeForm = this.formBuilder.group({
    name: [''],
    description: [''],
  });

  protected submit(): void {
    this.recipeService.addRecipe({
      id: Date.now().toString(),
      name: this.recipeForm.value.name || 'Unnamed Recipe',
      description: this.recipeForm.value.description || '',
      ingredients: [],
      imageUrl: 'https://placehold.co/600x400/000000/FFFFFF/png',
    });
  }
}
