import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { ENV } from '../config/env.js';
import { AuthenticatedRequest, AuthUserPayload } from '../types/index.js';
import { errorResponse } from '../utils/response.js';

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    errorResponse(res, 'Akses ditolak. Token otorisasi tidak ditemukan.', 401);
    return;
  }

  const token = authHeader.split(' ')[1];

  let decoded: AuthUserPayload;

  try {
    decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthUserPayload;
  } catch {
    errorResponse(res, 'Sesi tidak valid atau telah kedaluwarsa. Silakan login kembali.', 401);
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { isActive: true }
    });

    if (!user || !user.isActive) {
      errorResponse(res, 'Akun Anda dinonaktifkan. Hubungi administrator desa.', 403);
      return;
    }

    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
};
