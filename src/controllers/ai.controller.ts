import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import * as aiService from '../services/ai.service';
import { getAllRecipes } from '../services/recipe.service';
import { sendSuccess, sendError } from '../utils/response.utils';

// ─── POST /api/ai/suggest-recipes ────────────────────────────────────────────
export const suggestRecipes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, errors.array()[0].msg, 400);
      return;
    }

    const { ingredients } = req.body as { ingredients: string[] };

    // Fetch all recipes from DB to give Gemini context
    const { recipes: dbRecipes } = await getAllRecipes({ limit: 50, page: 1 });

    if (dbRecipes.length === 0) {
      sendError(res, 'No recipes in database to match against.', 404);
      return;
    }

    const suggestions = await aiService.suggestRecipes(ingredients, dbRecipes);

    sendSuccess(res, 'Recipe suggestions generated successfully.', {
      ingredients,
      suggestions,
      totalRecipesAnalyzed: dbRecipes.length,
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/ai/generate-description ───────────────────────────────────────
export const generateDescription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, errors.array()[0].msg, 400);
      return;
    }

    const {
      title,
      ingredients,
      keySteps,
      length = 'medium',
    } = req.body as {
      title: string;
      ingredients: string[];
      keySteps: string[];
      length?: 'short' | 'medium' | 'long';
    };

    const result = await aiService.generateRecipeDescription(
      title,
      ingredients,
      keySteps,
      length
    );

    sendSuccess(res, 'Recipe description generated successfully.', result);
  } catch (error) {
    next(error);
  }
};

// ─── Validation middleware exports ────────────────────────────────────────────
export const suggestRecipesValidation = [
  body('ingredients')
    .isArray({ min: 1 })
    .withMessage('ingredients must be a non-empty array.'),
  body('ingredients.*')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Each ingredient must be a non-empty string.'),
];

export const generateDescriptionValidation = [
  body('title').trim().notEmpty().withMessage('title is required.'),
  body('ingredients')
    .isArray({ min: 1 })
    .withMessage('ingredients must be a non-empty array.'),
  body('keySteps')
    .isArray({ min: 1 })
    .withMessage('keySteps must be a non-empty array.'),
  body('length')
    .optional()
    .isIn(['short', 'medium', 'long'])
    .withMessage('length must be short, medium, or long.'),
];
