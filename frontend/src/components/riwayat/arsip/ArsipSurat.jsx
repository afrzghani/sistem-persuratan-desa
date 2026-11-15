import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AlertCircle, RefreshCw } from "lucide-react";

import TabelSurat from "./TabelSurat";
import DetailSuratModal from "./DetailSuratModal";
import {
  getDaftarDraftSurat,
  getDownloadUrl,
  getRiwayatSurat,
  updateLetterStatus,
} from "../../../services/letterService";

function sesuaikanSurat(item) {
  return {
    ...item,
    jenisSurat: item.template?.namaSurat ?? "-",
    pemohon: item.resident?.nama ?? "-",
    tanggal: item.issuedAt,
    status: item.status ?? "Proses",
    fileName: item.generatedFile ?? null,
    downloadUrl: item.generatedFile
      ? getDownloadUrl(item.generatedFile)
      : null,
  };
}

function sesuaikanDraft(draft) {
  const formData = draft.formData || {};

  return {
    id: `draft-${draft.id}`,
    nomorSurat: formData.nomorSurat || "Draft",
    jenisSurat: draft.template?.namaSurat ?? "-",
    pemohon: formData.fullName || "-",
    keperluan: formData.purpose || "",
    tanggal: draft.updatedAt ?? draft.createdAt,
    status: "Proses",
    fileName: null,
    downloadUrl: null,
    isDraft: true,
  };
}

async function ambilRiwayatSurat() {
  const [data, drafts] = await Promise.all([
    getRiwayatSurat({ limit: 100 }),
    getDaftarDraftSurat().catch(() => []),
  ]);

  const letters = Array.isArray(data?.letters) ? data.letters : [];
  const daftarDraft = Array.isArray(drafts) ? drafts : [];

  return [
    ...daftarDraft.map(sesuaikanDraft),
    ...letters.map(sesuaikanSurat),
  ].sort(
    (a, b) =>
      new Date(b.tanggal || 0).getTime() -
      new Date(a.tanggal || 0).getTime()
  );
}

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

function ArsipSurat({
  tampilkanLihatSemua = false,
  id = "arsip-surat",
  judul = "Arsip Surat",
  deskripsi = "Daftar surat yang tersimpan di server.",
}) {
  const location = useLocation();
  const [surat, setSurat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [kataKunci, setKataKunci] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [suratDipilih, setSuratDipilih] = useState(null);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [finalizeError, setFinalizeError] = useState("");

  const muatRiwayatSurat = useCallback(async () => {
    try {
      setSurat(await ambilRiwayatSurat());
      setError("");
    } catch (err) {
      setError(
        err.message || "Gagal memuat riwayat surat dari server.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let aktif = true;

    ambilRiwayatSurat()
      .then((data) => {
        if (!aktif) return;

        setSurat(data);
        setError("");
      })
      .catch((err) => {
        if (aktif) {
          setError(err.message || "Gagal memuat riwayat surat dari server.");
        }
      })
      .finally(() => {
        if (aktif) {
          setLoading(false);
        }
      });

    return () => {
      aktif = false;
    };
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

  useEffect(() => {
    if (location.hash !== `#${id}` || loading) return;

    const element = document.getElementById(id);

    if (!element) return;

    element.scrollIntoView({ behavior: "smooth", block: "start" });
    element.classList.add("arsip-sorot");

    const timer = setTimeout(() => {
      element.classList.remove("arsip-sorot");
    }, 2000);

    return () => {
      clearTimeout(timer);
      element.classList.remove("arsip-sorot");
    };
  }, [location.hash, loading, id]);

  function resetFilter() {
    setKataKunci("");
    setFilterStatus("Semua");
  }

  function handleLihatSurat(item) {
    setFinalizeError("");
    setSuratDipilih(item);
  }

  function handleTutupDetail() {
    setFinalizeError("");
    setSuratDipilih(null);
  }

  async function handleSelesaikanSurat(item) {
    if (!item?.id || item.isDraft) return;

    try {
      setIsFinalizing(true);
      setFinalizeError("");
      await updateLetterStatus(item.id, "Selesai");
      await muatRiwayatSurat();
      setSuratDipilih(null);
    } catch (err) {
      setFinalizeError(
        err.message || "Gagal menyelesaikan surat. Silakan coba lagi.",
      );
    } finally {
      setIsFinalizing(false);
    }
  }

  return (
    <section
      id={id}
      className="scroll-mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white"
    >
      <div className="border-b border-slate-100 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {judul}
            </h2>

            <p className="mt-2 text-sm text-slate-500">{deskripsi}</p>
          </div>

          {tampilkanLihatSemua && (
            <Link
              to={`/riwayat#${id}`}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              Lihat Semua
            </Link>
          )}
        </div>

        {!loading && !error && (
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
              <option value="Proses">Proses</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <RefreshCw className="h-6 w-6 animate-spin text-emerald-600" />

          <p className="mt-3 text-sm text-slate-500">Memuat surat...</p>
        </div>
      ) : error ? (
        <div className="px-6 py-12 text-center">
          <AlertCircle className="mx-auto h-7 w-7 text-red-500" />

          <p className="mt-3 text-sm text-slate-600">{error}</p>

          <button
            type="button"
            onClick={() => {
              setLoading(true);
              muatRiwayatSurat();
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            <RefreshCw className="h-4 w-4" />
            Coba lagi
          </button>
        </div>
      ) : (
        <TabelSurat
          key={`${kataKunci}-${filterStatus}`}
          surat={surat}
          suratDitampilkan={suratDitampilkan}
          onLihat={handleLihatSurat}
          onResetFilter={resetFilter}
          formatTanggal={formatTanggal}
        />
      )}

      <DetailSuratModal
        suratDipilih={suratDipilih}
        onTutup={handleTutupDetail}
        formatTanggal={formatTanggal}
        onSelesaikan={handleSelesaikanSurat}
        isFinalizing={isFinalizing}
        finalizeError={finalizeError}
      />
    </section>
  );
}

export default ArsipSurat;
