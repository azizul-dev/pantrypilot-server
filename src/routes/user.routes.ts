import { Router } from 'express';
import { body } from 'express-validator';
import * as userController from '../controllers/user.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';

const router = Router();

// ─── GET /api/users/profile ───────────────────────────────────────────────────
router.get('/profile', protect, userController.getProfile);

// ─── PUT /api/users/profile ───────────────────────────────────────────────────
router.put(
  '/profile',
  protect,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters.'),
    body('avatar')
      .optional()
      .isURL().withMessage('Avatar must be a valid URL.'),
  ],
  userController.updateProfile
);

// ─── GET /api/users (admin only) ─────────────────────────────────────────────
router.get('/', protect, adminOnly, userController.getAllUsers);

export default router;
