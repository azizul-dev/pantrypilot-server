import { Router } from 'express';
import * as wishlistController from '../controllers/wishlist.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// ─── GET /api/wishlist ─────────────────────────────────────────────────────
router.get('/', protect, wishlistController.getWishlist);

// ─── POST /api/wishlist/:recipeId ──────────────────────────────────────────
router.post('/:recipeId', protect, wishlistController.addToWishlist);

// ─── DELETE /api/wishlist/:recipeId ────────────────────────────────────────
router.delete('/:recipeId', protect, wishlistController.removeFromWishlist);

export default router;
