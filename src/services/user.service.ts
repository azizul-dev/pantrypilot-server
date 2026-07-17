import User from '../models/User.model';
import { IUser } from '../types';
import { createError } from '../utils/response.utils';
import mongoose from 'mongoose';

export const getUserProfile = async (userId: string): Promise<IUser> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw createError('Invalid user ID.', 400);
  }
  const user = await User.findById(userId).select('-password');
  if (!user) throw createError('User not found.', 404);
  return user;
};

export const updateUserProfile = async (
  userId: string,
  updates: { name?: string; avatar?: string }
): Promise<IUser> => {
  const user = await User.findByIdAndUpdate(
    userId,
    { name: updates.name, avatar: updates.avatar },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) throw createError('User not found.', 404);
  return user;
};

export const getAllUsers = async (): Promise<IUser[]> => {
  return User.find().select('-password').sort({ createdAt: -1 }).lean() as unknown as IUser[];
};
