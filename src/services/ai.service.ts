import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../config/constants';
import { IRecipe } from '../types';

// ─── Client ──────────────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const getModel = () =>
  genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    ],
  });

// ─── Types ────────────────────────────────────────────────────────────────────
export interface RecipeSuggestion {
  recipeId: string;
  title: string;
  matchScore: number;
  reasoning: string;
  missingIngredients: string[];
  canMakeWith: string[];
}

export interface GeneratedDescription {
  shortDescription: string;
  fullDescription: string;
  nutritionSummary: string;
  cookingTips: string[];
}

// ─── 1. Suggest Recipes ───────────────────────────────────────────────────────
export const suggestRecipes = async (
  userIngredients: string[],
  dbRecipes: IRecipe[]
): Promise<RecipeSuggestion[]> => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file.');
  }

  const model = getModel();

  // Prepare recipe summaries for Gemini context (avoid sending full objects)
  const recipeSummaries = dbRecipes.slice(0, 20).map((r) => ({
    id: r._id?.toString(),
    title: r.title,
    dietType: r.dietType,
    cuisineType: r.cuisineType,
    ingredients: r.ingredients.map((i) => i.name.toLowerCase()),
    avgRating: r.avgRating,
    difficulty: r.difficulty,
    cookTime: r.cookTime,
  }));

  const prompt = `
You are a smart cooking assistant for PantryPilot, a recipe app. 

The user has these ingredients available:
${userIngredients.map((i) => `- ${i}`).join('\n')}

Here are recipes available in the database (JSON):
${JSON.stringify(recipeSummaries, null, 2)}

Analyze which recipes the user can make (fully or mostly) with their ingredients.
Return EXACTLY the top 3 best matching recipes as a JSON array.
Each item must have:
- "recipeId": the recipe's id string
- "title": recipe title
- "matchScore": integer 0-100 representing how well user's ingredients match
- "reasoning": 1-2 sentence explanation of why this is a good match
- "missingIngredients": array of ingredient names the user is missing
- "canMakeWith": array of user's ingredients that are used in this recipe

Prioritize recipes with higher matchScore (more ingredients available). 
Respond ONLY with a valid JSON array, no markdown, no extra text.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Strip markdown code fences if present
  const cleaned = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();

  try {
    const suggestions = JSON.parse(cleaned) as RecipeSuggestion[];
    return Array.isArray(suggestions) ? suggestions.slice(0, 3) : [];
  } catch {
    throw new Error('Failed to parse AI response. Please try again.');
  }
};

// ─── 2. Generate Recipe Description ──────────────────────────────────────────
export const generateRecipeDescription = async (
  title: string,
  ingredients: string[],
  keySteps: string[],
  length: 'short' | 'medium' | 'long' = 'medium'
): Promise<GeneratedDescription> => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file.');
  }

  const model = getModel();

  const wordCounts = { short: '50-80', medium: '100-150', long: '200-250' };
  const targetWords = wordCounts[length];

  const prompt = `
You are a professional food writer and nutritionist for PantryPilot recipe app.

Generate content for the following recipe:
Title: ${title}
Ingredients: ${ingredients.join(', ')}
Key Steps: ${keySteps.join('; ')}

Provide a JSON response with exactly these fields:
- "shortDescription": A compelling 1-2 sentence teaser (max 200 chars)
- "fullDescription": An engaging description in ${targetWords} words. Include the origin/culture if relevant, what makes it special, and the experience of eating it.
- "nutritionSummary": A brief 1-2 sentence estimate of nutrition highlights (calories, protein, key nutrients). Note this is an estimate.
- "cookingTips": An array of exactly 2 practical, specific cooking tips to get the best results.

Respond ONLY with valid JSON, no markdown, no extra text.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const cleaned = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();

  try {
    return JSON.parse(cleaned) as GeneratedDescription;
  } catch {
    throw new Error('Failed to parse AI response. Please try again.');
  }
};
