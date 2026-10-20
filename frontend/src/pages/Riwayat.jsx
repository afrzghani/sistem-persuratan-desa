
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import TemplateSurat from "../components/riwayat/TemplateSurat";
import TabelSurat from "../components/riwayat/arsip/TabelSurat";
import { getRiwayatSurat } from "../services/templateService";

function formatTanggal(tanggal) {
  if (!tanggal) return "-";

  const date = new Date(tanggal);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function Riwayat() {
  const [surat, setSurat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [kataKunci, setKataKunci] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");

  async function muatRiwayatSurat() {
    try {
      setLoading(true);
      setError("");

      const data = await getRiwayatSurat();

      if (!Array.isArray(data)) {
        throw new Error(
          "Format data riwayat surat dari server tidak valid.",
        );
      }

      setSurat(data);
    } catch (err) {
      setError(
        err.message || "Gagal memuat riwayat surat dari server.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    muatRiwayatSurat();
  }, []);

  const suratDitampilkan = useMemo(() => {
    const kata = kataKunci.trim().toLowerCase();

    return surat.filter((item) => {
      const cocokKataKunci = [
        item.nomorSurat,
        item.jenisSurat,
        item.pemohon,
      ].some((nilai) =>
        String(nilai ?? "").toLowerCase().includes(kata),
      );

      const cocokStatus =
        filterStatus === "Semua" ||
        item.status === filterStatus;

      return cocokKataKunci && cocokStatus;
    });
  }, [surat, kataKunci, filterStatus]);

  function resetFilter() {
    setKataKunci("");
    setFilterStatus("Semua");
  }

  function handleLihatSurat(item) {
    // Sementara tampilkan detail sederhana.
    // Nanti bisa dihubungkan ke modal detail surat.
    window.alert(
      `Nomor Surat: ${item.nomorSurat}\n` +
        `Jenis Surat: ${item.jenisSurat}\n` +
        `Pemohon: ${item.pemohon}\n` +
        `Status: ${item.status}`,
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-emerald-600" />

        <p className="mt-4 font-medium text-slate-700">
          Memuat riwayat surat...
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Mohon tunggu sebentar.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <AlertCircle className="h-7 w-7 text-red-500" />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-slate-800">
          Gagal memuat riwayat surat
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          {error}
        </p>

        <button
          type="button"
          onClick={muatRiwayatSurat}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          <RefreshCw className="h-4 w-4" />
          Coba lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <TemplateSurat />

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-800">
            Arsip Surat
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Daftar surat yang tersimpan di server.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={kataKunci}
              onChange={(event) => setKataKunci(event.target.value)}
              placeholder="Cari nomor, jenis surat, atau pemohon..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 sm:flex-1"
            />

            <select
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            >
              <option value="Semua">Semua status</option>
              <option value="Selesai">Selesai</option>
              <option value="Diproses">Diproses</option>
            </select>
          </div>
        </div>

        <TabelSurat
          surat={surat}
          suratDitampilkan={suratDitampilkan}
          onLihat={handleLihatSurat}
          onResetFilter={resetFilter}
          formatTanggal={formatTanggal}
        />
      </section>
    </div>
  );
}

export default Riwayat;
