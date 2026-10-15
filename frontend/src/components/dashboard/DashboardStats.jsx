import { Mail, Clock, CircleCheck, Users } from "lucide-react";

function DashboardStats({ dashboard }) {
  return (
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
  );
}

export default DashboardStats;