import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { MulterError } from 'multer';
import { errorResponse } from '../utils/response.js';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  console.error('[Error Details]:', err);

  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message
    }));
    errorResponse(res, 'Validasi gagal. Mohon periksa kembali input Anda.', 422, formattedErrors);
    return;
  }

  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      errorResponse(res, 'Ukuran file melebihi batas maksimal 5 MB.', 413);
      return;
    }
    errorResponse(res, `Kesalahan saat mengunggah file: ${err.message}`, 400);
    return;
  }

  const statusCode = (err as unknown as { statusCode?: number }).statusCode || 500;
  const message = err.message || 'Terjadi kesalahan internal pada server.';
  errorResponse(res, message, statusCode);
};
