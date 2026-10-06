import AdminTableRow from "./AdminTableRow";

function AdminTable({ admins, isLoading, onDeactivate }) {
  return (
    <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800">
          Daftar Admin
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          {admins.length} akun admin terdaftar
        </p>
      </div>

      {isLoading ? (
        <div className="px-6 py-12 text-center text-sm text-slate-500">
          Memuat data admin...
        </div>
      ) : admins.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-slate-500">
          Belum ada data admin.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left font-medium text-slate-500 px-6 py-4">
                  Nama
                </th>

                <th className="text-left font-medium text-slate-500 px-6 py-4">
                  Email
                </th>

                <th className="text-left font-medium text-slate-500 px-6 py-4">
                  Status
                </th>

                <th className="text-right font-medium text-slate-500 px-6 py-4">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {admins.map((admin) => (
                <AdminTableRow
                  key={admin.id}
                  admin={admin}
                  onDeactivate={onDeactivate}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default AdminTable;