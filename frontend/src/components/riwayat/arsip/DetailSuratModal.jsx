
import { FileText, X } from "lucide-react";

function DetailSuratModal({ suratDipilih, onTutup, formatTanggal }) {
  if (!suratDipilih) return null;

  const keperluan =
    suratDipilih.keperluan ||
    suratDipilih.dataPemohon?.purpose ||
    "-";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={onTutup}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-surat-title"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
              <FileText className="h-5 w-5 text-emerald-600" />
            </div>

            <h2
              id="detail-surat-title"
              className="mt-4 text-lg font-semibold text-slate-800"
            >
              Detail Surat
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Informasi surat yang dipilih.
            </p>
          </div>

          <button
            type="button"
            onClick={onTutup}
            aria-label="Tutup detail"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <p className="text-xs text-slate-500">
              Nomor Surat
            </p>
            <p className="mt-1 break-words font-medium text-slate-800">
              {suratDipilih.nomorSurat || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Jenis Surat
            </p>
            <p className="mt-1 font-medium text-slate-800">
              {suratDipilih.jenisSurat || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Nama Pemohon
            </p>
            <p className="mt-1 font-medium text-slate-800">
              {suratDipilih.pemohon || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Tujuan atau Keperluan
            </p>
            <p className="mt-1 whitespace-pre-line break-words font-medium text-slate-800">
              {keperluan}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Tanggal Pengajuan
            </p>
            <p className="mt-1 font-medium text-slate-800">
              {formatTanggal(suratDipilih.tanggal)}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Status
            </p>

            <span
              className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                suratDipilih.status === "Selesai"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {suratDipilih.status || "Belum diketahui"}
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onTutup}
            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailSuratModal;
