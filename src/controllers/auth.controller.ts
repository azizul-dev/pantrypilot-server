import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import * as authService from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response.utils';

export const register = async (
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

    const { name, email, password } = req.body;
    const result = await authService.registerUser(name, email, password);

    sendSuccess(
      res,
      'Account created successfully.',
      { user: result.user, token: result.token },
      201
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (
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

    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);

    sendSuccess(res, 'Login successful.', {
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
};

export const demoLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const credentials = authService.getDemoCredentials();

    // Auto-login with demo credentials
    const result = await authService.loginUser(
      credentials.email,
      credentials.password
    );

    sendSuccess(res, 'Demo login successful.', {
      user: result.user,
      token: result.token,
      credentials, // so frontend can auto-fill the form fields
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Not authenticated.', 401);
      return;
    }

    const { getUserProfile } = await import('../services/user.service');
    const user = await getUserProfile(req.user.id);

    sendSuccess(res, 'Profile fetched successfully.', { user });
  } catch (error) {
    next(error);
  }
};

export const googleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, name, avatar, googleId } = req.body;

    if (!email || !name || !googleId) {
      sendError(res, 'Missing required Google profile fields.', 400);
      return;
    }

    const result = await authService.googleAuth(email, name, avatar, googleId);

    sendSuccess(res, 'Google login successful.', {
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
};
