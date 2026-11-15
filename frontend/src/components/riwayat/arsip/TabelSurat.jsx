
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Files,
  Search,
} from "lucide-react";

const PER_PAGE = 8;

function TabelSurat({
  surat,
  suratDitampilkan,
  onLihat,
  onResetFilter,
  formatTanggal,
}) {
  const [halaman, setHalaman] = useState(1);

  const totalHalaman = Math.max(
    1,
    Math.ceil(suratDitampilkan.length / PER_PAGE),
  );
  const halamanAktif = Math.min(halaman, totalHalaman);
  const mulai = (halamanAktif - 1) * PER_PAGE;
  const daftarTampil = suratDitampilkan.slice(mulai, mulai + PER_PAGE);

  function downloadSurat(item) {
    if (!item.downloadUrl) {
      window.alert("File surat tidak tersedia di server.");
      return;
    }

    const link = document.createElement("a");
    link.href = item.downloadUrl;
    link.download = item.fileName || "surat.docx";

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
        <thead className="border-y border-slate-200 bg-emerald-600">
          <tr>
            <th className="whitespace-nowrap px-6 py-4 font-semibold text-white">
              Nomor Surat
            </th>
            <th className="whitespace-nowrap px-6 py-4 font-semibold text-white">
              Jenis Surat
            </th>
            <th className="whitespace-nowrap px-6 py-4 font-semibold text-white">
              Pemohon
            </th>
            <th className="whitespace-nowrap px-6 py-4 font-semibold text-white">
              Tanggal
            </th>
            <th className="whitespace-nowrap px-6 py-4 font-semibold text-white">
              Status
            </th>
            <th className="px-7 py-4 font-semibold text-white">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {surat.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-16 text-center">
                <div className="flex flex-col items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                    <Files className="h-7 w-7 text-slate-400" />
                  </div>

                  <p className="mt-4 font-semibold text-slate-700">
                    Belum ada surat
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Surat yang diajukan akan muncul di sini.
                  </p>
                </div>
              </td>
            </tr>
          ) : suratDitampilkan.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-16 text-center">
                <div className="flex flex-col items-center">
                  <Search className="h-8 w-8 text-slate-300" />

                  <p className="mt-3 font-medium text-slate-700">
                    Surat tidak ditemukan
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Coba kata kunci atau filter yang berbeda.
                  </p>

                  <button
                    type="button"
                    onClick={onResetFilter}
                    className="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    Reset pencarian
                  </button>
                </div>
              </td>
            </tr>
          ) : (
            daftarTampil.map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 last:border-0 transition hover:bg-slate-50/70"
              >
                <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-700">
                  {item.nomorSurat}
                </td>

                <td className="min-w-56 px-6 py-4 text-slate-700">
                  {item.jenisSurat}
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-slate-700">
                  {item.pemohon}
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                  {formatTanggal(item.tanggal)}
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                      item.status === "Selesai"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onLihat(item)}
                      title="Lihat detail surat"
                      aria-label={`Lihat detail ${item.nomorSurat}`}
                      className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => downloadSurat(item)}
                      disabled={!item.downloadUrl}
                      title={
                        item.downloadUrl
                          ? "Unduh surat"
                          : "File surat tidak tersedia"
                      }
                      aria-label={`Download ${item.nomorSurat}`}
                      className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>

      {suratDitampilkan.length > PER_PAGE && (
        <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Menampilkan {mulai + 1}-
            {Math.min(mulai + PER_PAGE, suratDitampilkan.length)} dari{" "}
            {suratDitampilkan.length} surat
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setHalaman(Math.max(1, halamanAktif - 1))}
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
              onClick={() =>
                setHalaman(Math.min(totalHalaman, halamanAktif + 1))
              }
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

export default TabelSurat;
