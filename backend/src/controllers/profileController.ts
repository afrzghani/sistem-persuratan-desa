import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { AuthenticatedRequest } from '../types/index.js';
import { successResponse, errorResponse } from '../utils/response.js';

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Nama minimal terdiri dari 2 karakter'),
  email: z.string().email('Format email tidak valid')
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Password saat ini wajib diisi'),
  newPassword: z.string().min(6, 'Password baru minimal terdiri dari 6 karakter')
});

const profileSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true
} as const;

type ProfileRecord = {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function toProfileResponse(user: ProfileRecord) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.isActive ? 'Aktif' : 'Nonaktif',
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      errorResponse(res, 'Tidak terotentikasi.', 401);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: profileSelect
    });

    if (!user) {
      errorResponse(res, 'Pengguna tidak ditemukan.', 404);
      return;
    }

    successResponse(res, 'Profil berhasil diambil.', toProfileResponse(user));
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      errorResponse(res, 'Tidak terotentikasi.', 401);
      return;
    }

    const validated = updateProfileSchema.parse(req.body);

    const emailOwner = await prisma.user.findUnique({
      where: { email: validated.email },
      select: { id: true }
    });

    if (emailOwner && emailOwner.id !== req.user.userId) {
      errorResponse(res, 'Email sudah digunakan oleh akun lain.', 409);
      return;
    }

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        name: validated.name,
        email: validated.email
      },
      select: profileSelect
    });

    successResponse(res, 'Profil berhasil diperbarui.', toProfileResponse(user));
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      errorResponse(res, 'Tidak terotentikasi.', 401);
      return;
    }

    const validated = changePasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, password: true }
    });

    if (!user) {
      errorResponse(res, 'Pengguna tidak ditemukan.', 404);
      return;
    }

    const isMatch = await bcrypt.compare(validated.currentPassword, user.password);

    if (!isMatch) {
      errorResponse(res, 'Password saat ini tidak sesuai.', 400);
      return;
    }

    const hashedPassword = await bcrypt.hash(validated.newPassword, 10);

    await prisma.user.update({
      where: { id: req.user.userId },
      data: { password: hashedPassword }
    });

    successResponse(res, 'Password berhasil diperbarui.');
  } catch (err) {
    next(err);
  }
};
