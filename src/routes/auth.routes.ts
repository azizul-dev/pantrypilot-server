import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// ─── POST /api/auth/register ──────────────────────────────────────────────────
router.post(
  '/register',
  [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required.')
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters.'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required.')
      .isEmail().withMessage('Please provide a valid email address.')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required.')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')
      .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one letter and one number.'),
  ],
  authController.register
);

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post(
  '/login',
  [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required.')
      .isEmail().withMessage('Please provide a valid email address.')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required.'),
  ],
  authController.login
);

// ─── POST /api/auth/demo-login ────────────────────────────────────────────────
// Returns demo user JWT + credentials for frontend auto-fill
router.post('/demo-login', authController.demoLogin);

// ─── POST /api/auth/google ────────────────────────────────────────────────────
// Called by NextAuth after Google OAuth succeeds, to mint a backend JWT
router.post('/google', authController.googleLogin);

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', protect, authController.getMe);

export default router;
