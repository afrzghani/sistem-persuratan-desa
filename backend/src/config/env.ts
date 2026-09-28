import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || '5000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  OCR_SERVICE_URL: process.env.OCR_SERVICE_URL || 'http://127.0.0.1:8000/ocr/ktp',
  CORS_ORIGIN: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000', 'http://localhost:5173']
};
