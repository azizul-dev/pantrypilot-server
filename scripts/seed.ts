import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../src/config/db';
import User from '../src/models/User.model';
import Recipe from '../src/models/Recipe.model';
import Review from '../src/models/Review.model';

// ─── Demo users ────────────────────────────────────────────────────────────────
const USERS = [
  {
    name: 'Demo User',
    email: 'demo@pantrypilot.com',
    password: 'Demo@1234',
    avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=demo',
    role: 'user' as const,
  },
  {
    name: 'Admin',
    email: 'admin@pantrypilot.com',
    password: 'Admin@1234',
    avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=admin',
    role: 'admin' as const,
  },
  {
    name: 'Rina Begum',
    email: 'rina@pantrypilot.com',
    password: 'Rina@1234',
    avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=rina',
    role: 'user' as const,
  },
];

// ─── 28 Recipes ───────────────────────────────────────────────────────────────
const RECIPES = [
  // ── BENGALI (7) ─────────────────────────────────────────────────────────────
  {
    title: 'Shorshe Ilish (Hilsa in Mustard Sauce)',
    shortDescription: 'The crown jewel of Bengali cuisine — hilsa fish steamed in pungent mustard paste.',
    fullDescription:
      'Shorshe Ilish is synonymous with Bengali identity. The prized hilsa fish is marinated in a bold paste of yellow and black mustard, green chilies, and mustard oil, then slow-steamed until the fish absorbs every nuance of flavor. This dish is served during monsoon season when hilsa is at its finest.',
    ingredients: [
      { name: 'Hilsa fish steaks', quantity: '500g' },
      { name: 'Yellow mustard seeds', quantity: '3 tbsp' },
      { name: 'Black mustard seeds', quantity: '1 tbsp' },
      { name: 'Green chilies', quantity: '5' },
      { name: 'Turmeric', quantity: '1 tsp' },
      { name: 'Mustard oil', quantity: '4 tbsp' },
      { name: 'Salt', quantity: 'to taste' },
    ],
    steps: [
      'Grind yellow and black mustard seeds with green chilies and a little water into a smooth paste.',
      'Marinate hilsa with turmeric, salt, mustard paste, and mustard oil for 20 minutes.',
      'Place marinated fish in a flat pan, add 2 tbsp mustard oil on top.',
      'Steam on low heat with lid tightly on for 12–15 minutes.',
      'Serve piping hot with steamed rice.',
    ],
    cuisineType: 'Bengali',
    dietType: 'non-veg' as const,
    cookTime: 30,
    difficulty: 'medium' as const,
    images: ['https://images.unsplash.com/photo-1567364432-88a4a0f5e9be?w=800'],
  },
  {
    title: 'Aloo Posto (Potatoes in Poppy Seed Paste)',
    shortDescription: 'Silky potatoes coated in nutty white poppy seed paste — a Bengali soul food.',
    fullDescription:
      'Aloo Posto is one of the most comforting dishes in Bengali cuisine. Cubed potatoes are gently cooked in a creamy white poppy seed (posto) paste with green chilies and mustard oil. The posto gives it a distinct nutty, earthy richness unlike anything else in Indian cooking.',
    ingredients: [
      { name: 'Potatoes', quantity: '3 medium, cubed' },
      { name: 'White poppy seeds (posto)', quantity: '4 tbsp' },
      { name: 'Green chilies', quantity: '3' },
      { name: 'Mustard oil', quantity: '3 tbsp' },
      { name: 'Nigella seeds (kalonji)', quantity: '½ tsp' },
      { name: 'Salt', quantity: 'to taste' },
    ],
    steps: [
      'Soak poppy seeds in water for 30 minutes, then grind with green chilies into a fine paste.',
      'Heat mustard oil, add nigella seeds and let them splutter.',
      'Add cubed potatoes and fry until lightly golden.',
      'Add poppy seed paste, mix well, and cook on low heat.',
      'Add ¼ cup water, cover and cook until potatoes are tender.',
      'Finish with a drizzle of raw mustard oil before serving.',
    ],
    cuisineType: 'Bengali',
    dietType: 'vegan' as const,
    cookTime: 35,
    difficulty: 'easy' as const,
    images: ['https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800'],
  },
  {
    title: 'Chingri Malai Curry (Prawn Coconut Milk Curry)',
    shortDescription: 'Jumbo prawns simmered in a velvety, mildly spiced coconut milk gravy.',
    fullDescription:
      'Chingri Malai Curry is a festive Bengali prawn dish where large prawns are cooked in fragrant coconut milk with cardamom, cinnamon, and a touch of saffron. The "malai" refers not to cream but to coconut milk, giving this curry a gentle sweetness and a silky texture.',
    ingredients: [
      { name: 'Tiger prawns', quantity: '500g, deveined' },
      { name: 'Coconut milk', quantity: '400ml' },
      { name: 'Onion', quantity: '2 medium' },
      { name: 'Ginger paste', quantity: '1 tbsp' },
      { name: 'Green cardamom', quantity: '4' },
      { name: 'Cinnamon stick', quantity: '1 inch' },
      { name: 'Green chilies', quantity: '3' },
      { name: 'Ghee', quantity: '2 tbsp' },
      { name: 'Salt and sugar', quantity: 'to taste' },
    ],
    steps: [
      'Marinate prawns with turmeric and salt for 15 minutes.',
      'Lightly fry marinated prawns and set aside.',
      'In the same pan, heat ghee. Add cardamom, cinnamon, then sliced onions.',
      'Cook onions until golden, add ginger paste and cook 2 minutes.',
      'Pour in coconut milk, add green chilies and bring to a gentle simmer.',
      'Add fried prawns, season with salt and a pinch of sugar.',
      'Simmer for 5 minutes until sauce thickens slightly. Serve with rice.',
    ],
    cuisineType: 'Bengali',
    dietType: 'non-veg' as const,
    cookTime: 40,
    difficulty: 'medium' as const,
    images: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'],
  },
  {
    title: 'Mishti Doi (Sweet Yogurt)',
    shortDescription: 'Baked sweetened yogurt with caramelized sugar — Bengali dessert royalty.',
    fullDescription:
      'Mishti Doi is the pride of Bengali sweet shops. Full-fat milk is reduced and sweetened with caramelized sugar (giving it a distinctive brown hue), then fermented overnight. The result is a thick, creamy yogurt with a subtly smoky sweetness. Traditionally set in earthenware pots.',
    ingredients: [
      { name: 'Full-fat milk', quantity: '1 liter' },
      { name: 'Sugar', quantity: '150g' },
      { name: 'Yogurt starter (plain curd)', quantity: '2 tbsp' },
      { name: 'Condensed milk', quantity: '50ml' },
    ],
    steps: [
      'Boil milk until reduced to ¾ of original volume. Let it cool to lukewarm.',
      'In a pan, caramelize 100g of sugar until dark amber. Add 3 tbsp hot milk carefully.',
      'Mix caramel into the warm milk along with remaining sugar and condensed milk.',
      'When cooled to body temperature, whisk in yogurt starter.',
      'Pour into clay pots or ramekins. Wrap in a warm cloth.',
      'Set in a warm place (or low oven at 40°C) for 8–10 hours.',
      'Refrigerate for at least 2 hours before serving.',
    ],
    cuisineType: 'Bengali',
    dietType: 'veg' as const,
    cookTime: 60,
    difficulty: 'medium' as const,
    images: ['https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800'],
  },
  {
    title: 'Chicken Rezala',
    shortDescription: 'A Mughal-Bengali classic: chicken in white poppy seed and yogurt gravy.',
    fullDescription:
      'Chicken Rezala is a legacy of Mughal influence on Bengali cuisine. Unlike most curries, it has a pale white gravy made from yogurt, white poppy seed paste, cashews, and fragrant spices. Mildly spiced yet deeply aromatic, it is a centerpiece at Bengali weddings and celebrations.',
    ingredients: [
      { name: 'Chicken pieces', quantity: '1 kg' },
      { name: 'Yogurt', quantity: '250ml' },
      { name: 'White poppy seeds', quantity: '3 tbsp' },
      { name: 'Cashews', quantity: '15' },
      { name: 'White pepper', quantity: '1 tsp' },
      { name: 'Green cardamom', quantity: '5' },
      { name: 'Ghee', quantity: '4 tbsp' },
      { name: 'Onion paste', quantity: '3 tbsp' },
      { name: 'Ginger paste', quantity: '1 tbsp' },
    ],
    steps: [
      'Soak poppy seeds and cashews, grind to a smooth paste.',
      'Marinate chicken with yogurt, onion paste, ginger paste, and white pepper for 1 hour.',
      'Heat ghee in a heavy pan. Add whole spices until fragrant.',
      'Add marinated chicken and cook on medium heat.',
      'Add poppy seed-cashew paste and ½ cup warm water.',
      'Simmer covered for 25–30 minutes until chicken is tender.',
      'Finish with a swirl of ghee. Serve with tandoori roti.',
    ],
    cuisineType: 'Bengali',
    dietType: 'non-veg' as const,
    cookTime: 60,
    difficulty: 'hard' as const,
    images: ['https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800'],
  },
  {
    title: 'Dal Bhuna (Spiced Lentils)',
    shortDescription: 'Dry-roasted, intensely spiced lentils — a comforting Bengali staple.',
    fullDescription:
      'Dal Bhuna is lentils taken to a higher calling. Cooked masoor dal is dry-fried with a tempering of cumin, dried chilies, and caramelized onions until it becomes thick and fragrant. Unlike watery dals, bhuna means the moisture is cooked away leaving a concentrated, sticky finish.',
    ingredients: [
      { name: 'Red lentils (masoor)', quantity: '1 cup' },
      { name: 'Onion', quantity: '2 medium, thinly sliced' },
      { name: 'Cumin seeds', quantity: '1 tsp' },
      { name: 'Dried red chilies', quantity: '3' },
      { name: 'Turmeric', quantity: '½ tsp' },
      { name: 'Garlic', quantity: '4 cloves' },
      { name: 'Mustard oil', quantity: '3 tbsp' },
      { name: 'Fresh cilantro', quantity: 'handful' },
    ],
    steps: [
      'Boil lentils with turmeric and salt until soft. Set aside.',
      'Heat mustard oil until smoking, then lower to medium.',
      'Fry onions until deep golden brown and caramelized.',
      'Add garlic, dried chilies, and cumin seeds. Fry 1 minute.',
      'Add cooked lentils and cook on high heat, stirring constantly.',
      'Cook until dal is thick and moisture evaporates. Garnish with cilantro.',
    ],
    cuisineType: 'Bengali',
    dietType: 'vegan' as const,
    cookTime: 40,
    difficulty: 'easy' as const,
    images: ['https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=800'],
  },
  {
    title: 'Begun Bhaja (Crispy Spiced Eggplant)',
    shortDescription: 'Golden-fried eggplant slices rubbed with bold spices — irresistible Bengali side.',
    fullDescription:
      'Begun Bhaja is the Bengali art of transforming humble eggplant into something magical. Thick rounds are marinated in turmeric, red chili, cumin, and a touch of sugar, then shallow-fried in mustard oil to a crisp, caramelized exterior with a melt-in-your-mouth center.',
    ingredients: [
      { name: 'Large eggplant', quantity: '1, sliced into ½-inch rounds' },
      { name: 'Turmeric', quantity: '1 tsp' },
      { name: 'Red chili powder', quantity: '1 tsp' },
      { name: 'Cumin powder', quantity: '½ tsp' },
      { name: 'Sugar', quantity: '1 tsp' },
      { name: 'Mustard oil', quantity: '4 tbsp' },
      { name: 'Salt', quantity: 'to taste' },
    ],
    steps: [
      'Score each eggplant slice lightly with a knife.',
      'Mix all spices with salt and sugar. Rub both sides of each slice.',
      'Marinate for 15 minutes.',
      'Heat mustard oil in a heavy skillet over medium-high heat.',
      'Fry eggplant slices for 3–4 minutes per side until deeply golden.',
      'Drain on paper towels. Serve hot as a side with rice.',
    ],
    cuisineType: 'Bengali',
    dietType: 'vegan' as const,
    cookTime: 25,
    difficulty: 'easy' as const,
    images: ['https://images.unsplash.com/photo-1601315379734-425a2b05b567?w=800'],
  },

  // ── INDIAN (7) ──────────────────────────────────────────────────────────────
  {
    title: 'Chicken Biryani',
    shortDescription: 'Fragrant basmati rice layered with spiced chicken — India\'s most celebrated dish.',
    fullDescription:
      'Biryani is India\'s culinary masterpiece — an aromatic, layered rice dish where marinated chicken and par-cooked basmati rice are sealed together and slow-cooked (dum). Saffron-infused milk, crispy fried onions, and fresh mint create a dish of extraordinary complexity.',
    ingredients: [
      { name: 'Chicken', quantity: '1 kg, cut into pieces' },
      { name: 'Basmati rice', quantity: '2 cups' },
      { name: 'Yogurt', quantity: '200ml' },
      { name: 'Saffron', quantity: '¼ tsp in 3 tbsp warm milk' },
      { name: 'Fried onions (birista)', quantity: '1 cup' },
      { name: 'Whole spices (bay, cardamom, cloves, cinnamon)', quantity: 'to taste' },
      { name: 'Biryani masala', quantity: '2 tbsp' },
      { name: 'Ghee', quantity: '3 tbsp' },
      { name: 'Fresh mint and cilantro', quantity: 'generous handful' },
    ],
    steps: [
      'Marinate chicken with yogurt, biryani masala, half the fried onions, and salt. Rest 2 hours.',
      'Parboil rice with whole spices until 70% cooked. Drain.',
      'In a heavy pot, layer marinated chicken at the bottom.',
      'Layer par-cooked rice on top. Add saffron milk, remaining fried onions, mint, ghee.',
      'Seal the pot tightly with foil and a lid.',
      'Cook on high for 5 minutes, then very low for 25 minutes (dum).',
      'Open table-side for dramatic effect. Serve with raita.',
    ],
    cuisineType: 'Indian',
    dietType: 'non-veg' as const,
    cookTime: 90,
    difficulty: 'hard' as const,
    images: ['https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800'],
  },
  {
    title: 'Palak Paneer',
    shortDescription: 'Creamy pureed spinach with golden-fried paneer cubes — vegetarian perfection.',
    fullDescription:
      'Palak Paneer is the beloved classic of Indian vegetarian cooking. Fresh spinach is blanched and blended into a vibrant green puree, then enriched with cream and tomatoes. Cubes of fried paneer soak up the luscious sauce making every bite rich and satisfying.',
    ingredients: [
      { name: 'Fresh spinach', quantity: '500g' },
      { name: 'Paneer', quantity: '250g, cubed' },
      { name: 'Onion', quantity: '2 large' },
      { name: 'Tomatoes', quantity: '2' },
      { name: 'Garlic-ginger paste', quantity: '2 tbsp' },
      { name: 'Heavy cream', quantity: '4 tbsp' },
      { name: 'Cumin seeds', quantity: '1 tsp' },
      { name: 'Garam masala', quantity: '1 tsp' },
      { name: 'Oil', quantity: '3 tbsp' },
    ],
    steps: [
      'Blanch spinach in boiling water for 2 minutes, then shock in ice water. Blend smooth.',
      'Fry paneer cubes until golden on all sides. Set aside.',
      'Sauté cumin, onions until golden. Add garlic-ginger paste and tomatoes.',
      'Cook until oil separates. Add spices.',
      'Add spinach puree and simmer for 5 minutes.',
      'Add paneer, stir in cream. Simmer 3 minutes.',
      'Finish with a drizzle of cream and garam masala.',
    ],
    cuisineType: 'Indian',
    dietType: 'veg' as const,
    cookTime: 35,
    difficulty: 'medium' as const,
    images: ['https://images.unsplash.com/photo-1645177628172-a94c1f96debb?w=800'],
  },
  {
    title: 'Butter Chicken (Murgh Makhani)',
    shortDescription: 'Tandoor-kissed chicken in a velvety tomato-butter sauce — India\'s global ambassador.',
    fullDescription:
      'Murgh Makhani was invented by accident at Delhi\'s Moti Mahal restaurant in the 1950s — leftover tandoori chicken tossed in a rich tomato-butter gravy. Today it\'s India\'s most exported dish. The key is the silky, mildly spiced sauce that balances tang, richness, and warmth.',
    ingredients: [
      { name: 'Chicken thighs', quantity: '600g' },
      { name: 'Tomatoes', quantity: '5 large' },
      { name: 'Cashews', quantity: '20' },
      { name: 'Butter', quantity: '4 tbsp' },
      { name: 'Heavy cream', quantity: '100ml' },
      { name: 'Kashmiri red chili powder', quantity: '2 tsp' },
      { name: 'Garam masala', quantity: '1 tsp' },
      { name: 'Honey', quantity: '1 tsp' },
      { name: 'Ginger-garlic paste', quantity: '2 tbsp' },
    ],
    steps: [
      'Marinate chicken with yogurt, Kashmiri chili, and ginger-garlic paste for 2 hours.',
      'Grill or broil until charred edges form. Set aside.',
      'Blend tomatoes and cashews into a smooth puree.',
      'Melt butter, sauté ginger-garlic paste, add tomato-cashew puree.',
      'Simmer 20 minutes until deeply reduced and oil floats on top.',
      'Add grilled chicken, cream, honey, and garam masala.',
      'Simmer 10 minutes. Serve with garlic naan.',
    ],
    cuisineType: 'Indian',
    dietType: 'non-veg' as const,
    cookTime: 50,
    difficulty: 'medium' as const,
    images: ['https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800'],
  },
  {
    title: 'Dal Tadka',
    shortDescription: 'Yellow lentils bloomed with a sizzling tadka of cumin, garlic, and chilies.',
    fullDescription:
      'Dal Tadka is the soul of Indian home cooking. Yellow lentils cooked to a creamy consistency are elevated by a hot tadka — a finishing tempering of cumin seeds, garlic, and dried chilies in ghee poured over the top. This ritual sizzle awakens the whole dish.',
    ingredients: [
      { name: 'Yellow lentils (toor dal)', quantity: '1 cup' },
      { name: 'Tomatoes', quantity: '2, chopped' },
      { name: 'Onion', quantity: '1 large' },
      { name: 'Garlic', quantity: '6 cloves' },
      { name: 'Ginger', quantity: '1 inch' },
      { name: 'Cumin seeds', quantity: '1 tsp' },
      { name: 'Dried red chilies', quantity: '2' },
      { name: 'Turmeric', quantity: '½ tsp' },
      { name: 'Ghee', quantity: '3 tbsp' },
    ],
    steps: [
      'Pressure cook lentils with turmeric and water until completely soft.',
      'Sauté onions, garlic, ginger, and tomatoes until masala is cooked.',
      'Mix into lentils and simmer together for 10 minutes. Adjust consistency.',
      'In a small pan, heat ghee until very hot.',
      'Add cumin seeds, dried chilies, and sliced garlic. Sizzle 30 seconds.',
      'Pour hot tadka directly over the dal. Cover for 1 minute.',
      'Stir and serve with rice or roti.',
    ],
    cuisineType: 'Indian',
    dietType: 'vegan' as const,
    cookTime: 40,
    difficulty: 'easy' as const,
    images: ['https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=800'],
  },
  {
    title: 'Chole Bhature',
    shortDescription: 'Spiced chickpeas with puffy deep-fried bread — Punjab\'s iconic street food.',
    fullDescription:
      'Chole Bhature is the king of North Indian street food. Plump chickpeas are cooked in a deeply spiced, tangy gravy made with dried mango powder and pomegranate seeds, served alongside bhatura — crisp, balloon-like deep-fried bread. A meal that needs no cutlery.',
    ingredients: [
      { name: 'Dried chickpeas', quantity: '2 cups, soaked overnight' },
      { name: 'Black tea bags', quantity: '2 (for deep color)' },
      { name: 'Onions', quantity: '3 large' },
      { name: 'Tomatoes', quantity: '3' },
      { name: 'Chole masala', quantity: '3 tbsp' },
      { name: 'Amchur (dry mango powder)', quantity: '1 tsp' },
      { name: 'All-purpose flour', quantity: '2 cups (for bhatura)' },
      { name: 'Yogurt', quantity: '4 tbsp (for bhatura)' },
      { name: 'Oil', quantity: 'for deep frying' },
    ],
    steps: [
      'Pressure cook soaked chickpeas with tea bags and salt until tender.',
      'Sauté onions until dark brown. Add tomatoes and cook until broken down.',
      'Add chole masala, amchur, and 1 cup cooking water. Simmer 15 minutes.',
      'Mash a few chickpeas to thicken gravy. Simmer with chickpeas 10 more minutes.',
      'For bhatura: mix flour, yogurt, salt, and knead to soft dough. Rest 30 minutes.',
      'Roll out and deep fry in hot oil until puffed and golden.',
      'Serve chole and bhatura together with sliced onion and pickle.',
    ],
    cuisineType: 'Indian',
    dietType: 'veg' as const,
    cookTime: 75,
    difficulty: 'hard' as const,
    images: ['https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800'],
  },
  {
    title: 'Masala Chai',
    shortDescription: 'India\'s beloved spiced tea — warming, aromatic, and deeply comforting.',
    fullDescription:
      'Masala Chai is not just a drink in India — it\'s a ritual. Strong Assam tea is simmered with whole spices including cardamom, ginger, cinnamon, and cloves, then sweetened and enriched with milk to create a warm, invigorating brew. Every family has their own secret blend.',
    ingredients: [
      { name: 'Assam tea leaves', quantity: '2 tsp' },
      { name: 'Water', quantity: '1 cup' },
      { name: 'Whole milk', quantity: '1 cup' },
      { name: 'Sugar', quantity: '2 tsp' },
      { name: 'Green cardamom', quantity: '4, bruised' },
      { name: 'Fresh ginger', quantity: '1 inch, sliced' },
      { name: 'Cinnamon stick', quantity: '½ inch' },
      { name: 'Black peppercorns', quantity: '4' },
    ],
    steps: [
      'Combine water, ginger, cardamom, cinnamon, and peppercorns in a saucepan.',
      'Bring to a boil and simmer for 3 minutes to bloom spices.',
      'Add tea leaves and boil 2 minutes.',
      'Pour in milk and bring back to a boil.',
      'Let it boil up once, stir down, repeat twice for rich flavor.',
      'Add sugar, strain through a fine mesh into cups.',
      'Serve piping hot with biscuits.',
    ],
    cuisineType: 'Indian',
    dietType: 'veg' as const,
    cookTime: 15,
    difficulty: 'easy' as const,
    images: ['https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800'],
  },
  {
    title: 'Gulab Jamun',
    shortDescription: 'Soft milk-solid dumplings soaked in rose cardamom syrup — pure Indian joy.',
    fullDescription:
      'Gulab Jamun is India\'s most beloved dessert. Soft, melt-in-your-mouth dumplings made from khoya (reduced milk solids) are deep-fried to a deep brown and soaked in a fragrant sugar syrup laced with rose water and cardamom. Served warm or cold, they are celebration personified.',
    ingredients: [
      { name: 'Khoya (milk solids)', quantity: '200g' },
      { name: 'All-purpose flour', quantity: '3 tbsp' },
      { name: 'Baking soda', quantity: '¼ tsp' },
      { name: 'Milk', quantity: '2 tbsp (for kneading)' },
      { name: 'Sugar', quantity: '2 cups (for syrup)' },
      { name: 'Water', quantity: '1.5 cups (for syrup)' },
      { name: 'Rose water', quantity: '2 tsp' },
      { name: 'Green cardamom powder', quantity: '½ tsp' },
      { name: 'Oil', quantity: 'for deep frying' },
    ],
    steps: [
      'Make syrup: dissolve sugar in water, add rose water and cardamom. Simmer 5 minutes.',
      'Grate khoya and mix with flour and baking soda.',
      'Add milk gradually to form a soft, non-sticky dough.',
      'Roll into smooth balls (no cracks).',
      'Fry in medium-low oil, stirring constantly, until deep brown.',
      'Drop hot jamuns into warm syrup immediately.',
      'Soak for at least 30 minutes. Serve warm.',
    ],
    cuisineType: 'Indian',
    dietType: 'veg' as const,
    cookTime: 50,
    difficulty: 'hard' as const,
    images: ['https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800'],
  },

  // ── CHINESE (5) ─────────────────────────────────────────────────────────────
  {
    title: 'Kung Pao Chicken',
    shortDescription: 'Tender chicken with peanuts and dried chilies in a fiery, tangy sauce.',
    fullDescription:
      'Kung Pao Chicken is a Sichuan classic that balances heat, sweetness, and tartness in perfect harmony. Wok-tossed chicken, crunchy peanuts, and Sichuan dried chilies are glazed in a savory, slightly sweet sauce. The hallmark numbing heat comes from Sichuan peppercorns.',
    ingredients: [
      { name: 'Chicken breast', quantity: '400g, diced' },
      { name: 'Dried Sichuan chilies', quantity: '8' },
      { name: 'Roasted peanuts', quantity: '½ cup' },
      { name: 'Sichuan peppercorns', quantity: '1 tsp' },
      { name: 'Soy sauce', quantity: '3 tbsp' },
      { name: 'Rice vinegar', quantity: '2 tbsp' },
      { name: 'Sugar', quantity: '1 tbsp' },
      { name: 'Garlic and ginger', quantity: '3 cloves each, minced' },
      { name: 'Cornstarch', quantity: '2 tbsp' },
    ],
    steps: [
      'Marinate chicken with soy sauce, cornstarch, and Shaoxing wine for 15 minutes.',
      'Mix sauce: soy sauce, rice vinegar, sugar, and cornstarch slurry.',
      'Heat wok until smoking. Stir-fry chilies and Sichuan peppercorns 30 seconds.',
      'Add chicken and stir-fry until cooked through.',
      'Add garlic and ginger, then pour in sauce.',
      'Toss until sauce thickens and coats everything.',
      'Add peanuts, toss, and serve immediately with steamed rice.',
    ],
    cuisineType: 'Chinese',
    dietType: 'non-veg' as const,
    cookTime: 25,
    difficulty: 'medium' as const,
    images: ['https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800'],
  },
  {
    title: 'Egg Fried Rice',
    shortDescription: 'Wok-charred rice with scrambled eggs and vegetables — Chinese takeout perfection.',
    fullDescription:
      'Egg Fried Rice is the cornerstone of Chinese home cooking and takeout culture. The secret is day-old rice (less moisture) and a searingly hot wok to achieve that coveted "wok hei" — the smoky, charred flavor that defines authentic Chinese fried rice.',
    ingredients: [
      { name: 'Day-old cooked rice', quantity: '3 cups' },
      { name: 'Eggs', quantity: '3' },
      { name: 'Green onions', quantity: '4, sliced' },
      { name: 'Frozen peas and carrots', quantity: '1 cup' },
      { name: 'Soy sauce', quantity: '3 tbsp' },
      { name: 'Sesame oil', quantity: '1 tsp' },
      { name: 'Oyster sauce', quantity: '1 tbsp' },
      { name: 'Oil', quantity: '3 tbsp' },
      { name: 'White pepper', quantity: '¼ tsp' },
    ],
    steps: [
      'Break up cold rice with hands to separate grains.',
      'Heat wok until smoking. Add oil.',
      'Scramble eggs in wok, break into small pieces. Push to side.',
      'Add vegetables, stir-fry 2 minutes.',
      'Add rice, spreading across wok. Let it sit for 30 seconds to char.',
      'Toss everything together. Add soy sauce, oyster sauce, white pepper.',
      'Finish with sesame oil and green onions.',
    ],
    cuisineType: 'Chinese',
    dietType: 'veg' as const,
    cookTime: 20,
    difficulty: 'easy' as const,
    images: ['https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800'],
  },
  {
    title: 'Mapo Tofu',
    shortDescription: 'Silken tofu in a spicy, numbing Sichuan bean sauce — bold and unforgettable.',
    fullDescription:
      'Mapo Tofu is one of Sichuan cuisine\'s most iconic dishes. Silken tofu cubes are bathed in a fiery, deeply savory sauce made from doubanjiang (fermented bean paste), ground pork, fermented black beans, and Sichuan peppercorns that create the famous "ma la" numbing heat sensation.',
    ingredients: [
      { name: 'Silken tofu', quantity: '400g, cubed' },
      { name: 'Ground pork', quantity: '150g' },
      { name: 'Doubanjiang (chili bean paste)', quantity: '2 tbsp' },
      { name: 'Fermented black beans', quantity: '1 tbsp' },
      { name: 'Chicken stock', quantity: '200ml' },
      { name: 'Sichuan peppercorn powder', quantity: '1 tsp' },
      { name: 'Garlic and ginger', quantity: '4 cloves each' },
      { name: 'Cornstarch slurry', quantity: '1 tbsp cornstarch + 2 tbsp water' },
    ],
    steps: [
      'Blanch tofu in salted boiling water for 2 minutes. Drain carefully.',
      'Stir-fry ground pork until cooked. Add doubanjiang and black beans.',
      'Add garlic and ginger. Fry until fragrant and oil turns red.',
      'Add stock and bring to a simmer.',
      'Gently slide in tofu. Simmer 5 minutes.',
      'Stir in cornstarch slurry to thicken.',
      'Serve topped with green onions and Sichuan peppercorn powder.',
    ],
    cuisineType: 'Chinese',
    dietType: 'non-veg' as const,
    cookTime: 25,
    difficulty: 'medium' as const,
    images: ['https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800'],
  },
  {
    title: 'Hot and Sour Soup',
    shortDescription: 'Silky egg-drop soup with bold vinegary heat — Chinese restaurant opener.',
    fullDescription:
      'Hot and Sour Soup is the warming, tangy starter that begins every great Chinese meal. Chicken stock thickened with cornstarch holds shiitake mushrooms, bamboo shoots, and tofu, finished with a generous splash of rice vinegar and white pepper for its signature acidic punch.',
    ingredients: [
      { name: 'Chicken stock', quantity: '1 liter' },
      { name: 'Shiitake mushrooms', quantity: '6, sliced' },
      { name: 'Bamboo shoots', quantity: '100g, julienned' },
      { name: 'Firm tofu', quantity: '100g, julienned' },
      { name: 'Eggs', quantity: '2, beaten' },
      { name: 'Rice vinegar', quantity: '4 tbsp' },
      { name: 'White pepper', quantity: '1 tsp' },
      { name: 'Soy sauce', quantity: '3 tbsp' },
      { name: 'Cornstarch', quantity: '3 tbsp + water' },
    ],
    steps: [
      'Bring stock to a boil. Add mushrooms, bamboo shoots, and tofu.',
      'Add soy sauce and simmer 5 minutes.',
      'Stir in cornstarch slurry while stirring to thicken.',
      'Slowly drizzle beaten eggs into soup while stirring to create ribbons.',
      'Add rice vinegar and white pepper. Taste and adjust.',
      'Serve immediately with chili oil on the side.',
    ],
    cuisineType: 'Chinese',
    dietType: 'veg' as const,
    cookTime: 20,
    difficulty: 'easy' as const,
    images: ['https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800'],
  },
  {
    title: 'Dim Sum: Har Gow (Shrimp Dumplings)',
    shortDescription: 'Translucent steamed shrimp dumplings — the yardstick of Cantonese dim sum excellence.',
    fullDescription:
      'Har Gow are considered the benchmark of a dim sum chef\'s skill. The wrapper must be thin enough to be translucent yet strong enough not to break. Inside, plump whole shrimp mixed with bamboo shoots provide a juicy, bouncy filling. Every fold must be uniform — traditionally 7–9 pleats.',
    ingredients: [
      { name: 'Wheat starch', quantity: '150g' },
      { name: 'Tapioca starch', quantity: '50g' },
      { name: 'Boiling water', quantity: '200ml' },
      { name: 'Large shrimp', quantity: '300g, peeled and deveined' },
      { name: 'Bamboo shoots', quantity: '60g, finely chopped' },
      { name: 'Sesame oil', quantity: '1 tsp' },
      { name: 'Sugar', quantity: '½ tsp' },
      { name: 'White pepper', quantity: '¼ tsp' },
    ],
    steps: [
      'Combine wheat starch and tapioca starch. Pour boiling water and mix to a dough. Rest 5 minutes.',
      'Chop 2/3 of shrimp finely; leave rest whole. Combine with bamboo shoots, sesame oil, sugar, salt, and pepper.',
      'Knead dough smooth. Divide into marble-sized balls.',
      'Roll into thin circles using a cleaver or rolling pin.',
      'Place filling in center. Pleat the wrapper edge to seal (aim for 7–9 pleats).',
      'Steam over high heat for 7 minutes until translucent.',
      'Serve immediately with soy sauce and chili oil.',
    ],
    cuisineType: 'Chinese',
    dietType: 'non-veg' as const,
    cookTime: 45,
    difficulty: 'hard' as const,
    images: ['https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800'],
  },

  // ── ITALIAN (5) ─────────────────────────────────────────────────────────────
  {
    title: 'Spaghetti Carbonara',
    shortDescription: 'Silky egg-and-pecorino pasta with guanciale — Rome\'s greatest contribution.',
    fullDescription:
      'True Carbonara is a Roman masterpiece of simplicity. No cream, ever. The sauce is an emulsion of eggs, Pecorino Romano, and Parmigiano-Reggiano, tempered by the pasta\'s residual heat. Guanciale (cured pork cheek) adds rich, porky depth. The technique is everything.',
    ingredients: [
      { name: 'Spaghetti', quantity: '400g' },
      { name: 'Guanciale or pancetta', quantity: '150g, cubed' },
      { name: 'Eggs', quantity: '3 whole + 2 yolks' },
      { name: 'Pecorino Romano', quantity: '80g, finely grated' },
      { name: 'Parmigiano-Reggiano', quantity: '40g, finely grated' },
      { name: 'Black pepper', quantity: '2 tsp, freshly cracked' },
      { name: 'Salt', quantity: 'for pasta water' },
    ],
    steps: [
      'Cook guanciale in a dry pan until crispy. Reserve fat.',
      'Whisk eggs, yolks, pecorino, parmesan, and black pepper in a bowl.',
      'Cook spaghetti in well-salted boiling water until al dente.',
      'Reserve 1 cup pasta water before draining.',
      'Add pasta to the pan with guanciale OFF the heat.',
      'Add egg mixture and toss vigorously, adding pasta water to create a creamy sauce.',
      'Serve immediately with extra pepper and cheese.',
    ],
    cuisineType: 'Italian',
    dietType: 'non-veg' as const,
    cookTime: 25,
    difficulty: 'medium' as const,
    images: ['https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800'],
  },
  {
    title: 'Risotto ai Funghi',
    shortDescription: 'Creamy Arborio rice with wild mushrooms — the epitome of Italian comfort.',
    fullDescription:
      'Risotto is the dish that separates the casual cook from the committed one. Arborio rice is coaxed into creaminess through constant stirring and gradual ladle-by-ladle stock addition. Wild mushrooms — porcini, shiitake, cremini — add an earthy, umami-packed depth to this Northern Italian staple.',
    ingredients: [
      { name: 'Arborio rice', quantity: '300g' },
      { name: 'Mixed wild mushrooms', quantity: '400g' },
      { name: 'Dried porcini', quantity: '20g, soaked in 300ml warm water' },
      { name: 'Chicken stock', quantity: '1.2 liters, kept warm' },
      { name: 'White wine', quantity: '150ml' },
      { name: 'Shallots', quantity: '3, finely chopped' },
      { name: 'Parmesan', quantity: '80g, grated' },
      { name: 'Butter', quantity: '50g' },
      { name: 'Fresh thyme', quantity: '4 sprigs' },
    ],
    steps: [
      'Strain porcini liquid through coffee filter. Add to warm stock.',
      'Sauté shallots in butter and olive oil until soft.',
      'Add fresh mushrooms and sauté until golden. Add rehydrated porcini.',
      'Add rice and toast 2 minutes. Pour in wine and stir until absorbed.',
      'Add warm stock one ladle at a time, stirring constantly.',
      'Continue 18–20 minutes until rice is al dente.',
      'Remove from heat. Beat in cold butter and parmesan (mantecatura). Season and serve.',
    ],
    cuisineType: 'Italian',
    dietType: 'veg' as const,
    cookTime: 40,
    difficulty: 'hard' as const,
    images: ['https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800'],
  },
  {
    title: 'Tiramisu',
    shortDescription: 'Espresso-soaked ladyfingers with mascarpone cream — Italy\'s most loved dessert.',
    fullDescription:
      'Tiramisu means "pick me up" in Italian — and it delivers. Crisp ladyfinger biscuits soaked in strong espresso and Marsala wine support a cloud of whipped mascarpone, eggs, and sugar. A generous dusting of cocoa powder makes every slice a caffeinated, creamy dream.',
    ingredients: [
      { name: 'Mascarpone cheese', quantity: '500g' },
      { name: 'Savoiardi (ladyfingers)', quantity: '300g' },
      { name: 'Eggs', quantity: '4, separated' },
      { name: 'Sugar', quantity: '100g' },
      { name: 'Espresso', quantity: '300ml, cooled' },
      { name: 'Marsala wine or Kahlua', quantity: '3 tbsp' },
      { name: 'Cocoa powder', quantity: '3 tbsp, for dusting' },
    ],
    steps: [
      'Whip egg yolks and sugar until pale and thick (ribbon stage).',
      'Fold in mascarpone until smooth.',
      'Whip egg whites to stiff peaks. Fold into mascarpone mixture.',
      'Mix espresso and marsala. Quickly dip ladyfingers (1 second per side).',
      'Arrange soaked ladyfingers in a single layer in a dish.',
      'Spread half the cream on top. Repeat with another layer.',
      'Dust generously with cocoa. Refrigerate at least 6 hours, preferably overnight.',
    ],
    cuisineType: 'Italian',
    dietType: 'veg' as const,
    cookTime: 30,
    difficulty: 'medium' as const,
    images: ['https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800'],
  },
  {
    title: 'Bruschetta al Pomodoro',
    shortDescription: 'Grilled bread rubbed with garlic and topped with fresh tomato — Italian simplicity at its finest.',
    fullDescription:
      'Bruschetta is the Italian reminder that great food needs no complexity. Thick slabs of sourdough are charred on a grill, rubbed while hot with a cut garlic clove, drizzled with peppery olive oil, then topped with ripe Roma tomatoes macerated in basil and sea salt. Perfection in minutes.',
    ingredients: [
      { name: 'Sourdough bread', quantity: '1 loaf, sliced thick' },
      { name: 'Ripe Roma tomatoes', quantity: '6, diced' },
      { name: 'Fresh basil', quantity: '15 leaves' },
      { name: 'Garlic cloves', quantity: '3, halved' },
      { name: 'Extra virgin olive oil', quantity: '4 tbsp' },
      { name: 'Sea salt and black pepper', quantity: 'to taste' },
      { name: 'Balsamic glaze', quantity: '1 tbsp (optional)' },
    ],
    steps: [
      'Dice tomatoes and combine with torn basil, olive oil, salt, and pepper.',
      'Let marinate 15 minutes at room temperature.',
      'Grill bread slices until charred grill marks appear on both sides.',
      'While hot, rub each slice vigorously with cut garlic.',
      'Drizzle with olive oil.',
      'Pile tomato mixture on top.',
      'Drizzle with balsamic glaze and serve immediately.',
    ],
    cuisineType: 'Italian',
    dietType: 'vegan' as const,
    cookTime: 15,
    difficulty: 'easy' as const,
    images: ['https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800'],
  },
  {
    title: 'Penne Arrabbiata',
    shortDescription: 'Penne in a fiery tomato sauce with garlic and chili — angry pasta done right.',
    fullDescription:
      '"Arrabbiata" means "angry" in Italian — a name that perfectly captures this bold, uncompromising pasta. San Marzano tomatoes are cooked with generous amounts of garlic and crushed red pepper flakes into a sauce that is both vibrant and fiery. No cream, no compromise.',
    ingredients: [
      { name: 'Penne rigate', quantity: '400g' },
      { name: 'San Marzano tomatoes', quantity: '400g can' },
      { name: 'Garlic', quantity: '6 cloves, sliced' },
      { name: 'Red pepper flakes', quantity: '2 tsp (or to taste)' },
      { name: 'Extra virgin olive oil', quantity: '4 tbsp' },
      { name: 'Fresh parsley', quantity: 'handful' },
      { name: 'Salt', quantity: 'to taste' },
    ],
    steps: [
      'Heat olive oil over medium. Add garlic and chili flakes.',
      'Cook until garlic is golden (not brown).',
      'Add crushed tomatoes. Season with salt.',
      'Simmer 15 minutes until sauce thickens.',
      'Cook penne in well-salted water until al dente.',
      'Toss pasta in sauce with a splash of pasta water.',
      'Finish with fresh parsley and a drizzle of raw olive oil.',
    ],
    cuisineType: 'Italian',
    dietType: 'vegan' as const,
    cookTime: 25,
    difficulty: 'easy' as const,
    images: ['https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=800'],
  },

  // ── CONTINENTAL (4) ─────────────────────────────────────────────────────────
  {
    title: 'Beef Bourguignon',
    shortDescription: 'French braised beef with red wine, lardons, and mushrooms — soul-warming perfection.',
    fullDescription:
      'Beef Bourguignon is Julia Child\'s gift to the world — a slow-braised French beef stew from Burgundy. Tough beef is transformed by hours of gentle cooking in red wine with pearl onions, lardons, and mushrooms into meltingly tender morsels in a deeply savory, glossy sauce.',
    ingredients: [
      { name: 'Beef chuck', quantity: '1.5 kg, cubed' },
      { name: 'Burgundy red wine', quantity: '750ml (1 bottle)' },
      { name: 'Beef stock', quantity: '500ml' },
      { name: 'Lardons/bacon', quantity: '200g' },
      { name: 'Pearl onions', quantity: '200g' },
      { name: 'Button mushrooms', quantity: '300g' },
      { name: 'Carrots', quantity: '3, chunked' },
      { name: 'Flour', quantity: '2 tbsp' },
      { name: 'Bouquet garni (bay, thyme, parsley)', quantity: '1' },
    ],
    steps: [
      'Pat beef dry, season. Brown in batches in a heavy Dutch oven. Set aside.',
      'Fry lardons until crispy. Sauté carrots and pearl onions briefly.',
      'Return beef. Dust with flour and toss to coat.',
      'Pour wine and stock over. Add bouquet garni. Bring to a simmer.',
      'Cover and braise in 160°C oven for 2.5–3 hours.',
      'In the last 30 minutes, sauté mushrooms in butter. Add to stew.',
      'Discard bouquet garni. Adjust seasoning. Serve with crusty bread or mashed potato.',
    ],
    cuisineType: 'Continental',
    dietType: 'non-veg' as const,
    cookTime: 180,
    difficulty: 'hard' as const,
    images: ['https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800'],
  },
  {
    title: 'Classic Caesar Salad',
    shortDescription: 'Crisp romaine, garlic croutons, and umami-rich Caesar dressing — a timeless classic.',
    fullDescription:
      'The Caesar Salad was invented by Caesar Cardini in Tijuana, Mexico in 1924 — and the world has never been the same. Crisp romaine leaves are coated in an anchovy-forward, lemony, Worcestershire-spiked dressing, then showered with parmesan shavings and garlic croutons.',
    ingredients: [
      { name: 'Romaine lettuce', quantity: '2 heads, torn' },
      { name: 'Parmesan', quantity: '80g, shaved and grated' },
      { name: 'Sourdough bread', quantity: '4 thick slices, cubed' },
      { name: 'Anchovies', quantity: '4 fillets' },
      { name: 'Garlic', quantity: '2 cloves' },
      { name: 'Egg yolk', quantity: '1' },
      { name: 'Lemon juice', quantity: '2 tbsp' },
      { name: 'Worcestershire sauce', quantity: '1 tsp' },
      { name: 'Dijon mustard', quantity: '1 tsp' },
      { name: 'Olive oil', quantity: '6 tbsp' },
    ],
    steps: [
      'Make croutons: toss bread with olive oil and garlic. Bake at 190°C until golden.',
      'Pound anchovies and garlic to a paste.',
      'Whisk egg yolk, lemon, Worcestershire, and mustard.',
      'Slowly drizzle in olive oil while whisking to emulsify.',
      'Stir in anchovy-garlic paste and grated parmesan.',
      'Toss romaine in dressing until well coated.',
      'Top with croutons and shaved parmesan.',
    ],
    cuisineType: 'Continental',
    dietType: 'non-veg' as const,
    cookTime: 20,
    difficulty: 'easy' as const,
    images: ['https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800'],
  },
  {
    title: 'Cream of Mushroom Soup',
    shortDescription: 'Velvety, herb-scented mushroom bisque — the ultimate starter for any dinner party.',
    fullDescription:
      'This is the cream of mushroom soup that makes the canned version feel like a crime. A base of deeply sautéed mushrooms and shallots is pureed with vegetable stock and enriched with heavy cream, then finished with fresh thyme and a swirl of truffle oil for an elegant bowl.',
    ingredients: [
      { name: 'Mixed mushrooms (cremini, shiitake)', quantity: '600g' },
      { name: 'Shallots', quantity: '4, sliced' },
      { name: 'Garlic', quantity: '4 cloves' },
      { name: 'Vegetable stock', quantity: '700ml' },
      { name: 'Heavy cream', quantity: '150ml' },
      { name: 'Butter', quantity: '3 tbsp' },
      { name: 'Fresh thyme', quantity: '6 sprigs' },
      { name: 'Truffle oil', quantity: '1 tsp (optional)' },
      { name: 'Dry sherry', quantity: '3 tbsp' },
    ],
    steps: [
      'Sauté shallots and garlic in butter until soft.',
      'Add mushrooms and thyme. Cook on high heat until golden and moisture evaporates.',
      'Add sherry and cook 1 minute.',
      'Pour in stock. Simmer 15 minutes.',
      'Blend until completely smooth.',
      'Return to pan, stir in cream, and season.',
      'Serve with truffle oil drizzle and sautéed mushroom slices.',
    ],
    cuisineType: 'Continental',
    dietType: 'veg' as const,
    cookTime: 35,
    difficulty: 'easy' as const,
    images: ['https://images.unsplash.com/photo-1547592180-85f173990554?w=800'],
  },
  {
    title: 'Eggs Benedict',
    shortDescription: 'Poached eggs on Canadian bacon and English muffins with silky hollandaise.',
    fullDescription:
      'Eggs Benedict is the crown jewel of brunch menus worldwide. A toasted English muffin is layered with Canadian bacon and a perfectly poached egg, then draped in hollandaise sauce — a warm butter emulsion that is both rich and lemony. Achieving the perfect hollandaise is a life skill worth mastering.',
    ingredients: [
      { name: 'Eggs', quantity: '4 large' },
      { name: 'Canadian bacon', quantity: '4 slices' },
      { name: 'English muffins', quantity: '2, split and toasted' },
      { name: 'Egg yolks', quantity: '3 (for hollandaise)' },
      { name: 'Unsalted butter', quantity: '200g, clarified' },
      { name: 'Lemon juice', quantity: '1 tbsp' },
      { name: 'White vinegar', quantity: '1 tbsp (for poaching)' },
      { name: 'Cayenne pepper', quantity: 'pinch' },
    ],
    steps: [
      'Make hollandaise: Whisk yolks over a double boiler until thick. Slowly stream in clarified butter.',
      'Add lemon juice and cayenne. Keep warm.',
      'Heat bacon slices until warm. Toast English muffins.',
      'Bring a pan of water to gentle simmer with vinegar.',
      'Poach eggs for 3 minutes.',
      'Assemble: muffin → bacon → poached egg → hollandaise.',
      'Dust with paprika and serve immediately.',
    ],
    cuisineType: 'Continental',
    dietType: 'non-veg' as const,
    cookTime: 30,
    difficulty: 'hard' as const,
    images: ['https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800'],
  },
];

// ─── Review comments pool ─────────────────────────────────────────────────────
const REVIEW_COMMENTS = [
  'Absolutely incredible! This recipe is exactly what I was looking for.',
  'Made this for my family — everyone went back for seconds!',
  'The flavors are so authentic and well-balanced.',
  'Simple to follow and the result is restaurant quality.',
  'I have been making this for years and this is the best recipe.',
  'The tips and steps were clear and the dish turned out perfect.',
  'Outstanding! Will definitely add this to my weekly rotation.',
  'Took me back to my childhood. Authentic and delicious.',
];

async function seed(): Promise<void> {
  await connectDB();
  console.log('\n🌱 Starting full database seed...\n');

  // ── Wipe existing data ────────────────────────────────────────────────────
  await Promise.all([User.deleteMany({}), Recipe.deleteMany({}), Review.deleteMany({})]);
  console.log('🗑️  Cleared existing data');

  // ── Create users ─────────────────────────────────────────────────────────
  const createdUsers = await Promise.all(USERS.map((u) => User.create(u)));
  const [demoUser, adminUser, rinaUser] = createdUsers;
  console.log(`👥 Created ${createdUsers.length} users`);
  console.log(`   demo@pantrypilot.com / Demo@1234`);
  console.log(`   admin@pantrypilot.com / Admin@1234`);
  console.log(`   rina@pantrypilot.com / Rina@1234`);

  // ── Create recipes (rotate authorship) ───────────────────────────────────
  const authors = [demoUser, demoUser, rinaUser, demoUser, rinaUser, demoUser, demoUser];
  const createdRecipes = await Promise.all(
    RECIPES.map((recipe, i) =>
      Recipe.create({
        ...recipe,
        authorId: authors[i % authors.length]._id,
      })
    )
  );
  console.log(`🍽️  Created ${createdRecipes.length} recipes across 5 cuisines`);

  // ── Create 2 reviews per recipe ──────────────────────────────────────────
  const ratings = [5, 4, 5, 5, 4, 5, 4, 5, 4, 5, 5, 4, 5, 4];
  let reviewCount = 0;

  for (const [i, recipe] of createdRecipes.entries()) {
    const r1 = ratings[i % ratings.length];
    const r2 = ratings[(i + 1) % ratings.length];
    const comment1 = REVIEW_COMMENTS[i % REVIEW_COMMENTS.length];
    const comment2 = REVIEW_COMMENTS[(i + 3) % REVIEW_COMMENTS.length];

    await Review.create({ recipeId: recipe._id, userId: adminUser._id, rating: r1, comment: comment1 });
    await Review.create({ recipeId: recipe._id, userId: rinaUser._id, rating: r2, comment: comment2 });
    reviewCount += 2;
  }
  console.log(`⭐ Created ${reviewCount} reviews (2 per recipe)`);

  // ── Summary ───────────────────────────────────────────────────────────────
  const cuisineCounts = RECIPES.reduce<Record<string, number>>((acc, r) => {
    acc[r.cuisineType] = (acc[r.cuisineType] || 0) + 1;
    return acc;
  }, {});

  console.log('\n📊 Breakdown by cuisine:');
  Object.entries(cuisineCounts).forEach(([c, count]) => {
    console.log(`   ${c.padEnd(15)} → ${count} recipes`);
  });

  console.log('\n✅ Database seeded successfully!');
  console.log('─'.repeat(45));
  console.log('Demo User   → demo@pantrypilot.com / Demo@1234');
  console.log('Admin User  → admin@pantrypilot.com / Admin@1234');
  console.log('Rina User   → rina@pantrypilot.com / Rina@1234');
  console.log('─'.repeat(45));

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
