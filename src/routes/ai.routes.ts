import { Router } from 'express';
import {
  suggestRecipes,
  generateDescription,
  suggestRecipesValidation,
  generateDescriptionValidation,
} from '../controllers/ai.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// ─── POST /api/ai/suggest-recipes (protected) ─────────────────────────────────
router.post(
  '/suggest-recipes',
  protect,
  suggestRecipesValidation,
  suggestRecipes
);

// ─── POST /api/ai/generate-description (protected) ────────────────────────────
router.post(
  '/generate-description',
  protect,
  generateDescriptionValidation,
  generateDescription
);

export default router;
