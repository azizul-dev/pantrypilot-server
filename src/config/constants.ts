export const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_me';
export const JWT_EXPIRES_IN = '7d';
export const PORT = parseInt(process.env.PORT || '5000', 10);
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const FRONTEND_ORIGIN = (process.env.FRONTEND_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((s) => s.trim());export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export const BCRYPT_SALT_ROUNDS = 12;

export const DEMO_USER = {
  name: 'Demo User',
  email: 'demo@pantrypilot.com',
  password: 'Demo@1234',
  avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=demo',
  role: 'user' as const,
};
