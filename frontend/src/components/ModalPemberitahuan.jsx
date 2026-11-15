import { createPortal } from "react-dom";
import { AlertCircle, X } from "lucide-react";

function ModalPemberitahuan({ terbuka, judul, pesan, onTutup }) {
  if (!terbuka) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4"
      onClick={onTutup}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-pemberitahuan-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>

          <button
            type="button"
            onClick={onTutup}
            aria-label="Tutup pemberitahuan"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <h2
          id="modal-pemberitahuan-title"
          className="mt-4 text-lg font-semibold text-slate-800"
        >
          {judul}
        </h2>

        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
          {pesan}
        </p>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onTutup}
            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default ModalPemberitahuan;
