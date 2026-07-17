import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';
import { NotFoundError, TooManyRequestsError } from './errors/HttpError';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';

export function createApp(): Application {
  const app = express();
  const API_V1 = '/api/v1';

  // Security & performance
  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(express.json({ limit: '10kb' })); // small body — no massive posts
  if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

  // Brute-force protection on auth endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 20,                  // 20 requests per window per IP
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res, next) => next(new TooManyRequestsError('Too many attempts, please try again later')),
  });

  // Routes
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use(`${API_V1}/auth`, authLimiter, authRoutes);
  app.use(`${API_V1}/posts`, postRoutes);

  app.use((_req, _res, next) => next(new NotFoundError('Route')));

  // Error handler LAST
  app.use(errorHandler);
  return app;
}
