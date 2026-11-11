import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data for Sistem Pelayanan Desa Gempolkurung...');

  // 1. Seed Admin/Operator
  const hashedPassword = await bcrypt.hash('password123', 10);
  const operator = await prisma.user.upsert({
    where: { email: 'operator@gempolkurung.desa.id' },
    update: {},
    create: {
      email: 'operator@gempolkurung.desa.id',
      password: hashedPassword,
      name: 'Operator Pelayanan Desa',
      role: 'OPERATOR'
    }
  });
  console.log('✔ Operator seeded:', operator.email);

  // 2. Seed Desa Settings
  const desaSettings = await prisma.desaSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      namaKepalaDesa: 'H. SUBANDI',
      jabatan: 'Kepala Desa'
    }
  });
  console.log('✔ Desa settings seeded:', desaSettings.namaKepalaDesa);

  // 3. Seed Letter Templates
  const templates = [
    {
      kodeSurat: 'SKTM',
      namaSurat: 'Surat Keterangan Tidak Mampu',
      templateFile: 'JA_SURAT KETERANGAN MISKIN KIS.docx',
      deskripsi: 'Surat keterangan untuk keperluan beasiswa, keringanan biaya RS, atau bantuan sosial.'
    },
    {
      kodeSurat: 'SKU',
      namaSurat: 'Surat Keterangan Usaha',
      templateFile: 'NA_SURAT KETERANGAN USAHA.docx',
      deskripsi: 'Surat keterangan kepemilikan usaha mikro/kecil warga desa.'
    },
    {
      kodeSurat: 'SKD',
      namaSurat: 'Surat Keterangan Domisili',
      templateFile: 'DA_SURAT KETERANGAN DOMISILI WARGA.docx',
      deskripsi: 'Surat keterangan tempat tinggal / domisili warga di Desa Gempolkurung.'
    },
    {
      kodeSurat: 'SKBM',
      namaSurat: 'Surat Keterangan Belum Menikah',
      templateFile: 'C_SURAT KETERANGAN BELUM MENIKAH.docx',
      deskripsi: 'Surat keterangan belum pernah menikah (jejaka / perawan) warga desa.'
    },
    {
      kodeSurat: 'FPBK',
      namaSurat: 'Form Permohonan Bantuan KIS',
      templateFile: 'AA_FORM PERMOHONAN BANTUAN KIS.docx',
      deskripsi: 'Formulir permohonan bantuan Kartu Indonesia Sehat (KIS).'
    },
    {
      kodeSurat: 'SPMK',
      namaSurat: 'Surat Pernyataan Miskin KIS',
      templateFile: 'AB_SURAT PERNYATAAN MISKIN KIS.docx',
      deskripsi: 'Surat pernyataan tidak mampu untuk pengajuan KIS.'
    },
    {
      kodeSurat: 'SKBN',
      namaSurat: 'Surat Keterangan Beda Nama',
      templateFile: 'B_SURAT-KETERANGAN-BEDA-NAMA.docx',
      deskripsi: 'Surat keterangan perbedaan data nama pada dokumen kependudukan.'
    },
    {
      kodeSurat: 'SKDL',
      namaSurat: 'Surat Keterangan Domisili Lembaga',
      templateFile: 'DB_SURAT KETERANGAN DOMISILI LEMBAGA.docx',
      deskripsi: 'Surat keterangan domisili untuk lembaga atau organisasi.'
    },
    {
      kodeSurat: 'SKDP',
      namaSurat: 'Surat Keterangan Domisili Perusahaan',
      templateFile: 'DC_SURAT KETERANGAN DOMISILI PERUSAHAAN.docx',
      deskripsi: 'Surat keterangan domisili perusahaan.'
    },
    {
      kodeSurat: 'SKDP2',
      namaSurat: 'Surat Keterangan Domisili Perusahaan (Variasi 2)',
      templateFile: 'EA_SURAT KETERANGAN DOMISILI PERUSAHAAN.docx',
      deskripsi: 'Surat keterangan domisili perusahaan versi kedua.'
    },
    {
      kodeSurat: 'SKDPN',
      namaSurat: 'Surat Keterangan Domisili Perusahaan Akta Notaris',
      templateFile: 'EB_SURAT KETERANGAN DOMISILI PERUSAHAAN AKTA NOTARIS.docx',
      deskripsi: 'Surat keterangan domisili perusahaan dengan akta notaris.'
    },
    {
      kodeSurat: 'SKDS',
      namaSurat: 'Surat Keterangan Domisili Sekolah',
      templateFile: 'F_SURAT KETERANGAN DOMISILI SEKOLAH.docx',
      deskripsi: 'Surat keterangan domisili sekolah.'
    },
    {
      kodeSurat: 'SKDY',
      namaSurat: 'Surat Keterangan Domisili Yayasan',
      templateFile: 'G_SURAT KETERANGAN DOMISILI YAYASAN.docx',
      deskripsi: 'Surat keterangan domisili yayasan.'
    },
    {
      kodeSurat: 'SKJU',
      namaSurat: 'Surat Keterangan Janda Umum',
      templateFile: 'HA_SURAT KETERANGAN JANDA UMUM.docx',
      deskripsi: 'Surat keterangan janda umum.'
    },
    {
      kodeSurat: 'SKJCM',
      namaSurat: 'Surat Keterangan Janda Cerai Mati',
      templateFile: 'HB_SURAT KETERANGAN JANDA CERAI MATI.docx',
      deskripsi: 'Surat keterangan janda karena cerai mati.'
    },
    {
      kodeSurat: 'SKKK',
      namaSurat: 'Surat Keterangan KK Baru',
      templateFile: 'I_SURAT KETERANGAN KK BARU.docx',
      deskripsi: 'Surat keterangan pembuatan Kartu Keluarga baru.'
    },
    {
      kodeSurat: 'SPMK2',
      namaSurat: 'Surat Pernyataan Miskin KIS (RT/RW)',
      templateFile: 'JB_SURAT PERNYATAAN MISKIN KIS.docx',
      deskripsi: 'Surat pernyataan miskin KIS dengan pengesahan RT/RW.'
    },
    {
      kodeSurat: 'SKKU',
      namaSurat: 'Surat Keterangan Keringanan UKT',
      templateFile: 'KA_SURAT KETERANGAN KERINGANAN UKT.docx',
      deskripsi: 'Surat keterangan keringanan Uang Kuliah Tunggal (UKT).'
    },
    {
      kodeSurat: 'SKTMS',
      namaSurat: 'Surat Keterangan Tidak Mampu Sekolah',
      templateFile: 'KB_SURAT KETERANGAN TIDAK MAMPU SEKOLAH.docx',
      deskripsi: 'Surat keterangan tidak mampu untuk keperluan sekolah.'
    },
    {
      kodeSurat: 'SKNP',
      namaSurat: 'Surat Keterangan Nadzir Perseorangan',
      templateFile: 'LA_SURAT KETERANGAN NADZIR PERSEORANGAN.docx',
      deskripsi: 'Surat keterangan nadzir perseorangan.'
    },
    {
      kodeSurat: 'SKPBU',
      namaSurat: 'Surat Keterangan Penghasilan Banding UKT',
      templateFile: 'LB_SURAT KETERANGAN PENGHASILAN BANDING UKT.docx',
      deskripsi: 'Surat keterangan penghasilan untuk banding UKT.'
    },
    {
      kodeSurat: 'SPL',
      namaSurat: 'Surat Pengesahan Lembaga',
      templateFile: 'LC_PENGESAHAN LEMBAGA.docx',
      deskripsi: 'Surat pengesahan lembaga.'
    },
    {
      kodeSurat: 'SKJMC',
      namaSurat: 'Surat Keterangan Janda Mati CPNS',
      templateFile: 'LD_SURAT KETERANGAN JANDA MATI CPNS.docx',
      deskripsi: 'Surat keterangan janda mati untuk keperluan CPNS.'
    },
    {
      kodeSurat: 'SKBD',
      namaSurat: 'Surat Keterangan Bersih Diri',
      templateFile: 'LE_SURAT KETERANGAN BERSIH DIRI.docx',
      deskripsi: 'Surat keterangan bersih diri.'
    },
    {
      kodeSurat: 'SKUD',
      namaSurat: 'Surat Keterangan Usaha Domisili',
      templateFile: 'M_SURAT-KETERANGAN-USAHA-DOMISILI.docx',
      deskripsi: 'Surat keterangan usaha dan domisili.'
    },
    {
      kodeSurat: 'SKDU',
      namaSurat: 'Surat Keterangan Domisili Usaha',
      templateFile: 'NB_SURAT KETERANGAN DOMISILI USAHA.docx',
      deskripsi: 'Surat keterangan domisili usaha.'
    },
    {
      kodeSurat: 'SKW',
      namaSurat: 'Surat Keterangan Wali',
      templateFile: 'O_SURAT-KETERANGAN-WALI.docx',
      deskripsi: 'Surat keterangan wali.'
    }
  ];

  for (const t of templates) {
    const templateRecord = await prisma.letterTemplate.upsert({
      where: { kodeSurat: t.kodeSurat },
      update: t,
      create: t
    });
    console.log(`✔ Template seeded: ${templateRecord.kodeSurat} - ${templateRecord.namaSurat}`);
  }

  // 4. Seed Sample Resident
  const sampleResident = await prisma.resident.upsert({
    where: { nik: '3515081234560001' },
    update: {},
    create: {
      nik: '3515081234560001',
      nama: 'Budi Santoso',
      tempatLahir: 'Gresik',
      tanggalLahir: new Date('1990-05-15'),
      jenisKelamin: 'LAKI-LAKI',
      golonganDarah: 'O',
      alamat: 'Jl. Melati No. 12 RT 002 RW 001',
      rt: '002',
      rw: '001',
      kelDesa: 'Gempolkurung',
      kecamatan: 'Menganti',
      kabupaten: 'Gresik',
      agama: 'Islam',
      statusPerkawinan: 'Kawin',
      pekerjaan: 'Wiraswasta',
      kewarganegaraan: 'WNI'
    }
  });
  console.log('✔ Sample resident seeded:', sampleResident.nama, `(${sampleResident.nik})`);

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
