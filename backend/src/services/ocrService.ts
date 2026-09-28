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
    const response = await fetch(ENV.OCR_SERVICE_URL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OCR Service Error (${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as Record<string, any>;

    // Map response from OCR service to standardized OcrExtractedData
    // Adaptable to the python OCR output schema
    return {
      nik: data.nik || '',
      nama: data.nama || '',
      tempatLahir: data.tempat_lahir || data.tempatLahir || '',
      tanggalLahir: data.tanggal_lahir || data.tanggalLahir || '',
      jenisKelamin: data.jenis_kelamin || data.jenisKelamin || '',
      golonganDarah: data.golongan_darah || data.golonganDarah || '',
      alamat: data.alamat || '',
      rt: data.rt || '',
      rw: data.rw || '',
      kelDesa: data.kel_desa || data.kelDesa || 'Gempolkurung',
      kecamatan: data.kecamatan || 'Menganti',
      agama: data.agama || '',
      statusPerkawinan: data.status_perkawinan || data.statusPerkawinan || '',
      pekerjaan: data.pekerjaan || '',
      kewarganegaraan: data.kewarganegaraan || 'WNI',
      rawResponse: data
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Gagal menghubungi servis OCR Python';
    throw new Error(msg);
  }
};
