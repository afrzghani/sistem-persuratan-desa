function AdminTableRow({ admin, onDeactivate }) {
  return (
    <tr className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold">
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
        <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {admin.status}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDeactivate(admin.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50"
          >
            Nonaktifkan
          </button>
        </div>
      </td>
    </tr>
  );
}

export default AdminTableRow;