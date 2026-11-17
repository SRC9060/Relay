import express from 'express';
import cors from 'cors';
import { getDbStatus } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import accountsRoutes from './routes/accounts.routes.js';
import conversationsRoutes from './routes/conversations.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// API health check with database status (safe, credential-free, zero infrastructure exposure)
app.get('/api/health', (req, res) => {
  const dbState = getDbStatus();
  res.json({
    status: 'ok',
    service: 'Relay Backend API',
    version: '1.0.0',
    milestone: 3,
    database: {
      status: dbState.status,
      readyState: dbState.readyState
    },
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/conversations', conversationsRoutes);

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

export default app;
