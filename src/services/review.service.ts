import Review from '../models/Review.model';
import { IReview } from '../types';
import { createError } from '../utils/response.utils';
import mongoose from 'mongoose';

export interface PaginatedReviews {
  reviews: IReview[];
  total: number;
  page: number;
  totalPages: number;
}

export const getReviewsByRecipe = async (
  recipeId: string,
  page = 1,
  limit = 10
): Promise<PaginatedReviews> => {
  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    throw createError('Invalid recipe ID.', 400);
  }

  const skip = (page - 1) * limit;
  const [reviews, total] = await Promise.all([
    Review.find({ recipeId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments({ recipeId }),
  ]);

  return {
    reviews: reviews as unknown as IReview[],
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const createReview = async (
  recipeId: string,
  userId: string,
  rating: number,
  comment: string
): Promise<IReview> => {
  const existing = await Review.findOne({ recipeId, userId });
  if (existing) {
    throw createError('You have already reviewed this recipe.', 409);
  }

  const review = await Review.create({ recipeId, userId, rating, comment });
  return review.populate('userId', 'name avatar');
};

export const updateReview = async (
  reviewId: string,
  userId: string,
  rating: number,
  comment: string
): Promise<IReview> => {
  const review = await Review.findById(reviewId);
  if (!review) throw createError('Review not found.', 404);

  if (review.userId.toString() !== userId) {
    throw createError('You are not authorized to update this review.', 403);
  }

  review.rating = rating;
  review.comment = comment;
  await review.save(); // triggers post('save') hook to recalculate avgRating

  return review.populate('userId', 'name avatar');
};

export const deleteReview = async (
  reviewId: string,
  userId: string,
  userRole: string
): Promise<void> => {
  const review = await Review.findById(reviewId);
  if (!review) throw createError('Review not found.', 404);

  if (review.userId.toString() !== userId && userRole !== 'admin') {
    throw createError('You are not authorized to delete this review.', 403);
  }

  await Review.findOneAndDelete({ _id: reviewId });
};

export const getFeaturedReviews = async (limit = 5): Promise<IReview[]> => {
  const reviews = await Review.find({ rating: { $gte: 4 } })
    .populate('userId', 'name avatar')
    .populate('recipeId', 'title')
    .sort({ rating: -1, createdAt: -1 })
    .limit(limit)
    .lean();

  return reviews as unknown as IReview[];
};
