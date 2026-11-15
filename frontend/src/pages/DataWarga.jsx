
import { useCallback, useEffect, useState } from "react";

import { getWarga, tambahWarga, hapusWarga } from "../services/wargaService";

import WargaTable from "../components/warga/WargaTable";
import WargaFormModal from "../components/warga/WargaFormModal";
import WargaDetailModal from "../components/warga/WargaDetailModal";
import ModalPemberitahuan from "../components/ModalPemberitahuan";

const formAwal = {
  nik: "",
  nama: "",
  tempatLahir: "",
  tanggalLahir: "",
  jenisKelamin: "",
  golonganDarah: "",
  agama: "",
  statusPerkawinan: "",
  pekerjaan: "",
  alamat: "",
  rt: "",
  rw: "",
};

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

function toDateInput(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value).slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
}

async function ambilDataWarga() {
  const data = await getWarga({ limit: 1000 });

  return data?.residents ?? [];
}

function DataWarga() {
  const [warga, setWarga] = useState([]);
  const [pencarian, setPencarian] = useState("");

  const [form, setForm] = useState({ ...formAwal });
  const [sedangEdit, setSedangEdit] = useState(false);

  const [formTerbuka, setFormTerbuka] = useState(false);
  const [wargaDipilih, setWargaDipilih] = useState(null);
  const [error, setError] = useState("");
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [nikDihapus, setNikDihapus] = useState("");
  const [notifikasi, setNotifikasi] = useState(null);

  // Memuat data warga dari backend (dipakai tombol/aksi manual).
  const muatWarga = useCallback(async () => {
    try {
      setWarga(await ambilDataWarga());
      setError("");
    } catch (error) {
      setError(error.message || "Gagal mengambil data warga");
    } finally {
      setSedangMemuat(false);
    }
  }, []);

  useEffect(() => {
    let aktif = true;

    ambilDataWarga()
      .then((data) => {
        if (!aktif) return;

        setWarga(data);
        setError("");
      })
      .catch((error) => {
        if (aktif) {
          setError(error.message || "Gagal mengambil data warga");
        }
      })
      .finally(() => {
        if (aktif) {
          setSedangMemuat(false);
        }
      });

    return () => {
      aktif = false;
    };
  }, []);

  // Filter warga berdasarkan NIK atau nama.
  const wargaDitampilkan = warga.filter((item) => {
    const kataKunci = pencarian.toLowerCase();

    return `${item.nik} ${item.nama}`
      .toLowerCase()
      .includes(kataKunci);
  });

  // Membuka form tambah atau edit.
  function bukaForm(wargaTerpilih = null) {
    setError("");

    if (wargaTerpilih) {
      setForm({
        ...formAwal,
        ...wargaTerpilih,
        tanggalLahir: toDateInput(wargaTerpilih.tanggalLahir),
      });
      setSedangEdit(true);
    } else {
      setForm({ ...formAwal });
      setSedangEdit(false);
    }

    setFormTerbuka(true);
  }

  // Menutup dan mereset form.
  function tutupForm() {
    setFormTerbuka(false);
    setForm({ ...formAwal });
    setSedangEdit(false);
    setError("");
  }

  // Mengubah nilai form sesuai input.
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((formSebelumnya) => ({
      ...formSebelumnya,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  // Validasi dan simpan data warga melalui API.
  async function handleSimpan(event) {
    event.preventDefault();
    setError("");

    const nik = form.nik.trim();
    const nama = form.nama.trim();

    if (!/^\d{16}$/.test(nik)) {
      setError("NIK harus terdiri dari tepat 16 digit angka.");
      return;
    }

    if (!nama) {
      setError("Nama lengkap wajib diisi.");
      return;
    }

    if (!String(form.tempatLahir ?? "").trim()) {
      setError("Tempat lahir wajib diisi.");
      return;
    }

    if (!form.tanggalLahir) {
      setError("Tanggal lahir wajib diisi.");
      return;
    }

    if (!form.jenisKelamin) {
      setError("Jenis kelamin wajib diisi.");
      return;
    }

    if (!String(form.alamat ?? "").trim()) {
      setError("Alamat wajib diisi.");
      return;
    }

    const nikDuplikat = warga.some(
      (item) =>
        item.nik === nik &&
        (!sedangEdit || item.nik !== nik),
    );

    if (nikDuplikat) {
      setError("NIK sudah terdaftar. Gunakan NIK yang berbeda.");
      return;
    }

    const dataWarga = {
      ...form,
      nik,
      nama,
    };

    try {
      await tambahWarga(dataWarga);
      await muatWarga();
      tutupForm();
    } catch (error) {
      setError(error.message || "Gagal menyimpan data warga");
    }
  }

  async function handleHapusWarga(item) {
    const disetujui = window.confirm(
      `Hapus data warga ${item.nama} (${item.nik}) dari daftar aktif? Riwayat surat yang pernah diterbitkan tetap tersimpan di arsip.`,
    );

    if (!disetujui) return;

    try {
      setNikDihapus(item.nik);
      setError("");
      await hapusWarga(item.nik);

      if (wargaDipilih?.nik === item.nik) {
        setWargaDipilih(null);
      }

      await muatWarga();
    } catch (error) {
      setNotifikasi({
        judul: "Data warga tidak dapat dihapus",
        pesan:
          error.message ||
          "Terjadi kesalahan saat menghapus data warga. Silakan coba lagi.",
      });
    } finally {
      setNikDihapus("");
    }
  }

  // Memformat tanggal untuk modal detail.
  function formatTanggal(tanggal) {
    if (!tanggal) return "-";

    const tanggalValid = String(tanggal).includes("T")
      ? new Date(tanggal)
      : new Date(`${tanggal}T00:00:00`);

    if (Number.isNaN(tanggalValid.getTime())) {
      return tanggal;
    }

    return tanggalValid.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className="min-h-full -m-6 bg-slate-50 px-6 py-8">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-1 flex items-center gap-2 text-sm">
            <span className="text-slate-500">Dashboard</span>
            <span className="text-slate-500">/</span>
            <span className="font-medium text-emerald-600">
              Data Warga
            </span>
          </div>

          <h1 className="text-2xl font-bold text-slate-800">
            Data Warga
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Kelola data identitas warga desa.
          </p>
        </div>

        {error && !formTerbuka && (
          <p
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {error}
          </p>
        )}

        {sedangMemuat && (
          <p className="mb-4 text-sm text-slate-500">
            Memuat data warga...
          </p>
        )}

        {/* Tabel dan pencarian warga */}
        <WargaTable
          warga={warga}
          wargaDitampilkan={wargaDitampilkan}
          pencarian={pencarian}
          setPencarian={setPencarian}
          bukaForm={bukaForm}
          bukaDetail={(item) => setWargaDipilih(item)}
          hapusWarga={handleHapusWarga}
          nikDihapus={nikDihapus}
        />

        {/* Modal tambah dan edit warga */}
        {formTerbuka && (
          <WargaFormModal
            form={form}
            sedangEdit={sedangEdit}
            error={error}
            inputClass={inputClass}
            handleChange={handleChange}
            handleSimpan={handleSimpan}
            tutupForm={tutupForm}
          />
        )}

        {/* Modal detail warga */}
        {wargaDipilih && (
          <WargaDetailModal
            warga={wargaDipilih}
            tutupDetail={() => setWargaDipilih(null)}
            formatTanggal={formatTanggal}
          />
        )}

        <ModalPemberitahuan
          terbuka={Boolean(notifikasi)}
          judul={notifikasi?.judul || ""}
          pesan={notifikasi?.pesan || ""}
          onTutup={() => setNotifikasi(null)}
        />
      </div>
    </div>
  );
}

export default DataWarga;
