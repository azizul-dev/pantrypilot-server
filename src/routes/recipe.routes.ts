import { Router } from 'express';
import { body } from 'express-validator';
import * as recipeController from '../controllers/recipe.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

const recipeValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required.')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters.'),
  body('shortDescription')
    .trim()
    .notEmpty().withMessage('Short description is required.')
    .isLength({ max: 200 }).withMessage('Short description cannot exceed 200 characters.'),
  body('fullDescription')
    .trim()
    .notEmpty().withMessage('Full description is required.'),
  body('ingredients')
    .isArray({ min: 1 }).withMessage('At least one ingredient is required.'),
  body('ingredients.*.name')
    .trim()
    .notEmpty().withMessage('Each ingredient must have a name.'),
  body('ingredients.*.quantity')
    .trim()
    .notEmpty().withMessage('Each ingredient must have a quantity.'),
  body('steps')
    .isArray({ min: 1 }).withMessage('At least one step is required.'),
  body('cuisineType')
    .trim()
    .notEmpty().withMessage('Cuisine type is required.'),
  body('dietType')
    .isIn(['veg', 'non-veg', 'vegan']).withMessage('Diet type must be veg, non-veg, or vegan.'),
  body('cookTime')
    .isInt({ min: 1 }).withMessage('Cook time must be a positive integer (minutes).'),
  body('difficulty')
    .isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be easy, medium, or hard.'),
];

// ─── Public routes ────────────────────────────────────────────────────────────
router.get('/', recipeController.getRecipes);
router.get('/top-rated', recipeController.getTopRated);
router.get('/:id', recipeController.getRecipe);

// ─── Protected routes ─────────────────────────────────────────────────────────
router.post('/', protect, recipeValidation, recipeController.createRecipe);
router.put('/:id', protect, recipeController.updateRecipe);
router.delete('/:id', protect, recipeController.deleteRecipe);

export default router;
