import { useRef, useState } from "react";
import { FileUp } from "lucide-react";

function buatKodeSurat(nama) {
  return nama
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 20);
}

function FormTemplateSurat({
  onSimpan,
  progress,
  sedangUpload,
  error,
  setError,
  onBatal,
}) {
  const [namaTemplate, setNamaTemplate] = useState("");
  const [kodeSurat, setKodeSurat] = useState("");
  const [fileTemplate, setFileTemplate] = useState(null);

  const inputRef = useRef(null);

  function resetForm() {
    setNamaTemplate("");
    setKodeSurat("");
    setFileTemplate(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  // Memilih dan memvalidasi file Word.
  function pilihFile(file) {
    setError("");

    if (!file) return;

    if (!/\.docx$/i.test(file.name)) {
      setError("Pilih file Word dengan format .docx.");
      setFileTemplate(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    setFileTemplate(file);

    // Mengisi nama dan kode otomatis dari nama file jika masih kosong.
    if (!namaTemplate.trim()) {
      const nama = file.name.replace(/\.docx$/i, "").replace(/[-_]/g, " ");
      setNamaTemplate(nama);

      if (!kodeSurat.trim()) {
        setKodeSurat(buatKodeSurat(nama));
      }
    }
  }

  // Mengirim data ke komponen utama untuk diproses oleh API.
  async function tambahTemplate(e) {
    e.preventDefault();

    const nama = namaTemplate.trim();
    const kode = kodeSurat.trim().toUpperCase();

    if (!nama) {
      setError("Nama template harus diisi.");
      return;
    }

    if (!kode) {
      setError("Kode surat harus diisi.");
      return;
    }

    if (!/^[A-Z0-9_-]+$/.test(kode)) {
      setError(
        "Kode surat hanya boleh berisi huruf, angka, strip, atau garis bawah.",
      );
      return;
    }

    if (!fileTemplate) {
      setError("Silakan pilih file Word terlebih dahulu.");
      return;
    }

    setError("");

    const berhasil = await onSimpan({
      namaSurat: nama,
      kodeSurat: kode,
      file: fileTemplate,
    });

    if (berhasil) {
      resetForm();
    }
  }

  // Membatalkan pengisian form.
  function batalTemplate() {
    resetForm();
    onBatal();
  }

  return (
    <form
      onSubmit={tambahTemplate}
      className="border-b border-slate-100 p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
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

        {/* Kode surat */}
        <div>
          <label
            htmlFor="kode-template"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Kode Surat
          </label>

          <input
            id="kode-template"
            type="text"
            value={kodeSurat}
            onChange={(e) => setKodeSurat(e.target.value.toUpperCase())}
            placeholder="Contoh: SKD"
            maxLength={20}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm uppercase text-slate-700 outline-none transition placeholder:normal-case placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      {/* Pilih file Word */}
      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          File Template Word
        </label>

        <input
          ref={inputRef}
          type="file"
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
            Format .docx, maksimal 10 MB
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
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {sedangUpload ? "Mengunggah..." : "Simpan Template"}
        </button>
      </div>
    </form>
  );
}

export default FormTemplateSurat;
