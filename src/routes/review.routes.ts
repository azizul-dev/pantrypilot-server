import { Router } from 'express';
import { body } from 'express-validator';
import * as reviewController from '../controllers/review.controller';
import { protect } from '../middleware/auth.middleware';

// Standalone review router (not nested under recipes)
const router = Router();

const reviewValidation = [
  body('recipeId')
    .notEmpty().withMessage('recipeId is required.')
    .isMongoId().withMessage('recipeId must be a valid MongoDB ID.'),
  body('rating')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5.'),
  body('comment')
    .trim()
    .notEmpty().withMessage('Comment is required.')
    .isLength({ min: 5, max: 1000 }).withMessage('Comment must be between 5 and 1000 characters.'),
];

const updateValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5.'),
  body('comment')
    .trim()
    .notEmpty().withMessage('Comment is required.')
    .isLength({ min: 5, max: 1000 }).withMessage('Comment must be between 5 and 1000 characters.'),
];

// ─── POST /api/reviews ────────────────────────────────────────────────────────
router.post('/', protect, reviewValidation, reviewController.createStandaloneReview);

// ─── GET /api/reviews/recipe/:recipeId ───────────────────────────────────────
router.get('/recipe/:recipeId', reviewController.getReviewsByRecipeId);

// ─── PUT /api/reviews/:reviewId ───────────────────────────────────────────────
router.put('/:reviewId', protect, updateValidation, reviewController.updateReview);

// ─── DELETE /api/reviews/:reviewId ────────────────────────────────────────────
router.delete('/:reviewId', protect, reviewController.deleteReview);

export default router;
