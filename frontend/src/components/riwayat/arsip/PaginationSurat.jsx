
import { ChevronLeft, ChevronRight } from "lucide-react";

function PaginationSurat({
  halaman,
  setHalaman,
  jumlahPerHalaman,
  jumlahHasil,
  totalHalaman,
}) {
  if (jumlahHasil === 0) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Menampilkan {(halaman - 1) * jumlahPerHalaman + 1}–
        {Math.min(halaman * jumlahPerHalaman, jumlahHasil)} dari{" "}
        {jumlahHasil} surat
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={halaman === 1}
          onClick={() => setHalaman((prev) => prev - 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Sebelumnya
        </button>

        <span className="px-2 text-sm text-slate-600">
          {halaman} / {totalHalaman}
        </span>

        <button
          type="button"
          disabled={halaman >= totalHalaman}
          onClick={() => setHalaman((prev) => prev + 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Berikutnya
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default PaginationSurat;
