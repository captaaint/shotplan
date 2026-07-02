import { RecipeModel } from './models';

const recipes: RecipeModel[] = [
  {
    id: '1',
    name: 'Spaghetti Carbonara',
    description: 'A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.',
    authorEmail: 'mario@italy.com',
    ingredients: [
      { name: 'Spaghetti', quantity: 200, unit: 'grams' },
      { name: 'Pancetta', quantity: 100, unit: 'grams' },
    ],
    imageUrl: '/assets/spaghetti_carbonara.jpeg',
    favorite: true,
  },
  {
    id: '2',
    name: 'Caprese Salad',
    description: 'A simple and refreshing salad with fresh mozzarella, tomatoes, and basil.',
    authorEmail: 'giulia@italy.com',
    ingredients: [
      { name: 'Fresh Mozzarella', quantity: 150, unit: 'grams' },
      { name: 'Tomatoes', quantity: 2, unit: 'pieces' },
      { name: 'Fresh Basil', quantity: 10, unit: 'leaves' },
    ],
    imageUrl: '/assets/caprese_salad.jpeg',
  },
];

export { recipes };
