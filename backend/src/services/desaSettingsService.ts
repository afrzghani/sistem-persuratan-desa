import { prisma } from '../config/prisma.js';

export const DEFAULT_DESA_SETTINGS = {
  namaKepalaDesa: 'H. SUBANDI',
  jabatan: 'Kepala Desa'
};

export async function getOrCreateDesaSettings() {
  return prisma.desaSetting.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, ...DEFAULT_DESA_SETTINGS }
  });
}
