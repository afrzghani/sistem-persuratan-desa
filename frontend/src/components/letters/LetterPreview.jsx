
import { Download, ArrowLeft, CheckCircle } from "lucide-react";

const letterTitles = {
  domicile: "Surat Keterangan Domisili",
  business: "Surat Keterangan Usaha",
  introduction: "Surat Pengantar",
  birth: "Surat Keterangan Kelahiran",
  "example-5": "Jenis Surat 5",
  "example-6": "Jenis Surat 6",
  "example-7": "Jenis Surat 7",
  "example-8": "Jenis Surat 8",
};

function formatTanggal(tanggal) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(tanggal));
}

function LetterPreview({ formData, letterType, onBack, onComplete }) {
  const judulSurat =
    letterTitles[letterType] || "Surat Keterangan";

  const tanggalSekarang = new Date().toISOString();

  function downloadSurat() {
    const isiSurat = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8" />
        <title>${judulSurat}</title>
        <style>
          body {
            font-family: "Times New Roman", serif;
            color: #111;
            max-width: 800px;
            margin: 40px auto;
            padding: 30px;
            line-height: 1.6;
          }
          h2, h3, p.center { text-align: center; }
          h2 { font-size: 18px; margin-bottom: 4px; }
          h3 { font-size: 16px; text-decoration: underline; }
          .identity { margin-left: 30px; }
          .signature { margin-top: 60px; margin-left: 60%; }
          @media print {
            body { margin: 0 auto; }
          }
        </style>
      </head>
      <body>
        <h2>PEMERINTAH DESA [NAMA DESA]</h2>
        <h2>KECAMATAN [NAMA KECAMATAN]</h2>
        <p class="center">KABUPATEN/KOTA [NAMA DAERAH]</p>
        <hr />

        <h3>${judulSurat}</h3>
        <p class="center">Nomor: [Nomor surat resmi]</p>

        <p>Yang bertanda tangan di bawah ini menerangkan bahwa:</p>

        <div class="identity">
          <p>Nama: ${formData.fullName || "-"}</p>
          <p>NIK: ${formData.nik || "-"}</p>
          <p>Tempat lahir: ${formData.birthPlace || "-"}</p>
          <p>Tanggal lahir: ${formData.birthDate || "-"}</p>
          <p>Jenis kelamin: ${formData.gender || "-"}</p>
          <p>Agama: ${formData.religion || "-"}</p>
          <p>Status perkawinan: ${formData.maritalStatus || "-"}</p>
          <p>Pekerjaan: ${formData.occupation || "-"}</p>
          <p>Alamat: ${formData.address || "-"}</p>
          <p>RT/RW: ${formData.rt || "-"} / ${formData.rw || "-"}</p>
        </div>

        <p>
          Surat ini dibuat untuk keperluan:
          ${formData.purpose || "-"}.
        </p>

        <p>
          Demikian surat ini dibuat agar dapat dipergunakan
          sebagaimana mestinya.
        </p>

        <div class="signature">
          <p>[Tempat], ${formatTanggal(tanggalSekarang)}</p>
          <p>Kepala Desa</p>
          <br /><br /><br />
          <p><strong>[Nama Kepala Desa]</strong></p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([isiSurat], {
      type: "text/html;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${judulSurat.replaceAll(" ", "-")}.html`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
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
            Periksa kembali isi surat sebelum menyelesaikan proses.
          </p>
        </div>

        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-800">
            Dokumen pratinjau
          </p>
          <p className="mt-1 text-sm leading-6 text-amber-700">
            Identitas desa, nomor surat, dan nama pejabat masih berupa
            placeholder. Lengkapi dengan data resmi sebelum surat digunakan.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <article className="mx-auto max-w-3xl border border-slate-200 p-6 text-slate-800 sm:p-10">
            <header className="text-center">
              <h3 className="text-base font-bold">
                PEMERINTAH DESA [NAMA DESA]
              </h3>
              <p className="font-semibold">
                KECAMATAN [NAMA KECAMATAN]
              </p>
              <p className="text-sm">KABUPATEN/KOTA [NAMA DAERAH]</p>
              <div className="my-4 border-t-2 border-slate-800" />
              <h3 className="text-base font-bold underline">
                {judulSurat.toUpperCase()}
              </h3>
              <p className="mt-1 text-sm">
                Nomor: [Nomor surat resmi]
              </p>
            </header>

            <div className="mt-8 space-y-3 text-sm leading-6">
              <p>Yang bertanda tangan di bawah ini menerangkan bahwa:</p>

              {[
                ["Nama", formData.fullName],
                ["NIK", formData.nik],
                ["Tempat lahir", formData.birthPlace],
                ["Tanggal lahir", formData.birthDate],
                ["Jenis kelamin", formData.gender],
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
              <p>[Tempat], {formatTanggal(tanggalSekarang)}</p>
              <p className="mt-1">Kepala Desa</p>
              <div className="h-20" />
              <p className="font-bold">[Nama Kepala Desa]</p>
            </div>
          </article>
        </section>

        <div className="mt-6 flex flex-col-reverse justify-between gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke formulir
          </button>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={downloadSurat}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-600 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              <Download className="h-4 w-4" />
              Unduh Surat
            </button>

            <button
              type="button"
              onClick={onComplete}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <CheckCircle className="h-4 w-4" />
              Selesai
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LetterPreview;
