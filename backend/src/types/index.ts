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
  nik?: string;
  nama?: string;
  tempatLahir?: string;
  tanggalLahir?: string; // YYYY-MM-DD
  jenisKelamin?: string; // LAKI-LAKI / PEREMPUAN
  golonganDarah?: string;
  alamat?: string;
  rt?: string;
  rw?: string;
  kelDesa?: string;
  kecamatan?: string;
  agama?: string;
  statusPerkawinan?: string;
  pekerjaan?: string;
  kewarganegaraan?: string;
  rawResponse?: Record<string, unknown>;
}

export interface GenerateLetterPayload {
  residentNik: string;
  templateId: number;
  nomorSurat: string;
  keperluan: string;
  customData?: Record<string, unknown>;
}
