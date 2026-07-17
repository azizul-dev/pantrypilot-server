import Recipe from '../models/Recipe.model';
import Review from '../models/Review.model';
import { IRecipe } from '../types';
import { createError } from '../utils/response.utils';
import mongoose from 'mongoose';

export interface RecipeFilters {
  cuisineType?: string;
  dietType?: string;
  difficulty?: string;
  search?: string;
  authorId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}

export interface PaginatedRecipes {
  recipes: IRecipe[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const getAllRecipes = async (
  filters: RecipeFilters
): Promise<PaginatedRecipes> => {
  const {
    cuisineType,
    dietType,
    difficulty,
    search,
    authorId,
    page = 1,
    limit = 10,
    sortBy = '-createdAt',
  } = filters;

  const query: mongoose.FilterQuery<IRecipe> = {};

  if (cuisineType) query.cuisineType = new RegExp(cuisineType, 'i');
  if (dietType) query.dietType = dietType;
  if (difficulty) query.difficulty = difficulty;
  if (authorId) query.authorId = authorId;
  if (search) query.$text = { $search: search };

  const skip = (page - 1) * limit;
  const [recipes, total] = await Promise.all([
    Recipe.find(query)
      .populate('authorId', 'name avatar email')
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean(),
    Recipe.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    recipes: recipes as unknown as IRecipe[],
    total,
    page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

export const getRecipeById = async (id: string): Promise<IRecipe> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError('Invalid recipe ID.', 400);
  }

  const recipe = await Recipe.findById(id).populate('authorId', 'name avatar email');
  if (!recipe) {
    throw createError('Recipe not found.', 404);
  }
  return recipe;
};

export const createRecipe = async (
  data: Partial<IRecipe>,
  authorId: string
): Promise<IRecipe> => {
  const recipe = await Recipe.create({ ...data, authorId });
  return recipe;
};

export const updateRecipe = async (
  id: string,
  data: Partial<IRecipe>,
  requesterId: string,
  requesterRole: string
): Promise<IRecipe> => {
  const recipe = await Recipe.findById(id);
  if (!recipe) throw createError('Recipe not found.', 404);

  if (
    recipe.authorId.toString() !== requesterId &&
    requesterRole !== 'admin'
  ) {
    throw createError('You are not authorized to update this recipe.', 403);
  }

  // Prevent overwriting authorId or rating
  delete (data as Partial<IRecipe> & { avgRating?: number; totalReviews?: number }).avgRating;
  delete (data as Partial<IRecipe> & { avgRating?: number; totalReviews?: number }).totalReviews;

  const updated = await Recipe.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate('authorId', 'name avatar email');

  return updated!;
};

export const deleteRecipe = async (
  id: string,
  requesterId: string,
  requesterRole: string
): Promise<void> => {
  const recipe = await Recipe.findById(id);
  if (!recipe) throw createError('Recipe not found.', 404);

  if (
    recipe.authorId.toString() !== requesterId &&
    requesterRole !== 'admin'
  ) {
    throw createError('You are not authorized to delete this recipe.', 403);
  }

  await Promise.all([
    Recipe.findByIdAndDelete(id),
    Review.deleteMany({ recipeId: id }),
  ]);
};

export const getTopRatedRecipes = async (limitCount = 6): Promise<IRecipe[]> => {
  return Recipe.find({ totalReviews: { $gt: 0 } })
    .populate('authorId', 'name avatar')
    .sort({ avgRating: -1, totalReviews: -1 })
    .limit(limitCount)
    .lean() as unknown as IRecipe[];
};

export const getRecipesByAuthor = async (
  authorId: string,
  page = 1,
  limit = 10,
  sortBy = '-createdAt'
): Promise<PaginatedRecipes> => {
  const skip = (page - 1) * limit;
  const [recipes, total] = await Promise.all([
    Recipe.find({ authorId })
      .populate('authorId', 'name avatar email')
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean(),
    Recipe.countDocuments({ authorId }),
  ]);

  const totalPages = Math.ceil(total / limit);
  return {
    recipes: recipes as unknown as IRecipe[],
    total,
    page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
