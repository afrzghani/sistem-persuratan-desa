import TemplateSurat from "../components/riwayat/TemplateSurat";
import ArsipSurat from "../components/riwayat/arsip/ArsipSurat";

function Riwayat() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <div className="mb-1 flex items-center gap-2 text-sm">
          <span className="text-slate-500">Dashboard</span>
          <span className="text-slate-500">/</span>
          <span className="font-medium text-emerald-600">
            Arsip Surat
          </span>
        </div>

        <h2 className="text-2xl font-bold text-slate-800">
          Arsip Surat
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Lihat riwayat surat yang telah dibuat.
        </p>
      </div>

      <TemplateSurat />

      <ArsipSurat />
    </div>
  );
}

export default Riwayat;
