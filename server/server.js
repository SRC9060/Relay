import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { seedDatabase } from './services/seed.service.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, './.env') });
dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
      await seedDatabase();
    } else {
      console.warn('[Relay Server] MONGODB_URI not set. Running with resilient fallback storage.');
    }
  } catch (err) {
    console.error('[Relay Server] Database initialization notice:', err.message);
  }

  const server = app.listen(PORT, () => {
    console.log(`[Relay Server] running on http://localhost:${PORT}`);
    console.log(`[Relay Server] API active (Health: http://localhost:${PORT}/api/health)`);
  });

  const shutdown = async () => {
    console.log('[Relay Server] Gracefully shutting down...');
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer();
