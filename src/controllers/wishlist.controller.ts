import { Request, Response, NextFunction } from 'express';
import * as wishlistService from '../services/wishlist.service';
import { sendSuccess, sendError } from '../utils/response.utils';

export const addToWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Not authenticated.', 401);
      return;
    }
    const wishlist = await wishlistService.addToWishlist(
      req.user.id,
      req.params.recipeId
    );
    sendSuccess(res, 'Recipe added to wishlist.', { wishlist }, 201);
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Not authenticated.', 401);
      return;
    }
    const wishlist = await wishlistService.removeFromWishlist(
      req.user.id,
      req.params.recipeId
    );
    sendSuccess(res, 'Recipe removed from wishlist.', { wishlist });
  } catch (error) {
    next(error);
  }
};

export const getWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Not authenticated.', 401);
      return;
    }
    const wishlist = await wishlistService.getWishlist(req.user.id);
    sendSuccess(res, 'Wishlist fetched successfully.', { wishlist });
  } catch (error) {
    next(error);
  }
};
