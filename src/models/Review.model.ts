import mongoose, { Schema } from 'mongoose';
import { IReview } from '../types';
import Recipe from './Recipe.model';

const ReviewSchema = new Schema<IReview>(
  {
    recipeId: {
      type: Schema.Types.ObjectId,
      ref: 'Recipe',
      required: [true, 'Recipe ID is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      trim: true,
      minlength: [5, 'Comment must be at least 5 characters'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// ─── One review per user per recipe ──────────────────────────────────────────
ReviewSchema.index({ recipeId: 1, userId: 1 }, { unique: true });

// ─── Update Recipe avgRating after save ───────────────────────────────────────
ReviewSchema.post('save', async function () {
  await updateRecipeRating(this.recipeId.toString());
});

// ─── Update Recipe avgRating after delete ─────────────────────────────────────
ReviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await updateRecipeRating(doc.recipeId.toString());
  }
});

async function updateRecipeRating(recipeId: string): Promise<void> {
  const Review = mongoose.model('Review');
  const stats = await Review.aggregate([
    { $match: { recipeId: new mongoose.Types.ObjectId(recipeId) } },
    {
      $group: {
        _id: '$recipeId',
        avgRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Recipe.findByIdAndUpdate(recipeId, {
      avgRating: Math.round(stats[0].avgRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
    });
  } else {
    await Recipe.findByIdAndUpdate(recipeId, {
      avgRating: 0,
      totalReviews: 0,
    });
  }
}

const Review = mongoose.model<IReview>('Review', ReviewSchema);
export default Review;
