import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ENV } from './config/env.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorMiddleware.js';

const app = express();

// Security and CORS
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (ENV.CORS_ORIGIN.indexOf(origin) !== -1 || ENV.CORS_ORIGIN.includes('*')) {
        return callback(null, true);
      }
      return callback(null, true); // Allow dev origins conveniently
    },
    credentials: true
  })
);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Welcome Endpoint
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Selamat datang di API Pelayanan Surat Desa Gempolkurung',
    docs: {
      health: '/health',
      api_base: '/api'
    }
  });
});

// Health Check Endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'Sistem Pelayanan Surat Desa Gempolkurung - Backend API',
    timestamp: new Date().toISOString()
  });
});

// Primary API Router
app.use('/api', apiRouter);

// 404 Not Found Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan.'
  });
});

// Global Error Handler
app.use(errorHandler);

const PORT = parseInt(ENV.PORT, 10);

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Server running on port ${PORT} [${ENV.NODE_ENV}]`);
  console.log(`📍 Health Check: http://localhost:${PORT}/health`);
  console.log(`📍 API Base:     http://localhost:${PORT}/api`);
  console.log(`====================================================`);
});

export default app;
