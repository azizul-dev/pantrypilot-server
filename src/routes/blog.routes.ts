import { Router } from 'express';
import { body } from 'express-validator';
import * as blogController from '../controllers/blog.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

const blogValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required.')
    .isLength({ min: 5, max: 150 }).withMessage('Title must be between 5 and 150 characters.'),
  body('excerpt')
    .trim()
    .notEmpty().withMessage('Excerpt is required.')
    .isLength({ max: 250 }).withMessage('Excerpt cannot exceed 250 characters.'),
  body('content')
    .trim()
    .notEmpty().withMessage('Content is required.')
    .isLength({ min: 50 }).withMessage('Content must be at least 50 characters.'),
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required.'),
  body('image')
    .trim()
    .notEmpty().withMessage('Cover image is required.'),
];

// ─── Public routes ────────────────────────────────────────────────────────────
router.get('/', blogController.getBlogs);

// ─── Protected: current user's posts — must be BEFORE /:id ───────────────────
router.get('/user/mine', protect, blogController.getMyBlogs);

// ─── Public: single post ──────────────────────────────────────────────────────
router.get('/:id', blogController.getBlog);

// ─── Protected: create / update / delete ─────────────────────────────────────
router.post('/', protect, blogValidation, blogController.createBlog);
router.put('/:id', protect, blogController.updateBlog);
router.delete('/:id', protect, blogController.deleteBlog);

export default router;
