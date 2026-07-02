import { Component, signal, computed} from '@angular/core';
import { recipes } from '../app/mock-recipes';
import { RecipeModel } from '../app/models';
import { RecipeDetails } from "./recipedetails";

@Component({
  selector: 'recipe-list',
  templateUrl: './recipelist.html',
  standalone: true,
  imports: [RecipeDetails],
})
export class RecipeList {
  constructor() {
    console.log('RecipeList component initialized.');
  }

  protected readonly selectedRecipe = signal<RecipeModel>(recipes[0]);

  protected choose(recipeId: string): void {
    this.selectedRecipe.set(recipes.find(r => r.id === recipeId) || recipes[0]);
    console.log(`You chose: ${this.selectedRecipe()?.name}`);
  }




}