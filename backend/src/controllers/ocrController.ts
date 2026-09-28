import { Request, Response, NextFunction } from 'express';
import { sendImageToOcrService } from '../services/ocrService.js';
import { prisma } from '../config/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const processKtpOcr = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      errorResponse(res, 'File KTP belum diunggah.', 400);
      return;
    }

    // Call Python FastAPI OCR service
    const extractedData = await sendImageToOcrService(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    // If NIK was extracted, check if resident is already registered in DB
    let isExistingResident = false;
    let existingProfile = null;

    if (extractedData.nik && extractedData.nik.length === 16) {
      existingProfile = await prisma.resident.findUnique({
        where: { nik: extractedData.nik }
      });
      if (existingProfile) {
        isExistingResident = true;
      }
    }

    successResponse(res, 'Ekstraksi OCR KTP berhasil.', {
      extracted: extractedData,
      isExistingResident,
      existingProfile
    });
  } catch (err) {
    next(err);
  }
};
