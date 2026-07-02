import { Routes } from '@angular/router';
import { RecipeList } from '../recipeList/recipelist';
import { RecipeDetails } from '../recipeList/recipedetails';

export const routes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { path: 'recipes', component: RecipeList },
  { path: 'recipes/:id', component: RecipeDetails },
];
