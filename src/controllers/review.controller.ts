import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import * as reviewService from '../services/review.service';
import { sendSuccess, sendError } from '../utils/response.utils';

// ─── Nested route handler (GET /api/recipes/:recipeId/reviews) ────────────────
export const getReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { recipeId } = req.params;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const result = await reviewService.getReviewsByRecipe(recipeId, page, limit);
    sendSuccess(res, 'Reviews fetched successfully.', result);
  } catch (error) {
    next(error);
  }
};

// ─── Standalone: GET /api/reviews/recipe/:recipeId ───────────────────────────
export const getReviewsByRecipeId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { recipeId } = req.params;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const result = await reviewService.getReviewsByRecipe(recipeId, page, limit);
    sendSuccess(res, 'Reviews fetched successfully.', result);
  } catch (error) {
    next(error);
  }
};

// ─── Nested route handler (POST /api/recipes/:recipeId/reviews) ───────────────
export const createReview = async (
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

    if (!req.user) {
      sendError(res, 'Not authenticated.', 401);
      return;
    }

    const { rating, comment } = req.body;
    const { recipeId } = req.params;

    const review = await reviewService.createReview(
      recipeId,
      req.user.id,
      rating,
      comment
    );
    sendSuccess(res, 'Review submitted successfully.', { review }, 201);
  } catch (error) {
    next(error);
  }
};

// ─── Standalone: POST /api/reviews (recipeId in body) ────────────────────────
export const createStandaloneReview = async (
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

    if (!req.user) {
      sendError(res, 'Not authenticated.', 401);
      return;
    }

    const { recipeId, rating, comment } = req.body;

    const review = await reviewService.createReview(
      recipeId,
      req.user.id,
      rating,
      comment
    );
    sendSuccess(res, 'Review submitted successfully.', { review }, 201);
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/reviews/:reviewId ───────────────────────────────────────────────
export const updateReview = async (
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

    if (!req.user) {
      sendError(res, 'Not authenticated.', 401);
      return;
    }

    const { rating, comment } = req.body;
    const review = await reviewService.updateReview(
      req.params.reviewId,
      req.user.id,
      rating,
      comment
    );
    sendSuccess(res, 'Review updated successfully.', { review });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/reviews/:reviewId ───────────────────────────────────────────
export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Not authenticated.', 401);
      return;
    }

    await reviewService.deleteReview(
      req.params.reviewId,
      req.user.id,
      req.user.role
    );
    sendSuccess(res, 'Review deleted successfully.', null);
  } catch (error) {
    next(error);
  }
};

export const getFeatured = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reviews = await reviewService.getFeaturedReviews(5);
    sendSuccess(res, 'Featured reviews fetched successfully.', { reviews });
  } catch (error) {
    next(error);
  }
};
