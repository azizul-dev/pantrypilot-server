import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import * as recipeService from "../services/recipe.service";
import { sendSuccess, sendError } from "../utils/response.utils";

export const getRecipes = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      cuisineType,
      dietType,
      difficulty,
      search,
      authorId,
      page = "1",
      limit = "10",
      sortBy = "-createdAt",
      maxCookTime,
    } = req.query;
    const result = await recipeService.getAllRecipes({
      cuisineType: cuisineType as string,
      dietType: dietType as string,
      difficulty: difficulty as string,
      search: search as string,
      authorId: authorId as string,
      page: parseInt(page as string, 10),
      limit: Math.min(parseInt(limit as string, 10), 50), // cap at 50
      sortBy: sortBy as string,
      maxCookTime: maxCookTime
        ? parseInt(maxCookTime as string, 10)
        : undefined,
    });

    sendSuccess(res, "Recipes fetched successfully.", result);
  } catch (error) {
    next(error);
  }
};

export const getRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const recipe = await recipeService.getRecipeById(req.params.id);
    sendSuccess(res, "Recipe fetched successfully.", { recipe });
  } catch (error) {
    next(error);
  }
};

export const createRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, errors.array()[0].msg, 400);
      return;
    }

    if (!req.user) {
      sendError(res, "Not authenticated.", 401);
      return;
    }

    const recipe = await recipeService.createRecipe(req.body, req.user.id);
    sendSuccess(res, "Recipe created successfully.", { recipe }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, "Not authenticated.", 401);
      return;
    }

    const recipe = await recipeService.updateRecipe(
      req.params.id,
      req.body,
      req.user.id,
      req.user.role,
    );
    sendSuccess(res, "Recipe updated successfully.", { recipe });
  } catch (error) {
    next(error);
  }
};

export const deleteRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, "Not authenticated.", 401);
      return;
    }

    await recipeService.deleteRecipe(req.params.id, req.user.id, req.user.role);
    sendSuccess(res, "Recipe deleted successfully.", null);
  } catch (error) {
    next(error);
  }
};

export const getTopRated = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 6;
    const recipes = await recipeService.getTopRatedRecipes(limit);
    sendSuccess(res, "Top rated recipes fetched successfully.", { recipes });
  } catch (error) {
    next(error);
  }
};

export const getMyRecipes = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, "Not authenticated.", 401);
      return;
    }

    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit as string, 10) || 10, 50);
    const sortBy = (req.query.sortBy as string) || "-createdAt";

    const result = await recipeService.getRecipesByAuthor(
      req.user.id,
      page,
      limit,
      sortBy,
    );

    sendSuccess(res, "Your recipes fetched successfully.", result);
  } catch (error) {
    next(error);
  }
};
