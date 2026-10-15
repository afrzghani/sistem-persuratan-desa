
import { Search, X } from "lucide-react";

function FilterSurat({
  search,
  filterStatus,
  filterJenis,
  jenisSurat,
  jumlahHasil,
  onSearch,
  onStatus,
  onJenis,
  onReset,
}) {
  return (
    <>
      <div className="mt-5 flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Cari nomor surat, jenis surat, atau nama pemohon..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => onStatus(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500"
        >
          <option value="Semua">Semua Status</option>
          <option value="Diproses">Diproses</option>
          <option value="Selesai">Selesai</option>
        </select>

        <select
          value={filterJenis}
          onChange={(e) => onJenis(e.target.value)}
          className="max-w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 lg:max-w-64"
        >
          <option value="Semua">Semua Jenis Surat</option>

          {jenisSurat.map((jenis) => (
            <option key={jenis} value={jenis}>
              {jenis}
            </option>
          ))}
        </select>
      </div>

      {(search ||
        filterStatus !== "Semua" ||
        filterJenis !== "Semua") && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-slate-500">
            Ditemukan {jumlahHasil} surat
          </p>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            <X className="h-4 w-4" />
            Reset filter
          </button>
        </div>
      )}
    </>
  );
}

export default FilterSurat;
