function AdminStats({ admins }) {
  const totalAdmin = admins.length;

  const adminAktif = admins.filter(
    (admin) => admin.status === "Aktif"
  ).length;

  const adminNonaktif = admins.filter(
    (admin) => admin.status === "Nonaktif"
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <p className="text-sm text-slate-500">Total Admin</p>
        <p className="text-3xl font-bold text-slate-800 mt-2">
          {totalAdmin}
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <p className="text-sm text-slate-500">Admin Aktif</p>
        <p className="text-3xl font-bold text-emerald-600 mt-2">
          {adminAktif}
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <p className="text-sm text-slate-500">Admin Nonaktif</p>
        <p className="text-3xl font-bold text-red-500 mt-2">
          {adminNonaktif}
        </p>
      </div>
    </div>
  );
}

export default AdminStats;