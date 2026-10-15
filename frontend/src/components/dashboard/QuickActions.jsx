import { Link } from "react-router-dom";

function QuickActions() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-800">
        Aksi Cepat
      </h2>

      <div className="grid grid-cols-1 gap-4">
        <Link
          to="/upload"
          className="rounded-lg border border-slate-200 p-5 transition hover:border-emerald-300 hover:bg-emerald-50/30"
        >
          <h3 className="font-semibold text-emerald-600">
            Buat Surat
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Buat surat baru berdasarkan data warga.
          </p>
        </Link>

        <Link
          to="/warga"
          className="rounded-lg border border-slate-200 p-5 transition hover:border-emerald-300 hover:bg-emerald-50/30"
        >
          <h3 className="font-semibold text-emerald-600">
            Data Warga
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Lihat dan kelola data warga desa.
          </p>
        </Link>
      </div>
    </div>
  );
}

export default QuickActions;