import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { AuthenticatedRequest } from '../types/index.js';
import { successResponse, errorResponse } from '../utils/response.js';

const createAdminSchema = z.object({
  name: z.string().min(2, 'Nama minimal terdiri dari 2 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal terdiri dari 6 karakter')
});

const updateAdminSchema = z.object({
  name: z.string().min(2, 'Nama minimal terdiri dari 2 karakter'),
  email: z.string().email('Format email tidak valid')
});

const adminRoles = ['ADMIN', 'OPERATOR'];

const adminSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true
} as const;

type AdminRecord = {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function toAdminResponse(admin: AdminRecord) {
  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    status: admin.isActive ? 'Aktif' : 'Nonaktif',
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt
  };
}

function parseAdminId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export const getAdmins = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const admins = await prisma.user.findMany({
      where: { role: { in: adminRoles } },
      orderBy: { createdAt: 'asc' },
      select: adminSelect
    });

    successResponse(res, 'Daftar admin berhasil diambil.', admins.map(toAdminResponse));
  } catch (err) {
    next(err);
  }
};

export const createAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validated = createAdminSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email }
    });

    if (existingUser) {
      errorResponse(res, 'Email sudah terdaftar.', 409);
      return;
    }

    const hashedPassword = await bcrypt.hash(validated.password, 10);

    const admin = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true
      },
      select: adminSelect
    });

    successResponse(res, 'Akun admin berhasil ditambahkan.', toAdminResponse(admin), 201);
  } catch (err) {
    next(err);
  }
};

export const updateAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const adminId = parseAdminId(req.params.id);

    if (!adminId) {
      errorResponse(res, 'ID admin tidak valid.', 400);
      return;
    }

    const validated = updateAdminSchema.parse(req.body);

    const existingAdmin = await prisma.user.findFirst({
      where: { id: adminId, role: { in: adminRoles } },
      select: { id: true }
    });

    if (!existingAdmin) {
      errorResponse(res, 'Akun admin tidak ditemukan.', 404);
      return;
    }

    const emailOwner = await prisma.user.findUnique({
      where: { email: validated.email },
      select: { id: true }
    });

    if (emailOwner && emailOwner.id !== adminId) {
      errorResponse(res, 'Email sudah digunakan oleh akun lain.', 409);
      return;
    }

    const admin = await prisma.user.update({
      where: { id: adminId },
      data: {
        name: validated.name,
        email: validated.email
      },
      select: adminSelect
    });

    successResponse(res, 'Data admin berhasil diperbarui.', toAdminResponse(admin));
  } catch (err) {
    next(err);
  }
};

export const deactivateAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const adminId = parseAdminId(req.params.id);

    if (!adminId) {
      errorResponse(res, 'ID admin tidak valid.', 400);
      return;
    }

    if (req.user?.userId === adminId) {
      errorResponse(res, 'Anda tidak dapat menonaktifkan akun sendiri.', 400);
      return;
    }

    const existingAdmin = await prisma.user.findFirst({
      where: { id: adminId, role: { in: adminRoles } },
      select: { id: true }
    });

    if (!existingAdmin) {
      errorResponse(res, 'Akun admin tidak ditemukan.', 404);
      return;
    }

    const admin = await prisma.user.update({
      where: { id: adminId },
      data: { isActive: false },
      select: adminSelect
    });

    successResponse(res, 'Akun admin berhasil dinonaktifkan.', toAdminResponse(admin));
  } catch (err) {
    next(err);
  }
};

export const activateAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const adminId = parseAdminId(req.params.id);

    if (!adminId) {
      errorResponse(res, 'ID admin tidak valid.', 400);
      return;
    }

    const existingAdmin = await prisma.user.findFirst({
      where: { id: adminId, role: { in: adminRoles } },
      select: { id: true }
    });

    if (!existingAdmin) {
      errorResponse(res, 'Akun admin tidak ditemukan.', 404);
      return;
    }

    const admin = await prisma.user.update({
      where: { id: adminId },
      data: { isActive: true },
      select: adminSelect
    });

    successResponse(res, 'Akun admin berhasil diaktifkan.', toAdminResponse(admin));
  } catch (err) {
    next(err);
  }
};
