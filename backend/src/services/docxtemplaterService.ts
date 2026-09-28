import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';

export interface LetterTemplateVariables {
  nomor_surat: string;
  keperluan: string;
  tanggal_surat: string;
  nama: string;
  nik: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  golongan_darah?: string;
  alamat: string;
  rt: string;
  rw: string;
  kel_desa: string;
  kecamatan: string;
  agama?: string;
  status_perkawinan?: string;
  pekerjaan?: string;
  kewarganegaraan?: string;
  [key: string]: unknown;
}

export const generateDocumentFromTemplate = async (
  templateFileName: string,
  variables: LetterTemplateVariables,
  outputFileName: string
): Promise<{ filePath: string; buffer: Buffer }> => {
  const templatesDir = path.resolve(process.cwd(), 'templates');
  const generatedDir = path.resolve(process.cwd(), 'generated');

  if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir, { recursive: true });
  }

  const templatePath = path.join(templatesDir, templateFileName);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`File template ${templateFileName} tidak ditemukan di folder templates/`);
  }

  const content = fs.readFileSync(templatePath, 'binary');
  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    nullGetter: () => '-'
  });

  doc.render(variables);

  const buffer = doc.getZip().generate({
    type: 'nodebuffer',
    compression: 'DEFLATE'
  });

  const outputPath = path.join(generatedDir, outputFileName);
  fs.writeFileSync(outputPath, buffer);

  return {
    filePath: outputPath,
    buffer
  };
};
