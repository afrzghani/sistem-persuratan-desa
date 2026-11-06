import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { successResponse } from '../utils/response.js';

export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const yearQuery = parseInt(req.query.year as string) || new Date().getFullYear();

    const [
      totalSurat,
      totalWarga,
      suratDiproses,
      suratSelesai,
      totalDraft,
      recentLetters
    ] = await Promise.all([
      prisma.letterTemplate.count({ where: { isActive: true } }),
      prisma.resident.count({ where: { deletedAt: null } }),
      prisma.issuedLetter.count({ where: { status: 'Proses' } }),
      prisma.issuedLetter.count({ where: { status: 'Selesai' } }),
      prisma.letterDraft.count({ where: { issuedLetterId: null } }),
      prisma.issuedLetter.findMany({
        take: 5,
        orderBy: { issuedAt: 'desc' },
        include: {
          resident: true,
          template: true
        }
      })
    ]);

    const suratTerbaru = recentLetters.map((letter) => ({
      id: letter.id,
      nomorSurat: letter.nomorSurat,
      jenisSurat: letter.template.namaSurat,
      pemohon: letter.resident.nama,
      status: letter.status
    }));

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];

    const startOfYear = new Date(yearQuery, 0, 1);
    const endOfYear = new Date(yearQuery + 1, 0, 1);

    const yearLetters = await prisma.issuedLetter.findMany({
      where: {
        issuedAt: {
          gte: startOfYear,
          lt: endOfYear
        }
      },
      select: { issuedAt: true }
    });

    const monthlyCounts = new Array(12).fill(0);
    yearLetters.forEach((l) => {
      const m = new Date(l.issuedAt).getMonth();
      monthlyCounts[m]++;
    });

    const suratSelesaiBulanan = months.map((bulan, idx) => ({
      bulan,
      jumlah: monthlyCounts[idx]
    }));

    const currentYear = new Date().getFullYear();
    const tahunTersedia = [
      String(currentYear - 2),
      String(currentYear - 1),
      String(currentYear)
    ];

    const data = {
      totalSurat,
      suratDiproses: suratDiproses + totalDraft,
      suratSelesai,
      totalWarga,
      tahunTersedia,
      suratTerbaru,
      suratSelesaiBulanan
    };

    successResponse(res, 'Data dashboard berhasil dimuat', data);
  } catch (err) {
    next(err);
  }
};
