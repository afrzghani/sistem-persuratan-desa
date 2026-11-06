import { Download, ArrowLeft, CheckCircle } from "lucide-react";

function formatTanggal(tanggal) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(tanggal));
}

function LetterPreview({
  formData,
  letterTitle,
  letterNumber,
  downloadUrl,
  fileName,
  error,
  isCompleting,
  onBack,
  onComplete,
}) {
  const judulSurat = letterTitle || "Surat Keterangan";
  const tanggalSekarang = new Date().toISOString();

  function downloadSurat() {
    if (!downloadUrl) {
      window.alert("File surat belum tersedia.");
      return;
    }

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName || "surat.docx";

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <main className="min-h-full -m-6 bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <p className="text-sm text-slate-500">
            Dashboard / Buat Surat / Pratinjau
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-800">
            Pratinjau Surat
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Surat sudah dibuat di server. Periksa data lalu tekan Selesai.
          </p>
        </div>

        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-800">
            Surat tersimpan sebagai Proses
          </p>
          <p className="mt-1 text-sm leading-6 text-emerald-700">
            Dokumen Word sudah tersimpan di server. Selama tombol Selesai belum
            ditekan, surat tetap berstatus Proses di Arsip Surat.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <article className="mx-auto max-w-3xl border border-slate-200 p-6 text-slate-800 sm:p-10">
            <header className="text-center">
              <h3 className="text-base font-bold">
                PEMERINTAH DESA GEMPOLKURUNG
              </h3>
              <p className="font-semibold">KECAMATAN MENGANTI</p>
              <p className="text-sm">KABUPATEN GRESIK</p>
              <div className="my-4 border-t-2 border-slate-800" />
              <h3 className="text-base font-bold underline">
                {judulSurat.toUpperCase()}
              </h3>
              <p className="mt-1 text-sm">
                Nomor: {letterNumber || "-"}
              </p>
            </header>

            <div className="mt-8 space-y-3 text-sm leading-6">
              <p>Yang bertanda tangan di bawah ini menerangkan bahwa:</p>

              {[
                ["Nama", formData.fullName],
                ["NIK", formData.nik],
                ["Tempat lahir", formData.birthPlace],
                [
                  "Tanggal lahir",
                  formData.birthDate
                    ? formatTanggal(formData.birthDate)
                    : "-",
                ],
                ["Jenis kelamin", formData.gender],
                ["Golongan darah", formData.bloodType],
                ["Agama", formData.religion],
                ["Status perkawinan", formData.maritalStatus],
                ["Pekerjaan", formData.occupation],
                ["Alamat", formData.address],
                ["RT/RW", `${formData.rt || "-"} / ${formData.rw || "-"}`],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[140px_1fr] gap-2">
                  <span>{label}</span>
                  <span className="break-words">: {value || "-"}</span>
                </div>
              ))}

              <p className="pt-3">
                Surat ini dibuat untuk keperluan:{" "}
                {formData.purpose || "-"}.
              </p>

              <p>
                Demikian surat ini dibuat agar dapat dipergunakan
                sebagaimana mestinya.
              </p>
            </div>

            <div className="ml-auto mt-12 max-w-56 text-center text-sm">
              <p>Gempolkurung, {formatTanggal(tanggalSekarang)}</p>
              <p className="mt-1">Kepala Desa</p>
              <div className="h-20" />
              <p className="font-bold">H. SUBANDI</p>
            </div>
          </article>
        </section>

        <div className="mt-6 flex flex-col-reverse justify-between gap-3 sm:flex-row">
          {!downloadUrl && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke formulir
            </button>
          )}

          <div className="ml-auto flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={downloadSurat}
              disabled={!downloadUrl}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-600 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Unduh Surat (.docx)
            </button>

            <button
              type="button"
              onClick={onComplete}
              disabled={isCompleting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CheckCircle className="h-4 w-4" />
              {isCompleting ? "Menyelesaikan..." : "Selesai"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LetterPreview;
