import User from '../models/User.model';
import Recipe from '../models/Recipe.model';
import Review from '../models/Review.model';
import connectDB from '../config/db';
import dotenv from 'dotenv';
import { DEMO_USER } from '../config/constants';
import mongoose from 'mongoose';

dotenv.config();

const demoRecipes = [
  {
    title: 'Classic Margherita Pizza',
    shortDescription: 'A timeless Italian pizza with fresh tomatoes and mozzarella.',
    fullDescription:
      'The Margherita pizza is the queen of all pizzas. Made with San Marzano tomatoes, fresh mozzarella, and fragrant basil leaves, this classic Neapolitan pie represents the Italian flag colors and centuries of culinary tradition. Perfect for weeknight dinners or weekend gatherings.',
    ingredients: [
      { name: 'Pizza dough', quantity: '250g' },
      { name: 'San Marzano tomatoes', quantity: '200g' },
      { name: 'Fresh mozzarella', quantity: '150g' },
      { name: 'Fresh basil leaves', quantity: '10 leaves' },
      { name: 'Olive oil', quantity: '2 tbsp' },
      { name: 'Salt', quantity: 'to taste' },
    ],
    steps: [
      'Preheat oven to 250°C (480°F) with a pizza stone inside.',
      'Stretch pizza dough into a 12-inch circle on a floured surface.',
      'Crush tomatoes by hand and spread evenly over the dough, leaving a 1-inch border.',
      'Tear mozzarella and scatter over the sauce.',
      'Drizzle with olive oil and season with salt.',
      'Bake for 10–12 minutes until crust is golden and cheese is bubbly.',
      'Top with fresh basil leaves and serve immediately.',
    ],
    cuisineType: 'Italian',
    dietType: 'veg',
    cookTime: 25,
    difficulty: 'easy',
    images: [
      'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800',
    ],
    avgRating: 4.8,
    totalReviews: 1,
  },
  {
    title: 'Chicken Tikka Masala',
    shortDescription: 'Tender chicken in a rich, spiced tomato-cream sauce.',
    fullDescription:
      'Chicken Tikka Masala is a beloved dish featuring marinated and grilled chicken pieces simmered in a velvety tomato-based sauce infused with aromatic spices. This restaurant-quality recipe brings the warmth of Indian cuisine right to your kitchen, perfect served with basmati rice or naan bread.',
    ingredients: [
      { name: 'Chicken breast', quantity: '500g' },
      { name: 'Yogurt', quantity: '150ml' },
      { name: 'Garam masala', quantity: '2 tsp' },
      { name: 'Turmeric', quantity: '1 tsp' },
      { name: 'Tomato puree', quantity: '400g' },
      { name: 'Heavy cream', quantity: '100ml' },
      { name: 'Onion', quantity: '1 large' },
      { name: 'Garlic cloves', quantity: '4 cloves' },
      { name: 'Fresh ginger', quantity: '1 inch piece' },
      { name: 'Cumin seeds', quantity: '1 tsp' },
    ],
    steps: [
      'Marinate chicken with yogurt, garam masala, turmeric, and salt for at least 2 hours.',
      'Grill or pan-fry marinated chicken until charred and cooked through.',
      'Sauté onions in oil until golden. Add garlic and ginger, cook 2 minutes.',
      'Add tomato puree, remaining spices, and simmer for 15 minutes.',
      'Add grilled chicken pieces to the sauce.',
      'Stir in heavy cream and simmer for 5 minutes.',
      'Garnish with fresh cilantro and serve with rice or naan.',
    ],
    cuisineType: 'Indian',
    dietType: 'non-veg',
    cookTime: 45,
    difficulty: 'medium',
    images: [
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
    ],
    avgRating: 4.9,
    totalReviews: 1,
  },
  {
    title: 'Avocado Toast with Poached Eggs',
    shortDescription: 'Creamy avocado on sourdough topped with perfectly poached eggs.',
    fullDescription:
      'Elevate your breakfast game with this nutrient-packed avocado toast. Ripe avocados are mashed with lemon juice and seasonings, spread over toasted sourdough, and topped with silky poached eggs. Quick, satisfying, and endlessly customizable — this is the breakfast of champions.',
    ingredients: [
      { name: 'Sourdough bread', quantity: '2 slices' },
      { name: 'Ripe avocados', quantity: '2' },
      { name: 'Eggs', quantity: '2' },
      { name: 'Lemon juice', quantity: '1 tbsp' },
      { name: 'Red pepper flakes', quantity: '½ tsp' },
      { name: 'Salt and pepper', quantity: 'to taste' },
      { name: 'White vinegar', quantity: '1 tbsp' },
    ],
    steps: [
      'Toast sourdough bread until golden and crispy.',
      'Mash avocado with lemon juice, salt, and pepper.',
      'Bring a pot of water to a gentle simmer. Add vinegar.',
      'Crack each egg into a small cup. Create a gentle whirlpool and slide eggs in.',
      'Poach eggs for 3 minutes until whites are set but yolk is still runny.',
      'Spread avocado mixture onto toast.',
      'Top with poached eggs, red pepper flakes, and a drizzle of olive oil.',
    ],
    cuisineType: 'American',
    dietType: 'veg',
    cookTime: 15,
    difficulty: 'easy',
    images: [
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800',
    ],
    avgRating: 4.5,
    totalReviews: 1,
  },
  {
    title: 'Vegan Buddha Bowl',
    shortDescription: 'Colorful, nutrient-dense bowl with roasted veggies and tahini dressing.',
    fullDescription:
      'This vibrant Buddha Bowl is a celebration of plant-based eating. Roasted sweet potatoes, crispy chickpeas, steamed quinoa, and fresh greens are arranged beautifully and drizzled with a creamy tahini lemon dressing. It\'s filling, delicious, and completely vegan — your body will thank you.',
    ingredients: [
      { name: 'Quinoa', quantity: '1 cup' },
      { name: 'Sweet potato', quantity: '1 medium' },
      { name: 'Canned chickpeas', quantity: '400g' },
      { name: 'Baby spinach', quantity: '2 cups' },
      { name: 'Cherry tomatoes', quantity: '1 cup' },
      { name: 'Tahini', quantity: '3 tbsp' },
      { name: 'Lemon juice', quantity: '2 tbsp' },
      { name: 'Olive oil', quantity: '2 tbsp' },
      { name: 'Garlic powder', quantity: '1 tsp' },
      { name: 'Paprika', quantity: '1 tsp' },
    ],
    steps: [
      'Cook quinoa according to package instructions. Let cool slightly.',
      'Cube sweet potato, toss with olive oil and paprika, roast at 200°C for 25 minutes.',
      'Drain and rinse chickpeas, toss with olive oil and garlic powder, roast for 20 minutes.',
      'Make dressing: whisk tahini, lemon juice, garlic, and 3 tbsp water.',
      'Assemble bowls with quinoa base, then arrange sweet potato, chickpeas, spinach, and tomatoes.',
      'Drizzle generously with tahini dressing.',
      'Serve immediately or store components separately for meal prep.',
    ],
    cuisineType: 'Mediterranean',
    dietType: 'vegan',
    cookTime: 40,
    difficulty: 'easy',
    images: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    ],
    avgRating: 4.7,
    totalReviews: 1,
  },
  {
    title: 'Classic French Onion Soup',
    shortDescription: 'Rich, caramelized onion soup topped with Gruyère crouton.',
    fullDescription:
      'French Onion Soup is a culinary masterpiece born from patience and simplicity. Slowly caramelized onions transform into a deeply sweet and savory broth, ladled into bowls, topped with a crusty crouton, and blanketed with melted Gruyère cheese. This bistro classic warms you from the inside out.',
    ingredients: [
      { name: 'Yellow onions', quantity: '6 large' },
      { name: 'Unsalted butter', quantity: '4 tbsp' },
      { name: 'Beef broth', quantity: '1.5 liters' },
      { name: 'Dry white wine', quantity: '150ml' },
      { name: 'Baguette slices', quantity: '4 thick' },
      { name: 'Gruyère cheese', quantity: '200g' },
      { name: 'Fresh thyme', quantity: '4 sprigs' },
      { name: 'Bay leaves', quantity: '2' },
    ],
    steps: [
      'Slice onions thinly. Melt butter in a large heavy pot over medium heat.',
      'Add onions with a pinch of salt. Cook, stirring occasionally, for 45–60 minutes until deeply caramelized.',
      'Add wine, scraping up browned bits. Cook until mostly evaporated.',
      'Add broth, thyme, and bay leaves. Simmer for 20 minutes.',
      'Season with salt and pepper. Remove bay leaves and thyme.',
      'Ladle into oven-safe bowls. Top with baguette slice and generous amount of Gruyère.',
      'Broil until cheese is bubbly and golden. Serve immediately.',
    ],
    cuisineType: 'French',
    dietType: 'non-veg',
    cookTime: 90,
    difficulty: 'hard',
    images: [
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
    ],
    avgRating: 4.6,
    totalReviews: 1,
  },
];

const seedDB = async (): Promise<void> => {
  await connectDB();

  console.log('🌱 Starting database seed...');

  // Clear existing data
  await User.deleteMany({});
  await Recipe.deleteMany({});
  await Review.deleteMany({});
  console.log('🗑️  Cleared existing data');

  // Create demo user
  const demoUser = await User.create(DEMO_USER);
  console.log(`👤 Created demo user: ${demoUser.email}`);

  // Create admin user
  const adminUser = await User.create({
    name: 'Admin',
    email: 'admin@pantrypilot.com',
    password: 'Admin@1234',
    avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=admin',
    role: 'admin',
  });
  console.log(`👑 Created admin user: ${adminUser.email}`);

  // Create recipes authored by demo user
  const createdRecipes = await Promise.all(
    demoRecipes.map((recipe) =>
      Recipe.create({ ...recipe, authorId: demoUser._id })
    )
  );
  console.log(`🍽️  Created ${createdRecipes.length} recipes`);

  // Add one review per recipe from admin user
  await Promise.all(
    createdRecipes.map((recipe, i) =>
      Review.create({
        recipeId: recipe._id,
        userId: adminUser._id,
        rating: [5, 5, 4, 5, 5][i] || 5,
        comment: [
          'Absolutely perfect! Crispy crust and fresh toppings.',
          'Incredible depth of flavor! Better than any restaurant.',
          'So easy and delicious! My new go-to breakfast.',
          'Love how colorful and filling this is!',
          'The caramelized onions make all the difference. A masterpiece.',
        ][i] || 'Amazing recipe!',
      })
    )
  );
  console.log(`⭐ Created reviews for all recipes`);

  console.log('✅ Database seeded successfully!');
  console.log('─'.repeat(40));
  console.log('Demo User   → demo@pantrypilot.com / Demo@1234');
  console.log('Admin User  → admin@pantrypilot.com / Admin@1234');
  console.log('─'.repeat(40));

  await mongoose.disconnect();
  process.exit(0);
};

seedDB().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
