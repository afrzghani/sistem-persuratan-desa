import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const residentInputSchema = z.object({
  nik: z.string().length(16, 'NIK harus terdiri dari tepat 16 digit'),
  nama: z.string().min(1, 'Nama wajib diisi'),
  tempatLahir: z.string().min(1, 'Tempat lahir wajib diisi'),
  tanggalLahir: z.string().or(z.date()).transform((val) => new Date(val)),
  jenisKelamin: z.string().min(1, 'Jenis kelamin wajib diisi'),
  golonganDarah: z.string().optional().nullable(),
  alamat: z.string().min(1, 'Alamat wajib diisi'),
  rt: z.string().optional().nullable(),
  rw: z.string().optional().nullable(),
  kelDesa: z.string().optional().default('Gempolkurung'),
  kecamatan: z.string().optional().default('Menganti'),
  kabupaten: z.string().optional().default('Gresik'),
  agama: z.string().optional().nullable(),
  statusPerkawinan: z.string().optional().nullable(),
  pekerjaan: z.string().optional().nullable(),
  kewarganegaraan: z.string().optional().default('WNI')
});

// Auto-fill query: Section 6.2 of SKPL
export const getResidentByNik = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { nik } = req.params;

    if (!nik || nik.length !== 16) {
      errorResponse(res, 'Format NIK tidak valid. NIK harus terdiri dari 16 digit angka.', 400);
      return;
    }

    const resident = await prisma.resident.findUnique({
      where: { nik },
      include: {
        issuedLetters: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (!resident) {
      errorResponse(res, 'Data kependudukan dengan NIK tersebut tidak ditemukan.', 404);
      return;
    }

    successResponse(res, 'Data warga berhasil ditemukan.', resident);
  } catch (err) {
    next(err);
  }
};

export const listResidents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const search = (req.query.search as string) || '';
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
    const skip = (page - 1) * limit;

    const whereClause = search
      ? {
          OR: [
            { nik: { contains: search } },
            { nama: { contains: search } },
            { alamat: { contains: search } }
          ]
        }
      : {};

    const [total, residents] = await Promise.all([
      prisma.resident.count({ where: whereClause }),
      prisma.resident.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    successResponse(res, 'Daftar warga berhasil dimuat.', {
      residents,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

export const createOrUpdateResident = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validated = residentInputSchema.parse(req.body);

    const resident = await prisma.resident.upsert({
      where: { nik: validated.nik },
      update: {
        nama: validated.nama,
        tempatLahir: validated.tempatLahir,
        tanggalLahir: validated.tanggalLahir,
        jenisKelamin: validated.jenisKelamin,
        golonganDarah: validated.golonganDarah || null,
        alamat: validated.alamat,
        rt: validated.rt || null,
        rw: validated.rw || null,
        kelDesa: validated.kelDesa || 'Gempolkurung',
        kecamatan: validated.kecamatan || 'Menganti',
        kabupaten: validated.kabupaten || 'Gresik',
        agama: validated.agama || null,
        statusPerkawinan: validated.statusPerkawinan || null,
        pekerjaan: validated.pekerjaan || null,
        kewarganegaraan: validated.kewarganegaraan || 'WNI'
      },
      create: {
        nik: validated.nik,
        nama: validated.nama,
        tempatLahir: validated.tempatLahir,
        tanggalLahir: validated.tanggalLahir,
        jenisKelamin: validated.jenisKelamin,
        golonganDarah: validated.golonganDarah || null,
        alamat: validated.alamat,
        rt: validated.rt || null,
        rw: validated.rw || null,
        kelDesa: validated.kelDesa || 'Gempolkurung',
        kecamatan: validated.kecamatan || 'Menganti',
        kabupaten: validated.kabupaten || 'Gresik',
        agama: validated.agama || null,
        statusPerkawinan: validated.statusPerkawinan || null,
        pekerjaan: validated.pekerjaan || null,
        kewarganegaraan: validated.kewarganegaraan || 'WNI'
      }
    });

    successResponse(res, 'Data kependudukan berhasil disimpan.', resident);
  } catch (err) {
    next(err);
  }
};
