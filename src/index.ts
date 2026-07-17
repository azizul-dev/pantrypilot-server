import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './config/db';
import { PORT } from './config/constants';

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log('');
      console.log('┌─────────────────────────────────────────┐');
      console.log('│           🍳  PantryPilot API            │');
      console.log('├─────────────────────────────────────────┤');
      console.log(`│  Server  →  http://localhost:${PORT}        │`);
      console.log(`│  Health  →  http://localhost:${PORT}/health  │`);
      console.log(`│  Env     →  ${process.env.NODE_ENV?.padEnd(28)}│`);
      console.log('└─────────────────────────────────────────┘');
      console.log('');
    });

    // ─── Graceful shutdown ─────────────────────────────────────────────────
    const gracefulShutdown = (signal: string) => {
      console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);
      server.close(() => {
        console.log('✅ HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // ─── Unhandled rejections ──────────────────────────────────────────────
    process.on('unhandledRejection', (reason: Error) => {
      console.error('❌ Unhandled Rejection:', reason.message);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
