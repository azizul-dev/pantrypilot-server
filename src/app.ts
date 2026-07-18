import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { FRONTEND_ORIGIN, NODE_ENV } from './config/constants';

// ─── Route imports ────────────────────────────────────────────────────────────
import authRoutes from './routes/auth.routes';
import recipeRoutes from './routes/recipe.routes';
import nestedReviewRoutes from './routes/review.routes';   // nested: /api/recipes/:recipeId/reviews  (old)
import reviewRoutes from './routes/review.routes';          // standalone: /api/reviews
import userRoutes from './routes/user.routes';
import aiRoutes from './routes/ai.routes';
import wishlistRoutes from './routes/wishlist.routes';

// ─── Middleware imports ───────────────────────────────────────────────────────
import errorMiddleware from './middleware/error.middleware';

const app = express();

// ─── Security & Parsing ───────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Logger ───────────────────────────────────────────────────────────────────
if (NODE_ENV !== 'test') {
  app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined'));
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: '🍳 PantryPilot API is running!',
    data: {
      env: NODE_ENV,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);

// Nested: GET/POST /api/recipes/:recipeId/reviews
app.use('/api/recipes/:recipeId/reviews', nestedReviewRoutes);

// Standalone: POST /api/reviews  |  GET /api/reviews/recipe/:recipeId
app.use('/api/reviews', reviewRoutes);

app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/wishlist', wishlistRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
    data: null,
  });
});

// ─── Centralized Error Handler ───────────────────────────────────────────────
app.use(errorMiddleware as (err: Error, req: Request, res: Response, next: NextFunction) => void);

export default app;
