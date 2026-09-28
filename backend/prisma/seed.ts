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

  // 2. Seed Letter Templates
  const templates = [
    {
      kodeSurat: 'SKTM',
      namaSurat: 'Surat Keterangan Tidak Mampu',
      templateFile: 'sktm_template.docx',
      deskripsi: 'Surat keterangan untuk keperluan beasiswa, keringanan biaya RS, atau bantuan sosial.'
    },
    {
      kodeSurat: 'SKU',
      namaSurat: 'Surat Keterangan Usaha',
      templateFile: 'sku_template.docx',
      deskripsi: 'Surat keterangan kepemilikan usaha mikro/kecil warga desa.'
    },
    {
      kodeSurat: 'SKD',
      namaSurat: 'Surat Keterangan Domisili',
      templateFile: 'skd_template.docx',
      deskripsi: 'Surat keterangan tempat tinggal / domisili warga di Desa Gempolkurung.'
    }
  ];

  for (const t of templates) {
    const templateRecord = await prisma.letterTemplate.upsert({
      where: { kodeSurat: t.kodeSurat },
      update: {},
      create: t
    });
    console.log(`✔ Template seeded: ${templateRecord.kodeSurat} - ${templateRecord.namaSurat}`);
  }

  // 3. Seed Sample Resident
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
