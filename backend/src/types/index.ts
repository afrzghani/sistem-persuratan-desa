import { Request } from 'express';

export interface AuthUserPayload {
  userId: number;
  email: string;
  role: string;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}

export interface OcrExtractedData {
  nik?: string | null;
  nama?: string | null;
  tempatLahir?: string | null;
  tanggalLahir?: string | null;
  jenisKelamin?: string | null;
  golonganDarah?: string | null;
  alamat?: string | null;
  rt?: string | null;
  rw?: string | null;
  kelDesa?: string | null;
  kecamatan?: string | null;
  kotaKab?: string | null;
  provinsi?: string | null;
  agama?: string | null;
  statusPerkawinan?: string | null;
  pekerjaan?: string | null;
  kewarganegaraan?: string | null;
  berlaku?: string | null;
  perluReview?: boolean;
  rawResponse?: Record<string, unknown>;
}

export interface GenerateLetterPayload {
  residentNik: string;
  templateId: number;
  nomorSurat: string;
  keperluan: string;
  customData?: Record<string, unknown>;
}
