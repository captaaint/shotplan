import { RecipeModel } from './models';

const recipes: RecipeModel[] = [
  {
    id: '1',
    name: 'Spaghetti Carbonara',
    description: 'A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.',
    ingredients: [
      { name: 'Spaghetti', quantity: 200, unit: 'grams' },
      { name: 'Pancetta', quantity: 100, unit: 'grams' },
    ],
    imageUrl: '/assets/spaghetti_carbonara.jpeg',
  },
  {
    id: '2',
    name: 'Caprese Salad',
    description: 'A simple and refreshing salad with fresh mozzarella, tomatoes, and basil.',
    ingredients: [
      { name: 'Fresh Mozzarella', quantity: 150, unit: 'grams' },
      { name: 'Tomatoes', quantity: 2, unit: 'pieces' },
      { name: 'Fresh Basil', quantity: 10, unit: 'leaves' },
    ],
    imageUrl: '/assets/caprese_salad.jpeg',
  },
];

export { recipes };
