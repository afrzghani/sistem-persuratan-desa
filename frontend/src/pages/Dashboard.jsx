import { useEffect, useState } from "react";

import WelcomeCard from "../components/dashboard/WelcomeCard";
import QuickActions from "../components/dashboard/QuickActions";
import DashboardStats from "../components/dashboard/DashboardStats";
import RecentLetters from "../components/dashboard/RecentLetters";
import CompletedLettersChart from "../components/dashboard/CompletedLettersChart";

import { getDashboard } from "../services/dashboardService";

const dashboardAwal = {
  totalSurat: 0,
  suratDiproses: 0,
  suratSelesai: 0,
  totalWarga: 0,
  tahunTersedia: [],
  suratTerbaru: [],
  suratSelesaiBulanan: [],
};

function Dashboard() {
  const tahunSekarang = String(new Date().getFullYear());

  const [selectedYear, setSelectedYear] = useState(tahunSekarang);
  const [dashboard, setDashboard] = useState(dashboardAwal);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboard() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getDashboard(selectedYear);

        if (isMounted) {
          setDashboard({ ...dashboardAwal, ...(data || {}) });
        }
      } catch (fetchError) {
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
  }, [selectedYear]);

  const tahunTersedia =
    dashboard.tahunTersedia?.length > 0
      ? dashboard.tahunTersedia
      : [tahunSekarang];

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
        <DashboardStats dashboard={dashboard} />
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          Memuat data dashboard...
        </div>
      ) : (
        <>
          <RecentLetters suratTerbaru={dashboard.suratTerbaru || []} />

          <CompletedLettersChart
            data={dashboard.suratSelesaiBulanan || []}
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
