import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import { IUser, IUserPayload } from '../types';
import { JWT_SECRET, JWT_EXPIRES_IN, DEMO_USER } from '../config/constants';
import { createError } from '../utils/response.utils';

export interface AuthResult {
  user: Omit<IUser, 'password'>;
  token: string;
}

const generateToken = (payload: IUserPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResult> => {
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw createError('An account with this email already exists.', 409);
  }

  const user = await User.create({ name, email, password });

  const token = generateToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return { user: user as Omit<IUser, 'password'>, token };
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  // Fetch with password explicitly (it's select: false by default)
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw createError('Invalid email or password.', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw createError('Invalid email or password.', 401);
  }

  const token = generateToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  // Strip password from returned user object
  const userObj = user.toJSON();

  return { user: userObj as unknown as Omit<IUser, 'password'>, token };
};

export const getDemoCredentials = (): { email: string; password: string } => {
  return {
    email: DEMO_USER.email,
    password: DEMO_USER.password,
  };
};
