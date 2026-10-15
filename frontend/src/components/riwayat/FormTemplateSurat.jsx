
import { useRef, useState } from "react";
import { FileUp } from "lucide-react";

function FormTemplateSurat({
  onSimpan,
  progress,
  sedangUpload,
  error,
  setError,
  onBatal,
}) {
  const [namaTemplate, setNamaTemplate] = useState("");
  const [fileTemplate, setFileTemplate] = useState(null);

  const inputRef = useRef(null);

  // Memilih dan memvalidasi file Word.
  function pilihFile(file) {
    setError("");

    if (!file) return;

    const ekstensiValid = /\.(doc|docx)$/i.test(file.name);

    if (!ekstensiValid) {
      setError("Pilih file Word dengan format .doc atau .docx.");
      setFileTemplate(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    setFileTemplate(file);

    // Mengisi nama otomatis dari nama file jika masih kosong.
    if (!namaTemplate.trim()) {
      setNamaTemplate(
        file.name.replace(/\.(doc|docx)$/i, "").replace(/[-_]/g, " "),
      );
    }
  }

  // Mengirim data ke komponen utama untuk diproses oleh API.
  async function tambahTemplate(e) {
    e.preventDefault();

    if (!namaTemplate.trim()) {
      setError("Nama template harus diisi.");
      return;
    }

    if (!fileTemplate) {
      setError("Silakan pilih file Word terlebih dahulu.");
      return;
    }

    setError("");

    const berhasil = await onSimpan(
      namaTemplate.trim(),
      fileTemplate,
    );

    if (berhasil) {
      setNamaTemplate("");
      setFileTemplate(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  // Membatalkan pengisian form.
  function batalTemplate() {
    setNamaTemplate("");
    setFileTemplate(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onBatal();
  }

  return (
    <form
      onSubmit={tambahTemplate}
      className="border-b border-slate-100  p-6"
    >
      {/* Nama jenis surat */}
      <div>
        <label
          htmlFor="nama-template"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Nama Jenis Surat
        </label>

        <input
          id="nama-template"
          type="text"
          value={namaTemplate}
          onChange={(e) => setNamaTemplate(e.target.value)}
          placeholder="Contoh: Surat Keterangan Domisili"
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* Pilih file Word */}
      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          File Template Word
        </label>

        <input
          ref={inputRef}
          type="file"
          accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => pilihFile(e.target.files?.[0])}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-8 text-center transition hover:border-emerald-400 hover:bg-emerald-50/30"
        >
          <FileUp className="h-8 w-8 text-emerald-600" />

          <span className="mt-3 text-sm font-medium text-slate-700">
            {fileTemplate
              ? fileTemplate.name
              : "Klik untuk memilih file Word"}
          </span>

          <span className="mt-1 text-xs text-slate-500">
            Format .doc atau .docx
          </span>
        </button>
      </div>

      {/* Progress unggah */}
      {sedangUpload && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-slate-600">
              Sedang mengunggah dokumen...
            </span>

            <span className="text-sm font-medium text-emerald-600">
              {progress}%
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Pesan validasi */}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {/* Tombol formulir */}
      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={sedangUpload}
          onClick={batalTemplate}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={sedangUpload}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          {sedangUpload ? "Mengunggah..." : "Simpan Template"}
        </button>
      </div>
    </form>
  );
}

export default FormTemplateSurat;
