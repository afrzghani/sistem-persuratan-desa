import { useRef, useState} from "react";
import { Upload } from "lucide-react";

function KTPUploader({
  file,
  preview,
  error,
  onFileChange,
  onRemove,
  onProcess,
  onBack,
  isProcessing,
}) {
  const inputRef = useRef(null);
  const cameraRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile) {
      onFileChange(droppedFile);
    }
  }

  function handleInputChange(event) {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      onFileChange(selectedFile);
    }

    event.target.value = "";
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
      <div className="mb-6">

        <h2 className=" text-lg font-bold text-slate-800">
          Unggah Foto KTP
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          Unggah foto KTP pemohon. Data identitas akan diisi otomatis setelah
          layanan OCR terhubung.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleInputChange}
        className="hidden"
      />

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleInputChange}
        className="hidden"
      />

      {preview ? (
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <img
              src={preview}
              alt="Preview foto KTP"
              className="h-40 w-full rounded-lg border border-slate-200 object-contain sm:w-56"
            />

            <div className="min-w-0 flex-1">
              <p className="break-all font-medium text-slate-800">
                {file?.name}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {file
                  ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                  : ""}
              </p>

              <p className="mt-3 text-sm text-emerald-700">
                Foto KTP siap diproses.
              </p>

              <button
                type="button"
                onClick={onRemove}
                className="mt-3 text-sm font-medium text-red-600 hover:text-red-700"
              >
                Hapus foto
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`rounded-xl border-2 border-dashed p-6 text-center transition sm:p-10 ${
            isDragging
              ? "border-emerald-500 bg-emerald-50"
              : "border-slate-300 bg-slate-50/70"
          }`}
        >
<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
  <Upload
    className="h-6 w-6 text-emerald-600"
    strokeWidth={1.8}
    aria-hidden="true"
  />
</div>

          <p className="mt-4 font-semibold text-slate-800">
            Pilih foto KTP atau seret ke sini
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Format JPG atau PNG, maksimal 5 MB.
          </p>

          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Pilih dari perangkat
            </button>
            
            <button
              type="button"
              onClick={() => cameraRef.current?.click()}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Ambil foto
            </button>
          </div>
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Kembali
        </button>

        <button
          type="button"
          onClick={onProcess}
          disabled={!file || isProcessing}
          className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing ? "Memproses KTP..." : "Proses KTP"}
        </button>
      </div>
    </section>
  );
}

export default KTPUploader;
