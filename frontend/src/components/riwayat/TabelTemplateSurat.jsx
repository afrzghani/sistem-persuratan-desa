import { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, FileText, Files } from "lucide-react";

const PER_PAGE = 8;

function TabelTemplateSurat({ templates, onLihat }) {
  const [halaman, setHalaman] = useState(1);

  const totalHalaman = Math.max(1, Math.ceil(templates.length / PER_PAGE));
  const halamanAktif = Math.min(halaman, totalHalaman);
  const mulai = (halamanAktif - 1) * PER_PAGE;
  const daftarTampil = templates.slice(mulai, mulai + PER_PAGE);

  function halamanSebelumnya() {
    setHalaman(Math.max(1, halamanAktif - 1));
  }

  function halamanBerikutnya() {
    setHalaman(Math.min(totalHalaman, halamanAktif + 1));
  }

  return (
    <div>
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
                      Template yang terdaftar di server akan muncul di sini.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              daftarTampil.map((item) => (
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
                        onClick={() => onLihat(item)}
                        title="Lihat template"
                        aria-label={`Lihat ${item.nama}`}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {templates.length > PER_PAGE && (
        <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Menampilkan {mulai + 1}-
            {Math.min(mulai + PER_PAGE, templates.length)} dari{" "}
            {templates.length} template
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={halamanSebelumnya}
              disabled={halamanAktif === 1}
              aria-label="Halaman sebelumnya"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="min-w-16 text-center text-sm font-medium text-slate-600">
              {halamanAktif} / {totalHalaman}
            </span>

            <button
              type="button"
              onClick={halamanBerikutnya}
              disabled={halamanAktif === totalHalaman}
              aria-label="Halaman berikutnya"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TabelTemplateSurat;
