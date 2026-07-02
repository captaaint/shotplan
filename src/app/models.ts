export interface RecipeModel {
  id: string;
  name: string;
  description: string;
  ingredients: IngredientModel[];
  imageUrl: string;
}

export interface IngredientModel {
  name: string;
  quantity: number;
  unit: string;
}
