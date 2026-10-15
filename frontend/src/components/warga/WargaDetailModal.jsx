
import { X, UserRound } from "lucide-react";

function WargaDetailModal({ warga, tutupDetail, formatTanggal }) {
  if (!warga) return null;

  const daftarDetail = [
    { label: "NIK", nilai: warga.nik },
    { label: "Nama Lengkap", nilai: warga.nama },
    { label: "Tempat Lahir", nilai: warga.tempatLahir },
    {
      label: "Tanggal Lahir",
      nilai: formatTanggal(warga.tanggalLahir),
    },
    { label: "Jenis Kelamin", nilai: warga.jenisKelamin },
    { label: "Agama", nilai: warga.agama },
    { label: "Status Perkawinan", nilai: warga.statusPerkawinan },
    { label: "Pekerjaan", nilai: warga.pekerjaan },
    {
      label: "RT / RW",
      nilai: `RT ${warga.rt || "-"} / RW ${warga.rw || "-"}`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Header modal */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <UserRound size={21} />
            </div>

            <div>
              <h2 className="font-bold text-slate-800">
                Detail Warga
              </h2>
              <p className="text-sm text-slate-500">
                Informasi identitas warga desa
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={tutupDetail}
            aria-label="Tutup detail warga"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Identitas utama */}
        <div className="border-b border-slate-200 bg-emerald-50/50 px-6 py-5">
          <p className="text-sm text-slate-500">Nama lengkap</p>
          <h3 className="mt-1 text-xl font-bold text-slate-800">
            {warga.nama || "-"}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            NIK: {warga.nik || "-"}
          </p>
        </div>

        {/* Informasi warga */}
        <div className="grid grid-cols-1 gap-5 px-6 py-6 sm:grid-cols-2">
          {daftarDetail.map((detail) => (
            <div key={detail.label}>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {detail.label}
              </p>
              <p className="mt-1 break-words text-sm font-medium text-slate-700">
                {detail.nilai || "-"}
              </p>
            </div>
          ))}

          <div className="sm:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Alamat
            </p>
            <p className="mt-1 whitespace-pre-line break-words text-sm font-medium text-slate-700">
              {warga.alamat || "-"}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={tutupDetail}
            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export default WargaDetailModal;
