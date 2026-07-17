import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import * as userService from '../services/user.service';
import { sendSuccess, sendError } from '../utils/response.utils';

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Not authenticated.', 401);
      return;
    }
    const user = await userService.getUserProfile(req.user.id);
    sendSuccess(res, 'Profile fetched successfully.', { user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
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

    const { name, avatar } = req.body;
    const user = await userService.updateUserProfile(req.user.id, { name, avatar });
    sendSuccess(res, 'Profile updated successfully.', { user });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    sendSuccess(res, 'Users fetched successfully.', { users, total: users.length });
  } catch (error) {
    next(error);
  }
};
