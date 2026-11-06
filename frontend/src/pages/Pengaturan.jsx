import { useAuth } from "../hooks/useAuth";

function Pengaturan() {
  const { user } = useAuth();

  return (
    <div className="min-h-full -m-6 bg-slate-50 px-6 py-8">
      <div className="mx-auto">
        <div className="mb-8">
          <div className="mb-1 flex items-center gap-2 text-sm">
            <span className="text-slate-500">Dashboard</span>
            <span className="text-slate-500">/</span>
            <span className="font-medium text-emerald-600">
              Pengaturan Desa
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-800">
            Pengaturan Desa
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Informasi akun yang sedang digunakan.
          </p>
        </div>

        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Edit profil, ganti password, pengaturan desa, dan logo belum tersedia
          di backend. Halaman ini menampilkan data akun secara read-only.
        </div>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-6 py-5">
            <h3 className="font-semibold text-slate-800">Profil Admin</h3>
            <p className="mt-1 text-sm text-slate-500">
              Informasi akun admin yang sedang digunakan.
            </p>
          </div>

          <dl className="divide-y divide-slate-100">
            <div className="grid grid-cols-1 gap-1 px-6 py-4 sm:grid-cols-3">
              <dt className="text-sm text-slate-500">Nama</dt>
              <dd className="text-sm font-medium text-slate-800 sm:col-span-2">
                {user?.name || "-"}
              </dd>
            </div>

            <div className="grid grid-cols-1 gap-1 px-6 py-4 sm:grid-cols-3">
              <dt className="text-sm text-slate-500">Email</dt>
              <dd className="text-sm font-medium text-slate-800 sm:col-span-2">
                {user?.email || "-"}
              </dd>
            </div>

            <div className="grid grid-cols-1 gap-1 px-6 py-4 sm:grid-cols-3">
              <dt className="text-sm text-slate-500">Role</dt>
              <dd className="text-sm font-medium text-slate-800 sm:col-span-2">
                {user?.role || "-"}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}

export default Pengaturan;
