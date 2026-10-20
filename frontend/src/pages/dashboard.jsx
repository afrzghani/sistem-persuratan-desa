
import { useEffect, useMemo, useState } from "react";

import WelcomeCard from "../components/dashboard/WelcomeCard";
import QuickActions from "../components/dashboard/QuickActions";
import DashboardStats from "../components/dashboard/DashboardStats";
import RecentLetters from "../components/dashboard/RecentLetters";
import CompletedLettersChart from "../components/dashboard/CompletedLettersChart";

import { getRiwayatSurat } from "../services/templateService";

const namaBulan = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

function Dashboard() {
  const tahunSekarang = new Date().getFullYear();

  const [selectedYear, setSelectedYear] = useState(
    String(tahunSekarang)
  );
  const [riwayatSurat, setRiwayatSurat] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboard() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getRiwayatSurat();

        if (isMounted) {
          setRiwayatSurat(data);
        }
      } catch (fetchError) {
        console.error("Gagal mengambil data dashboard:", fetchError);

        if (isMounted) {
          setError(
            fetchError.message || "Gagal mengambil data dari server."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const dashboard = useMemo(() => {
    const suratSelesai = riwayatSurat.filter(
      (surat) => surat.status?.toLowerCase() === "selesai"
    );

    const suratDiproses = riwayatSurat.filter(
      (surat) => surat.status?.toLowerCase() === "diproses"
    );

    return {
      totalSurat: riwayatSurat.length,
      suratDiproses: suratDiproses.length,
      suratSelesai: suratSelesai.length,
      totalWarga: null,
    };
  }, [riwayatSurat]);

  const suratTerbaru = useMemo(() => {
    return [...riwayatSurat]
      .sort(
        (a, b) =>
          new Date(b.tanggal).getTime() -
          new Date(a.tanggal).getTime()
      )
      .slice(0, 5);
  }, [riwayatSurat]);

  const tahunTersedia = useMemo(() => {
    const tahun = new Set([String(tahunSekarang)]);

    riwayatSurat.forEach((surat) => {
      if (surat.tanggal) {
        const tanggal = new Date(surat.tanggal);

        if (!Number.isNaN(tanggal.getTime())) {
          tahun.add(String(tanggal.getFullYear()));
        }
      }
    });

    return [...tahun].sort((a, b) => Number(b) - Number(a));
  }, [riwayatSurat, tahunSekarang]);

  const suratSelesaiBulanan = useMemo(() => {
    const jumlahPerBulan = Array(12).fill(0);

    riwayatSurat.forEach((surat) => {
      if (
        surat.status?.toLowerCase() !== "selesai" ||
        !surat.tanggal
      ) {
        return;
      }

      const tanggal = new Date(surat.tanggal);

      if (
        !Number.isNaN(tanggal.getTime()) &&
        String(tanggal.getFullYear()) === selectedYear
      ) {
        jumlahPerBulan[tanggal.getMonth()] += 1;
      }
    });

    return namaBulan.map((bulan, index) => ({
      bulan,
      jumlah: jumlahPerBulan[index],
    }));
  }, [riwayatSurat, selectedYear]);

  return (
    <div className="space-y-8">
      <WelcomeCard />

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="ml-2 font-semibold underline"
          >
            Coba lagi
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <QuickActions />

        <DashboardStats
          dashboard={{
            ...dashboard,
            totalWarga: dashboard.totalWarga ?? "—",
          }}
        />
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          Memuat data dashboard...
        </div>
      ) : (
        <>
          <RecentLetters suratTerbaru={suratTerbaru} />

          <CompletedLettersChart
            data={suratSelesaiBulanan}
            selectedYear={selectedYear}
            tahunTersedia={tahunTersedia}
            onYearChange={setSelectedYear}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;
