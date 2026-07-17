import { Router } from 'express';
import { body } from 'express-validator';
import * as reviewController from '../controllers/review.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router({ mergeParams: true }); // mergeParams to access :recipeId

const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5.'),
  body('comment')
    .trim()
    .notEmpty().withMessage('Comment is required.')
    .isLength({ min: 5, max: 1000 }).withMessage('Comment must be between 5 and 1000 characters.'),
];

// ─── GET /api/recipes/:recipeId/reviews ───────────────────────────────────────
router.get('/', reviewController.getReviews);

// ─── POST /api/recipes/:recipeId/reviews ──────────────────────────────────────
router.post('/', protect, reviewValidation, reviewController.createReview);

// ─── PUT /api/recipes/:recipeId/reviews/:reviewId ─────────────────────────────
router.put('/:reviewId', protect, reviewValidation, reviewController.updateReview);

// ─── DELETE /api/recipes/:recipeId/reviews/:reviewId ──────────────────────────
router.delete('/:reviewId', protect, reviewController.deleteReview);

export default router;
