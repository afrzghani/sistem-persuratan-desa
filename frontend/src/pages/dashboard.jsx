import { useState } from "react";

import WelcomeCard from "../components/dashboard/WelcomeCard";
import QuickActions from "../components/dashboard/QuickActions";
import DashboardStats from "../components/dashboard/DashboardStats";
import RecentLetters from "../components/dashboard/RecentLetters";
import CompletedLettersChart from "../components/dashboard/CompletedLettersChart";

const dummyDashboard = {
  totalSurat: 128,
  suratDiproses: 12,
  suratSelesai: 116,
  totalWarga: 2450,

  suratTerbaru: [
    {
      id: 1,
      nomorSurat: "470/001/DS/2026",
      jenisSurat: "Surat Keterangan Domisili",
      pemohon: "Andi Saputra",
      status: "Selesai",
    },
    {
      id: 2,
      nomorSurat: "470/002/DS/2026",
      jenisSurat: "Surat Pengantar",
      pemohon: "Siti Rahmawati",
      status: "Diproses",
    },
    {
      id: 3,
      nomorSurat: "470/003/DS/2026",
      jenisSurat: "Surat Keterangan Usaha",
      pemohon: "Budi Santoso",
      status: "Selesai",
    },
    {
      id: 4,
      nomorSurat: "470/004/DS/2026",
      jenisSurat: "Surat Keterangan Tidak Mampu",
      pemohon: "Dewi Lestari",
      status: "Diproses",
    },
    {
      id: 5,
      nomorSurat: "470/005/DS/2026",
      jenisSurat: "Surat Keterangan Kelahiran",
      pemohon: "Rizky Pratama",
      status: "Selesai",
    },
  ],

  suratSelesaiBulanan: [
    { bulan: "Jan", jumlah: 8 },
    { bulan: "Feb", jumlah: 12 },
    { bulan: "Mar", jumlah: 10 },
    { bulan: "Apr", jumlah: 15 },
    { bulan: "Mei", jumlah: 13 },
    { bulan: "Jun", jumlah: 18 },
    { bulan: "Jul", jumlah: 16 },
    { bulan: "Agu", jumlah: 21 },
    { bulan: "Sep", jumlah: 19 },
    { bulan: "Okt", jumlah: 24 },
    { bulan: "Nov", jumlah: 22 },
    { bulan: "Des", jumlah: 28 },
  ],
};

const dummyTahunTersedia = ["2024", "2025", "2026"];

function Dashboard() {
  const [selectedYear, setSelectedYear] = useState("2026");

  return (
    <div className="space-y-8">
      <WelcomeCard />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <QuickActions />

        <DashboardStats dashboard={dummyDashboard} />
      </div>

      <RecentLetters
        suratTerbaru={dummyDashboard.suratTerbaru}
      />

      <CompletedLettersChart
        data={dummyDashboard.suratSelesaiBulanan}
        selectedYear={selectedYear}
        tahunTersedia={dummyTahunTersedia}
        onYearChange={setSelectedYear}
      />
    </div>
  );
}

export default Dashboard;