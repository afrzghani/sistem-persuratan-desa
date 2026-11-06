
import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import TemplateSurat from "../components/riwayat/TemplateSurat";
import TabelSurat from "../components/riwayat/arsip/TabelSurat";
import DetailSuratModal from "../components/riwayat/arsip/DetailSuratModal";
import {
  getDaftarDraftSurat,
  getDownloadUrl,
  getRiwayatSurat,
  updateLetterStatus,
} from "../services/letterService";

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

function Riwayat() {
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
          onClick={() => {
            setLoading(true);
            muatRiwayatSurat();
          }}
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
              <option value="Proses">Proses</option>
              <option value="Selesai">Selesai</option>
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

      <DetailSuratModal
        suratDipilih={suratDipilih}
        onTutup={handleTutupDetail}
        formatTanggal={formatTanggal}
        onSelesaikan={handleSelesaikanSurat}
        isFinalizing={isFinalizing}
        finalizeError={finalizeError}
      />
    </div>
  );
}

export default Riwayat;
