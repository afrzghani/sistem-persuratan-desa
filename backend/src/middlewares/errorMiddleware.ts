import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { MulterError } from 'multer';
import { Prisma } from '@prisma/client';
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
      errorResponse(res, 'Ukuran file melebihi batas maksimal yang diizinkan.', 413);
      return;
    }
    errorResponse(res, `Kesalahan saat mengunggah file: ${err.message}`, 400);
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = Array.isArray(err.meta?.target)
        ? err.meta.target.join(', ')
        : String(err.meta?.target ?? '');

      if (target.includes('nomorSurat')) {
        errorResponse(
          res,
          'Nomor surat sudah pernah digunakan. Silakan gunakan nomor surat lain.',
          409
        );
        return;
      }

      errorResponse(
        res,
        'Data yang Anda simpan sudah ada. Gunakan nilai yang berbeda.',
        409
      );
      return;
    }

    if (err.code === 'P2003') {
      errorResponse(
        res,
        'Data tidak dapat diproses karena masih terhubung dengan data lain.',
        409
      );
      return;
    }
  }

  const statusCode = (err as unknown as { statusCode?: number }).statusCode || 500;
  const message = err.message || 'Terjadi kesalahan internal pada server.';
  errorResponse(res, message, statusCode);
};
