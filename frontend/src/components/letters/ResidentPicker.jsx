
import { useEffect, useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { getWarga } from "../../services/wargaService";

const JUMLAH_PER_HALAMAN = 5;

function formatTanggal(tanggal) {
  if (!tanggal) return "";

  return new Date(tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ResidentPicker({ onSelect, disabled = false }) {
  const [warga, setWarga] = useState([]);
  const [search, setSearch] = useState("");
  const [halaman, setHalaman] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function muatWarga() {
    try {
      setLoading(true);
      setError("");

      const response = await getWarga({ limit: 1000 });
      setWarga(response?.residents || response?.data?.residents || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Gagal memuat data warga."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let aktif = true;

    async function fetchWarga() {
      try {
        setLoading(true);
        setError("");

        const response = await getWarga({ limit: 1000 });

        if (aktif) {
          setWarga(response?.residents || response?.data?.residents || []);
        }
      } catch (err) {
        if (aktif) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Gagal memuat data warga."
          );
        }
      } finally {
        if (aktif) setLoading(false);
      }
    }

    fetchWarga();

    return () => {
      aktif = false;
    };
  }, []);

  const wargaFiltered = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return warga;

    return warga.filter((item) =>
      [
        item.nik,
        item.nama,
        item.alamat,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(keyword)
        )
    );
  }, [warga, search]);

  const totalHalaman = Math.ceil(
    wargaFiltered.length / JUMLAH_PER_HALAMAN
  );

  const wargaPerHalaman = wargaFiltered.slice(
    (halaman - 1) * JUMLAH_PER_HALAMAN,
    halaman * JUMLAH_PER_HALAMAN
  );

  function handleSearch(value) {
    setSearch(value);
    setHalaman(1);
  }

  function halamanSebelumnya() {
    setHalaman((prev) => Math.max(prev - 1, 1));
  }

  function halamanBerikutnya() {
    setHalaman((prev) =>
      Math.min(prev + 1, totalHalaman)
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-base font-semibold text-slate-800">
          Pilih Data Warga
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Cari dan pilih warga yang akan mengajukan surat.
        </p>
      </div>

      <div className="p-5">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Cari nama, NIK, atau alamat warga..."
            disabled={disabled || loading}
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
            <RefreshCw className="h-4 w-4 animate-spin text-emerald-600" />
            Memuat data warga...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>

            <button
              type="button"
              onClick={muatWarga}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              <RefreshCw className="h-4 w-4" />
              Coba Lagi
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && wargaFiltered.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
            <p className="text-sm font-medium text-slate-600">
              {search
                ? "Data warga tidak ditemukan."
                : "Belum ada data warga."}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {search
                ? "Coba gunakan kata kunci pencarian lainnya."
                : "Data warga akan muncul di sini."}
            </p>
          </div>
        )}

        {/* Resident List */}
        {!loading && !error && wargaFiltered.length > 0 && (
          <>
            <div className="divide-y divide-slate-100 border-y border-slate-200">
              {wargaPerHalaman.map((item) => (
                <button
                  key={item.nik}
                  type="button"
                  onClick={() => onSelect(item)}
                  disabled={disabled}
                  className="group flex w-full items-center justify-between gap-4 px-3 py-4 text-left transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {item.nama}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {[
                        item.nik,
                        item.alamat,
                        item.jenisKelamin,
                        formatTanggal(item.tanggalLahir),
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>

                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-slate-600" />
                </button>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-xs text-slate-500">
                Menampilkan{" "}
                {(halaman - 1) * JUMLAH_PER_HALAMAN + 1}–
                {Math.min(
                  halaman * JUMLAH_PER_HALAMAN,
                  wargaFiltered.length
                )}{" "}
                dari {wargaFiltered.length} warga
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={halamanSebelumnya}
                  disabled={halaman === 1 || disabled}
                  aria-label="Halaman sebelumnya"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition-colors hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <span className="min-w-12 text-center text-xs font-medium text-slate-600">
                  {halaman} / {totalHalaman}
                </span>

                <button
                  type="button"
                  onClick={halamanBerikutnya}
                  disabled={
                    halaman === totalHalaman || disabled
                  }
                  aria-label="Halaman berikutnya"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition-colors hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default ResidentPicker;
