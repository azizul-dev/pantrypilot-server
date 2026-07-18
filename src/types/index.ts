import { Document, Types } from 'mongoose';

// ─── Auth / JWT ───────────────────────────────────────────────────────────────

export interface IUserPayload {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: 'user' | 'admin';
  wishlist: Types.ObjectId[];
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ─── Recipe ───────────────────────────────────────────────────────────────────

export interface IIngredient {
  name: string;
  quantity: string;
}

export type DietType = 'veg' | 'non-veg' | 'vegan';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface IRecipe extends Document {
  _id: Types.ObjectId;
  title: string;
  shortDescription: string;
  fullDescription: string;
  ingredients: IIngredient[];
  steps: string[];
  cuisineType: string;
  dietType: DietType;
  cookTime: number; // in minutes
  difficulty: DifficultyLevel;
  images: string[];
  authorId: Types.ObjectId;
  avgRating: number;
  totalReviews: number;
  createdAt: Date;
}

// ─── Review ───────────────────────────────────────────────────────────────────

export interface IReview extends Document {
  _id: Types.ObjectId;
  recipeId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
}
