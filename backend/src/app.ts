import express, { Application } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import { errorHandler } from './middleware/errorHandler';

export function createApp(): Application {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const API_V1 = '/api/v1';

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use(`${API_V1}/auth`, authRoutes);

  app.use(`${API_V1}/posts`, postRoutes);
  app.use(errorHandler);
  return app;
}
