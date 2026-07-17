import express, { Application } from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';

export function createApp(): Application {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  // Routes will be added here in later commits

  app.use(errorHandler); 
  return app;
}
