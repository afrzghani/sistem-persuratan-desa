import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { AuthenticatedRequest } from '../types/index.js';
import { successResponse } from '../utils/response.js';
import { getOrCreateDesaSettings } from '../services/desaSettingsService.js';

const updateDesaSettingsSchema = z
  .object({
    namaKepalaDesa: z.string().min(1, 'Nama kepala desa wajib diisi').optional(),
    jabatan: z.string().min(1, 'Jabatan wajib diisi').optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Tidak ada data pengaturan desa yang diperbarui.'
  });

export const getDesaSettings = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const settings = await getOrCreateDesaSettings();
    successResponse(res, 'Pengaturan desa berhasil diambil.', settings);
  } catch (err) {
    next(err);
  }
};

export const updateDesaSettings = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validated = updateDesaSettingsSchema.parse(req.body);

    const settings = await prisma.desaSetting.upsert({
      where: { id: 1 },
      update: validated,
      create: { id: 1, ...validated }
    });

    successResponse(res, 'Pengaturan desa berhasil diperbarui.', settings);
  } catch (err) {
    next(err);
  }
};
