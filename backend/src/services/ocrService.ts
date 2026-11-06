import { ENV } from '../config/env.js';
import { OcrExtractedData } from '../types/index.js';

export const sendImageToOcrService = async (
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<OcrExtractedData> => {
  const blob = new Blob([fileBuffer], { type: mimeType });
  const formData = new FormData();
  formData.append('file', blob, fileName);

  try {
    const headers: Record<string, string> = {};
    if (ENV.OCR_API_KEY) {
      headers['X-API-Key'] = ENV.OCR_API_KEY;
    }

    const response = await fetch(ENV.OCR_SERVICE_URL, {
      method: 'POST',
      headers,
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OCR Service Error (${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as {
      fields?: Record<string, any>;
      perlu_review?: boolean;
      [key: string]: any;
    };

    const fields = data.fields || data;

    // Map response from OCR service to standardized OcrExtractedData
    // Adaptable to the python OCR output schema
    return {
      nik: fields.nik || null,
      nama: fields.nama || null,
      tempatLahir: fields.tempat_lahir || fields.tempatLahir || null,
      tanggalLahir: fields.tanggal_lahir || fields.tanggalLahir || null,
      jenisKelamin: fields.jenis_kelamin || fields.jenisKelamin || null,
      golonganDarah: fields.gol_darah || fields.golongan_darah || fields.golonganDarah || null,
      alamat: fields.alamat || null,
      rt: fields.rt || null,
      rw: fields.rw || null,
      kelDesa: fields.kel_desa || fields.kelDesa || null,
      kecamatan: fields.kecamatan || null,
      kotaKab: fields.kota_kab || fields.kotaKab || null,
      provinsi: fields.provinsi || null,
      agama: fields.agama || null,
      statusPerkawinan: fields.perkawinan || fields.status_perkawinan || fields.statusPerkawinan || null,
      pekerjaan: fields.pekerjaan || null,
      kewarganegaraan: fields.kewarganegaraan || 'WNI',
      berlaku: fields.berlaku || null,
      perluReview: data.perlu_review ?? true,
      rawResponse: data
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal menghubungi servis OCR Python';
    throw new Error(msg);
  }
};
