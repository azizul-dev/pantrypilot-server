import mongoose from 'mongoose';
import User from '../models/User.model';
import { createError } from '../utils/response.utils';

export const addToWishlist = async (userId: string, recipeId: string) => {
  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    throw createError('Invalid recipe ID.', 400);
  }

  const user = await User.findById(userId);
  if (!user) throw createError('User not found.', 404);

  const alreadyIn = user.wishlist.some((id) => id.toString() === recipeId);
  if (alreadyIn) {
    throw createError('Recipe is already in your wishlist.', 409);
  }

  user.wishlist.push(new mongoose.Types.ObjectId(recipeId));
  await user.save();

  return user.wishlist;
};

export const removeFromWishlist = async (userId: string, recipeId: string) => {
  const user = await User.findById(userId);
  if (!user) throw createError('User not found.', 404);

  user.wishlist = user.wishlist.filter(
    (id) => id.toString() !== recipeId
  ) as typeof user.wishlist;

  await user.save();
  return user.wishlist;
};

export const getWishlist = async (userId: string) => {
  const user = await User.findById(userId).populate('wishlist');
  if (!user) throw createError('User not found.', 404);
  return user.wishlist;
};
