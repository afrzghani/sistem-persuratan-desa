import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Download,
  FileText,
  Loader2,
  X,
} from "lucide-react";
import { getTemplateFile } from "../../services/templateService";

function DetailTemplateSurat({ template, onTutup }) {
  const previewRef = useRef(null);
  const [blob, setBlob] = useState(null);
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!template || !previewRef.current) return;

    let masihAktif = true;
    const kontainer = previewRef.current;

    setSedangMemuat(true);
    setError("");
    setBlob(null);
    kontainer.innerHTML = "";

    getTemplateFile(template.id)
      .then(async (fileBlob) => {
        if (!masihAktif) return;

        setBlob(fileBlob);

        const { renderAsync } = await import("docx-preview");

        await renderAsync(fileBlob, kontainer, null, {
          className: "docx",
          inWrapper: true,
          breakPages: true,
          ignoreWidth: false,
          ignoreHeight: false,
          renderHeaders: true,
          renderFooters: true,
          renderFootnotes: true,
          useBase64URL: true,
        });
      })
      .catch((err) => {
        if (masihAktif) {
          setError(err.message || "Gagal menampilkan preview template.");
        }
      })
      .finally(() => {
        if (masihAktif) {
          setSedangMemuat(false);
        }
      });

    return () => {
      masihAktif = false;
      kontainer.innerHTML = "";
    };
  }, [template]);

  if (!template) return null;

  function unduhTemplate() {
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = template.fileName || "template.docx";
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={onTutup}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-template-title"
        className="flex max-h-[90vh] w-full max-w-5xl flex-col rounded-2xl bg-white p-6 shadow-xl"
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

            {template.isi && (
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                {template.isi}
              </p>
            )}
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

        {/* Preview dokumen */}
        <div className="mt-6 min-h-0 flex-1 overflow-auto rounded-xl border border-slate-200 bg-slate-100 p-4">
          {error ? (
            <div className="flex h-full min-h-56 flex-col items-center justify-center rounded-lg bg-white p-6 text-center">
              <AlertCircle className="h-8 w-8 text-red-500" />

              <p className="mt-3 font-medium text-slate-700">
                Preview tidak dapat ditampilkan
              </p>

              <p className="mt-1 max-w-md text-sm text-slate-500">
                {error}
              </p>
            </div>
          ) : (
            <>
              {sedangMemuat && (
                <div className="flex min-h-56 flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />

                  <p className="mt-3 text-sm text-slate-600">
                    Memuat preview dokumen...
                  </p>
                </div>
              )}

              <div ref={previewRef} className="docx-preview-container" />
            </>
          )}
        </div>

        {/* Tombol aksi */}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onTutup}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Tutup
          </button>

          <button
            type="button"
            onClick={unduhTemplate}
            disabled={!blob || sedangMemuat}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            Unduh Template
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailTemplateSurat;
