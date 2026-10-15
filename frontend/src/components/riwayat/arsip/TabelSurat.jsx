
import { Download, Eye, Files, Search } from "lucide-react";

function TabelSurat({
  surat,
  suratDitampilkan,
  onLihat,
  onResetFilter,
  onPulihkanData,
  formatTanggal,
}) {
  function downloadSurat(item) {
    const isiSurat = [
      "ARSIP SURAT",
      "==============================",
      `Nomor Surat: ${item.nomorSurat}`,
      `Jenis Surat: ${item.jenisSurat}`,
      `Nama Pemohon: ${item.pemohon}`,
      `Tanggal: ${formatTanggal(item.tanggal)}`,
      `Status: ${item.status}`,
    ].join("\n");

    const file = new Blob([isiSurat], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${item.nomorSurat.replaceAll("/", "-")}.txt`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  return (
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

                  <button
                    type="button"
                    onClick={onPulihkanData}
                    className="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    Pulihkan data contoh
                  </button>
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
            suratDitampilkan.map((item) => (
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
                      title="Download informasi surat"
                      aria-label={`Download ${item.nomorSurat}`}
                      className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
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
  );
}

export default TabelSurat;
