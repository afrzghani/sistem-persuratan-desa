
import { FileText, X } from "lucide-react";

function DetailTemplateSurat({ template, onTutup }) {
  if (!template) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={onTutup}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-template-title"
        className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header modal */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
              <FileText className="h-5 w-5 text-emerald-600" />
            </div>

            <h2
              id="detail-template-title"
              className="mt-4 text-lg font-semibold text-slate-800"
            >
              {template.nama}
            </h2>

            <p className="mt-1 break-all text-sm text-slate-500">
              {template.fileName}
            </p>
          </div>

          <button
            type="button"
            onClick={onTutup}
            aria-label="Tutup detail template"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Isi template */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 text-sm font-semibold text-slate-700">
            Isi Template
          </p>

          <p className="whitespace-pre-line text-sm leading-6 text-slate-600">
            {template.isi || "Isi dokumen belum tersedia."}
          </p>
        </div>

        {/* Tombol tutup */}
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

export default DetailTemplateSurat;
