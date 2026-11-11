import { Response, NextFunction } from 'express';
import { z } from 'zod';
import path from 'path';
import fs from 'fs';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { AuthenticatedRequest } from '../types/index.js';
import { generateDocumentFromTemplate, LetterTemplateVariables } from '../services/docxtemplaterService.js';
import { getOrCreateDesaSettings } from '../services/desaSettingsService.js';
import { successResponse, errorResponse } from '../utils/response.js';

const DESA_IDENTITY = {
  namaDesa: 'Gempolkurung',
  kecamatan: 'Menganti',
  kabupaten: 'Gresik',
  alamatDesa: 'Jl. Desa Gempolkurung No. 332A, Menganti, Gresik 61174'
};

export const generateLetterSchema = z.object({
  residentNik: z.string().length(16, 'NIK harus terdiri dari 16 digit'),
  templateId: z.number().int().positive(),
  nomorSurat: z.string().min(1, 'Nomor surat wajib diisi'),
  keperluan: z.string().min(1, 'Keperluan surat wajib diisi'),
  keterangan: z.string().optional(),
  customData: z.record(z.unknown()).optional()
});

export const updateLetterStatusSchema = z.object({
  status: z.enum(['Proses', 'Selesai', 'Dibatalkan'])
});

export const saveDraftSchema = z.object({
  templateId: z.number().int().positive().nullable().optional(),
  step: z.number().int().min(1).max(3).optional(),
  formData: z.record(z.unknown()).optional()
});

export const createTemplateSchema = z.object({
  namaSurat: z.string().trim().min(3, 'Nama jenis surat minimal 3 karakter').max(150),
  kodeSurat: z
    .string()
    .trim()
    .min(1, 'Kode surat wajib diisi')
    .max(20, 'Kode surat maksimal 20 karakter')
    .regex(/^[A-Za-z0-9_-]+$/, 'Kode surat hanya boleh berisi huruf, angka, strip, atau garis bawah'),
  deskripsi: z.string().trim().max(500).optional()
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

export const createTemplate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let savedFilePath: string | null = null;

  try {
    if (!req.file) {
      errorResponse(res, 'File template wajib diunggah.', 400);
      return;
    }

    const validated = createTemplateSchema.parse(req.body);
    const kodeSurat = validated.kodeSurat.toUpperCase();

    const existingTemplate = await prisma.letterTemplate.findUnique({
      where: { kodeSurat }
    });

    if (existingTemplate) {
      errorResponse(res, `Kode surat ${kodeSurat} sudah digunakan.`, 409);
      return;
    }

    const templatesDir = path.resolve(process.cwd(), 'templates');
    fs.mkdirSync(templatesDir, { recursive: true });

    const originalBase = path.basename(
      req.file.originalname,
      path.extname(req.file.originalname)
    );
    const safeBase =
      originalBase.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 60) || 'template';
    const fileName = `${Date.now()}_${Math.round(Math.random() * 1e6)}_${safeBase}.docx`;
    savedFilePath = path.join(templatesDir, fileName);

    fs.writeFileSync(savedFilePath, req.file.buffer);

    const template = await prisma.letterTemplate.create({
      data: {
        kodeSurat,
        namaSurat: validated.namaSurat,
        templateFile: fileName,
        deskripsi: validated.deskripsi || null
      }
    });

    successResponse(res, 'Template surat berhasil ditambahkan.', template, 201);
  } catch (err) {
    if (savedFilePath && fs.existsSync(savedFilePath)) {
      fs.unlinkSync(savedFilePath);
    }
    next(err);
  }
};

export const getTemplateFile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const templateId = Number(req.params.id);

    if (!Number.isInteger(templateId) || templateId <= 0) {
      errorResponse(res, 'ID template tidak valid.', 400);
      return;
    }

    const template = await prisma.letterTemplate.findUnique({
      where: { id: templateId }
    });

    if (!template) {
      errorResponse(res, 'Template surat tidak ditemukan.', 404);
      return;
    }

    const safeFileName = path.basename(template.templateFile);
    const filePath = path.resolve(process.cwd(), 'templates', safeFileName);

    if (!fs.existsSync(filePath)) {
      errorResponse(res, 'File template tidak ditemukan di server.', 404);
      return;
    }

    if (req.query.download === '1' || req.query.download === 'true') {
      res.download(filePath, safeFileName);
      return;
    }

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    res.setHeader('Content-Disposition', `inline; filename="${safeFileName}"`);
    res.sendFile(filePath);
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

    const resident = await prisma.resident.findFirst({
      where: { nik: validated.residentNik, deletedAt: null }
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

    const desaSettings = await getOrCreateDesaSettings();

    const nomorSuratTerpakai = await prisma.issuedLetter.findUnique({
      where: { nomorSurat: validated.nomorSurat },
      select: { id: true }
    });

    if (nomorSuratTerpakai) {
      errorResponse(
        res,
        'Nomor surat sudah pernah digunakan. Silakan gunakan nomor surat lain.',
        409
      );
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

    const fullAddress = resident.rt && resident.rw
      ? `${resident.alamat} RT ${resident.rt} RW ${resident.rw}`
      : resident.alamat;

    const templateVariables: LetterTemplateVariables = {
      nomor_surat: validated.nomorSurat,
      no_surat: validated.nomorSurat,
      keperluan: validated.keperluan,
      keterangan: validated.keterangan || `orang tersebut di atas benar-benar penduduk Desa ${DESA_IDENTITY.namaDesa} Kecamatan ${DESA_IDENTITY.kecamatan} Kabupaten ${DESA_IDENTITY.kabupaten} dan sepanjang pengetahuan kami hingga saat ini belum pernah menikah (Jejaka / Perawan).`,
      tanggal_surat: formattedTanggalSurat,
      nama: resident.nama,
      nik: resident.nik,
      tempat_lahir: resident.tempatLahir,
      tempat: resident.tempatLahir,
      tanggal_lahir: formattedTanggalLahir,
      tanggal: formattedTanggalLahir,
      jenis_kelamin: resident.jenisKelamin,
      kelamin: resident.jenisKelamin,
      golongan_darah: resident.golonganDarah || '-',
      alamat: fullAddress,
      alamat_singkat: resident.alamat,
      rt: resident.rt || '-',
      rw: resident.rw || '-',
      kel_desa: DESA_IDENTITY.namaDesa,
      desa: DESA_IDENTITY.namaDesa,
      kecamatan: DESA_IDENTITY.kecamatan,
      kabupaten: DESA_IDENTITY.kabupaten,
      agama: resident.agama || '-',
      status_perkawinan: resident.statusPerkawinan || '-',
      status_kawin: resident.statusPerkawinan || '-',
      pekerjaan: resident.pekerjaan || '-',
      kewarganegaraan: resident.kewarganegaraan,
      kepala_desa: desaSettings.namaKepalaDesa,
      jabatan_kepala_desa: desaSettings.jabatan,
      alamat_desa: DESA_IDENTITY.alamatDesa,
      ...(template.kodeSurat === 'SKBN'
        ? { jabatan: desaSettings.jabatan }
        : {}),

      No_Surat: validated.nomorSurat,
      Nomor_Surat: validated.nomorSurat,
      Keperluan: validated.keperluan,
      Keterangan: validated.keterangan || `orang tersebut di atas benar-benar penduduk Desa ${DESA_IDENTITY.namaDesa} Kecamatan ${DESA_IDENTITY.kecamatan} Kabupaten ${DESA_IDENTITY.kabupaten} dan sepanjang pengetahuan kami hingga saat ini belum pernah menikah (Jejaka / Perawan).`,
      Tanggal_Surat: formattedTanggalSurat,
      Nama: resident.nama,
      NIK: resident.nik,
      Tempat_Lahir: resident.tempatLahir,
      Tempat: resident.tempatLahir,
      Tanggal_Lahir: formattedTanggalLahir,
      Tanggal: formattedTanggalLahir,
      Jenis_Kelamin: resident.jenisKelamin,
      Kelamin: resident.jenisKelamin,
      Golongan_Darah: resident.golonganDarah || '-',
      Alamat: fullAddress,
      RT: resident.rt || '-',
      RW: resident.rw || '-',
      Kel_Desa: DESA_IDENTITY.namaDesa,
      Desa: DESA_IDENTITY.namaDesa,
      Kecamatan: DESA_IDENTITY.kecamatan,
      Kabupaten: DESA_IDENTITY.kabupaten,
      Agama: resident.agama || '-',
      Status_Perkawinan: resident.statusPerkawinan || '-',
      Status_Kawin: resident.statusPerkawinan || '-',
      Pekerjaan: resident.pekerjaan || '-',
      Kewarganegaraan: resident.kewarganegaraan,
      Kepala_Desa: desaSettings.namaKepalaDesa,
      Jabatan_Kepala_Desa: desaSettings.jabatan,
      Alamat_Desa: DESA_IDENTITY.alamatDesa,
      ...(template.kodeSurat === 'SKBN'
        ? { Jabatan: desaSettings.jabatan }
        : {}),

      ...(validated.customData || {})
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
    let issuedLetter;
    try {
      issuedLetter = await prisma.issuedLetter.create({
        data: {
          nomorSurat: validated.nomorSurat,
          residentNik: resident.nik,
          templateId: template.id,
          operatorId: req.user.userId,
          keperluan: validated.keperluan,
          generatedFile: outputFileName,
          status: 'Proses'
        },
        include: {
          resident: true,
          template: true,
          operator: {
            select: { id: true, name: true, email: true }
          }
        }
      });
    } catch (err) {
      await fs.promises.unlink(filePath).catch(() => undefined);

      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        errorResponse(
          res,
          'Nomor surat sudah pernah digunakan. Silakan gunakan nomor surat lain.',
          409
        );
        return;
      }

      throw err;
    }

    await prisma.letterDraft
      .upsert({
        where: { operatorId: req.user.userId },
        update: {
          templateId: template.id,
          step: 3,
          issuedLetterId: issuedLetter.id
        },
        create: {
          operatorId: req.user.userId,
          templateId: template.id,
          step: 3,
          issuedLetterId: issuedLetter.id,
          formData: {
            nomorSurat: validated.nomorSurat,
            keperluan: validated.keperluan,
            keterangan: validated.keterangan ?? ''
          }
        }
      })
      .catch(() => undefined);

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

    const statusQuery = req.query.status as string | undefined;
    const where = statusQuery && statusQuery !== 'Semua'
      ? { status: statusQuery }
      : {};

    const [total, letters] = await Promise.all([
      prisma.issuedLetter.count({ where }),
      prisma.issuedLetter.findMany({
        where,
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

export const updateLetterStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      errorResponse(res, 'Tidak terotentikasi.', 401);
      return;
    }

    const letterId = Number(req.params.id);

    if (!Number.isInteger(letterId) || letterId <= 0) {
      errorResponse(res, 'ID surat tidak valid.', 400);
      return;
    }

    const validated = updateLetterStatusSchema.parse(req.body);

    const existingLetter = await prisma.issuedLetter.findUnique({
      where: { id: letterId }
    });

    if (!existingLetter) {
      errorResponse(res, 'Surat tidak ditemukan.', 404);
      return;
    }

    const issuedLetter = await prisma.issuedLetter.update({
      where: { id: letterId },
      data: { status: validated.status },
      include: {
        resident: true,
        template: true,
        operator: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (validated.status === 'Selesai' || validated.status === 'Dibatalkan') {
      await prisma.letterDraft
        .deleteMany({ where: { issuedLetterId: letterId } })
        .catch(() => undefined);
    }

    successResponse(
      res,
      `Status surat berhasil diperbarui menjadi ${validated.status}.`,
      { issuedLetter }
    );
  } catch (err) {
    next(err);
  }
};

export const getDraft = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      errorResponse(res, 'Tidak terotentikasi.', 401);
      return;
    }

    const draft = await prisma.letterDraft.findUnique({
      where: { operatorId: req.user.userId },
      include: {
        template: true,
        issuedLetter: {
          include: { template: true, resident: true }
        }
      }
    });

    successResponse(
      res,
      draft ? 'Draft surat berhasil dimuat.' : 'Tidak ada draft surat.',
      draft
    );
  } catch (err) {
    next(err);
  }
};

export const saveDraft = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      errorResponse(res, 'Tidak terotentikasi.', 401);
      return;
    }

    const validated = saveDraftSchema.parse(req.body);

    const draftData = {
      templateId: validated.templateId ?? null,
      step: validated.step ?? 2,
      ...(validated.formData !== undefined
        ? { formData: validated.formData as Prisma.InputJsonValue }
        : {})
    };

    const draft = await prisma.letterDraft.upsert({
      where: { operatorId: req.user.userId },
      create: {
        operatorId: req.user.userId,
        ...draftData
      },
      update: draftData,
      include: { template: true }
    });

    successResponse(res, 'Draft surat berhasil disimpan.', draft);
  } catch (err) {
    next(err);
  }
};

export const deleteDraft = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      errorResponse(res, 'Tidak terotentikasi.', 401);
      return;
    }

    const result = await prisma.letterDraft.deleteMany({
      where: { operatorId: req.user.userId }
    });

    successResponse(res, 'Draft surat berhasil dihapus.', {
      deleted: result.count
    });
  } catch (err) {
    next(err);
  }
};

export const listDrafts = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const drafts = await prisma.letterDraft.findMany({
      where: { issuedLetterId: null },
      orderBy: { updatedAt: 'desc' },
      include: {
        template: true,
        operator: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    successResponse(res, 'Daftar draft surat berhasil dimuat.', drafts);
  } catch (err) {
    next(err);
  }
};
