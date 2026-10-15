
import { Trash2 } from "lucide-react";
function AdminTableRow({ admin, onDelete }) {
  const adminAktif = admin.status === "Aktif";

  return (
    <tr className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-50/70 text-emerald-700 flex items-center justify-center font-semibold">
            {admin.name?.charAt(0)}
          </div>

          <span className="font-medium text-slate-700">
            {admin.name}
          </span>
        </div>
      </td>

      <td className="px-6 py-4 text-slate-500">
        {admin.email}
      </td>

      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
            adminAktif
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              adminAktif ? "bg-emerald-500" : "bg-red-500"
            }`}
          />
          {admin.status}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="flex justify-end">

<button
  type="button"
  onClick={() => onDelete(admin.id)}
  title="Hapus admin"
  aria-label={`Hapus admin ${admin.name}`}
  className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
>
  <Trash2 className="h-4 w-4" />
</button>

        </div>
      </td>
    </tr>
  );
}

export default AdminTableRow;
