import mongoose, { Schema } from 'mongoose';
import { IRecipe } from '../types';

const IngredientSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Ingredient name is required'],
      trim: true,
    },
    quantity: {
      type: String,
      required: [true, 'Ingredient quantity is required'],
      trim: true,
    },
  },
  { _id: false }
);

const RecipeSchema = new Schema<IRecipe>(
  {
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },
    fullDescription: {
      type: String,
      required: [true, 'Full description is required'],
      trim: true,
    },
    ingredients: {
      type: [IngredientSchema],
      required: [true, 'At least one ingredient is required'],
      validate: {
        validator: (v: unknown[]) => v.length > 0,
        message: 'Recipe must have at least one ingredient',
      },
    },
    steps: {
      type: [String],
      required: [true, 'At least one step is required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'Recipe must have at least one step',
      },
    },
    cuisineType: {
      type: String,
      required: [true, 'Cuisine type is required'],
      trim: true,
    },
    dietType: {
      type: String,
      enum: {
        values: ['veg', 'non-veg', 'vegan'],
        message: 'Diet type must be veg, non-veg, or vegan',
      },
      required: [true, 'Diet type is required'],
    },
    cookTime: {
      type: Number,
      required: [true, 'Cook time is required'],
      min: [1, 'Cook time must be at least 1 minute'],
    },
    difficulty: {
      type: String,
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: 'Difficulty must be easy, medium, or hard',
      },
      required: [true, 'Difficulty is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes for search & filtering ──────────────────────────────────────────
RecipeSchema.index({ title: 'text', shortDescription: 'text' });
RecipeSchema.index({ cuisineType: 1, dietType: 1, difficulty: 1 });
RecipeSchema.index({ authorId: 1 });
RecipeSchema.index({ avgRating: -1 });
RecipeSchema.index({ createdAt: -1 });

const Recipe = mongoose.model<IRecipe>('Recipe', RecipeSchema);
export default Recipe;
