export interface RecipeModel {
  id: string;
  name: string;
  description: string;
  authorEmail: string;
  ingredients: IngredientModel[];
  imageUrl: string;
  favorite?: boolean;
}

export interface IngredientModel {
  name: string;
  quantity: number;
  unit: string;
}
