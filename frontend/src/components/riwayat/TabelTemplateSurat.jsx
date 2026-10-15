
import { FileText, Eye, Trash2, Files } from "lucide-react";

function TabelTemplateSurat({
  templates,
  setTemplateDipilih,
  hapusTemplate,
}) {
  return (
<div className="overflow-x-auto">
  <table className="w-full table-fixed text-left text-sm">
        <thead className="border-y border-slate-200 bg-emerald-600">
          <tr>
<th className="w-2/5 whitespace-nowrap px-6 py-4 font-semibold text-white">
  Nama Jenis Surat
</th>

<th className="whitespace-nowrap px-6 py-4 font-semibold text-white">
  Nama File
</th>

<th className="w-32 whitespace-nowrap px-4 py-4 text-center font-semibold text-white">
  Aksi
</th>
          </tr>
        </thead>

        <tbody>
          {templates.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center">
                  <Files className="h-8 w-8 text-slate-300" />

                  <p className="mt-3 font-medium text-slate-700">
                    Belum ada template surat
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Klik Tambah Template untuk menambahkan jenis surat.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            templates.map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 last:border-0 transition hover:bg-slate-50/70"
              >
                {/* Nama jenis surat */}
                <td className="px-6 py-4 font-medium text-slate-700">
                  {item.nama}
                </td>

                {/* Nama file Word */}
                <td className="min-w-56 px-6 py-4 text-slate-500">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 shrink-0 text-emerald-600" />

                    <span className="break-all">{item.fileName}</span>
                  </div>
                </td>

                {/* Tombol aksi */}
                <td className="w-32 px-4 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTemplateDipilih(item)}
                      title="Lihat template"
                      aria-label={`Lihat ${item.nama}`}
                      className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => hapusTemplate(item.id)}
                      title="Hapus template"
                      aria-label={`Hapus ${item.nama}`}
                      className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TabelTemplateSurat;
