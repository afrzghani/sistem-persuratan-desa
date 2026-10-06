import { Link } from "react-router-dom";
import { Mail, Clock, CircleCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";
import assetOrg from "../assets/assetorg.png";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


function Dashboard() {
  const [selectedYear, setSelectedYear] = useState(
    String(new Date().getFullYear())
  );

  const [dashboard, setDashboard] = useState(null);
  const [tahunTersedia, setTahunTersedia] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboard(selectedYear);

        setDashboard(data);

        if (data.tahunTersedia) {
          setTahunTersedia(data.tahunTersedia);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [selectedYear]);
    if (loading && !dashboard) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-slate-500">
          Memuat dashboard...
        </p>
      </div>
    );
  }

  if (error && !dashboard) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-700">
          Gagal memuat dashboard
        </h2>

        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex min-h-48 items-center justify-between px-8 py-6">
          <div>
            <h2 className="text-3xl font-bold text-emerald-600">
              Selamat datang di Sapa Desa!
            </h2>

            <p className="mt-3 max-w-xl text-slate-500">
              Kelola administrasi dan pelayanan desa dengan <br />
              lebih mudah dalam satu platform.
            </p>
          </div>

          {/* Ilustrasi bisa ditambahkan di sini */}
          <div className="hidden md:flex w-1/3 items-end justify-end">
            <img
              src={assetOrg}
              alt="Ilustrasi Dashboard"
              className="w-44 lg:w-52 xl:w-60 h-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* Aksi Cepat + Statistik */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Aksi Cepat */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">
            Aksi Cepat
          </h2>

          <div className="grid grid-cols-1 gap-4">
            <Link
              to="/upload"
              className="rounded-lg border border-slate-200 p-5 transition hover:border-emerald-300 hover:bg-emerald-50/30"
            >
              <h3 className="font-semibold text-emerald-600">Buat Surat</h3>

              <p className="mt-1 text-sm text-slate-500">
                Buat surat baru berdasarkan data warga.
              </p>
            </Link>

            <Link
              to="/warga"
              className="rounded-lg border border-slate-200 p-5 transition hover:border-emerald-300 hover:bg-emerald-50/30"
            >
              <h3 className="font-semibold text-emerald-600">Data Warga</h3>

              <p className="mt-1 text-sm text-slate-500">
                Lihat dan kelola data warga desa.
              </p>
            </Link>
          </div>
        </div>

        {/* Statistik */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">
            Statistik
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Total Surat */}
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
              <div>
                <p className="text-sm text-slate-500">Total Surat</p>

                <p className="mt-2 text-2xl font-bold text-slate-800">
                  {dashboard.totalSurat}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                <Mail className="h-5 w-5 text-emerald-600" />
              </div>
            </div>

            {/* Surat Diproses */}
            <div className="flex items-center justify-between rounded-lg bg-amber-50 p-4">
              <div>
                <p className="text-sm text-slate-500">Surat Diproses</p>

                <p className="mt-2 text-2xl font-bold text-amber-500">
                  {dashboard.suratDiproses}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/70">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
            </div>

            {/* Surat Selesai */}
            <div className="flex items-center justify-between rounded-lg bg-emerald-50 p-4">
              <div>
                <p className="text-sm text-slate-500">Surat Selesai</p>

                <p className="mt-2 text-2xl font-bold text-emerald-600">
                  {dashboard.suratSelesai}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/70">
                <CircleCheck className="h-5 w-5 text-emerald-600" />
              </div>
            </div>

            {/* Total Warga */}
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
              <div>
                <p className="text-sm text-slate-500">Total Warga</p>

                <p className="mt-2 text-2xl font-bold text-slate-800">
                  {dashboard.totalWarga}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Surat Terbaru */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Surat Terbaru
          </h2>

          <Link
            to="/riwayat"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            Lihat Semua
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-y border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600">
                  Nomor Surat
                </th>

                <th className="px-6 py-4 font-semibold text-slate-600">
                  Jenis Surat
                </th>

                <th className="px-6 py-4 font-semibold text-slate-600">
                  Pemohon
                </th>

                <th className="px-6 py-4 font-semibold text-slate-600">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {dashboard.suratTerbaru.map((surat) => (
                <tr
                  key={surat.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-6 py-4 text-slate-700">
                    {surat.nomorSurat}
                  </td>

                  <td className="px-6 py-4 text-slate-700">
                    {surat.jenisSurat}
                  </td>

                  <td className="px-6 py-4 text-slate-700">{surat.pemohon}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        surat.status === "Selesai"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {surat.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Grafik Surat Selesai */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Surat Selesai
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Jumlah surat yang selesai setiap bulan
            </p>
          </div>

          {/* Pilih Tahun */}
<select
  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500"
  value={selectedYear}
  onChange={(e) => setSelectedYear(e.target.value)}
>
  {tahunTersedia.map((tahun) => (
    <option key={tahun} value={tahun}>
      {tahun}
    </option>
  ))}
</select>
        </div>

        {/* Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dashboard.suratSelesaiBulanan}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis dataKey="bulan" tickLine={false} axisLine={false} />

              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="jumlah"
                stroke="#059669"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
