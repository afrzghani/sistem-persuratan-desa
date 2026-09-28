import { Response, NextFunction } from 'express';
import { z } from 'zod';
import path from 'path';
import fs from 'fs';
import { prisma } from '../config/prisma.js';
import { AuthenticatedRequest } from '../types/index.js';
import { generateDocumentFromTemplate, LetterTemplateVariables } from '../services/docxtemplaterService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const generateLetterSchema = z.object({
  residentNik: z.string().length(16, 'NIK harus terdiri dari 16 digit'),
  templateId: z.number().int().positive(),
  nomorSurat: z.string().min(1, 'Nomor surat wajib diisi'),
  keperluan: z.string().min(1, 'Keperluan surat wajib diisi')
});

export const listTemplates = async (_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const templates = await prisma.letterTemplate.findMany({
      where: { isActive: true },
      orderBy: { namaSurat: 'asc' }
    });
    successResponse(res, 'Daftar template surat berhasil dimuat.', templates);
  } catch (err) {
    next(err);
  }
};

export const issueLetter = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      errorResponse(res, 'Tidak terotentikasi.', 401);
      return;
    }

    const validated = generateLetterSchema.parse(req.body);

    const resident = await prisma.resident.findUnique({
      where: { nik: validated.residentNik }
    });

    if (!resident) {
      errorResponse(res, 'Data warga dengan NIK ini belum terdaftar.', 404);
      return;
    }

    const template = await prisma.letterTemplate.findUnique({
      where: { id: validated.templateId }
    });

    if (!template) {
      errorResponse(res, 'Template surat tidak ditemukan.', 404);
      return;
    }

    // Format date in Indonesian locale (e.g. 29 September 2026)
    const formattedTanggalSurat = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date());

    const formattedTanggalLahir = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(resident.tanggalLahir));

    const templateVariables: LetterTemplateVariables = {
      nomor_surat: validated.nomorSurat,
      keperluan: validated.keperluan,
      tanggal_surat: formattedTanggalSurat,
      nama: resident.nama,
      nik: resident.nik,
      tempat_lahir: resident.tempatLahir,
      tanggal_lahir: formattedTanggalLahir,
      jenis_kelamin: resident.jenisKelamin,
      golongan_darah: resident.golonganDarah || '-',
      alamat: resident.alamat,
      rt: resident.rt || '-',
      rw: resident.rw || '-',
      kel_desa: resident.kelDesa,
      kecamatan: resident.kecamatan,
      agama: resident.agama || '-',
      status_perkawinan: resident.statusPerkawinan || '-',
      pekerjaan: resident.pekerjaan || '-',
      kewarganegaraan: resident.kewarganegaraan
    };

    const sanitizedNomorSurat = validated.nomorSurat.replace(/[^a-zA-Z0-9_-]/g, '_');
    const outputFileName = `Surat_${template.kodeSurat}_${sanitizedNomorSurat}_${Date.now()}.docx`;

    // Render document via docxtemplater
    const { filePath } = await generateDocumentFromTemplate(
      template.templateFile,
      templateVariables,
      outputFileName
    );

    // Save record to database (issued_letters)
    const issuedLetter = await prisma.issuedLetter.create({
      data: {
        nomorSurat: validated.nomorSurat,
        residentNik: resident.nik,
        templateId: template.id,
        operatorId: req.user.userId,
        keperluan: validated.keperluan,
        generatedFile: outputFileName
      },
      include: {
        resident: true,
        template: true,
        operator: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    successResponse(res, 'Surat berhasil diterbitkan.', {
      issuedLetter,
      downloadUrl: `/api/letters/download/${outputFileName}`,
      filePath
    });
  } catch (err) {
    next(err);
  }
};

export const downloadGeneratedLetter = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { filename } = req.params;
    // Security check against directory traversal
    const safeFilename = path.basename(filename);
    const filePath = path.resolve(process.cwd(), 'generated', safeFilename);

    if (!fs.existsSync(filePath)) {
      errorResponse(res, 'File surat tidak ditemukan.', 404);
      return;
    }

    res.download(filePath, safeFilename);
  } catch (err) {
    next(err);
  }
};

export const listIssuedLetters = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
    const skip = (page - 1) * limit;

    const [total, letters] = await Promise.all([
      prisma.issuedLetter.count(),
      prisma.issuedLetter.findMany({
        skip,
        take: limit,
        orderBy: { issuedAt: 'desc' },
        include: {
          resident: true,
          template: true,
          operator: {
            select: { id: true, name: true, email: true }
          }
        }
      })
    ]);

    successResponse(res, 'Riwayat surat berhasil dimuat.', {
      letters,
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
