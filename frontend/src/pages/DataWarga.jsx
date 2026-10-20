
import { useEffect, useState } from "react";

import {
  getWarga,
  tambahWarga,
  updateWarga,
  hapusWarga,
} from "../services/wargaService";

import WargaTable from "../components/warga/WargaTable";
import WargaFormModal from "../components/warga/WargaFormModal";
import WargaDetailModal from "../components/warga/WargaDetailModal";

const formAwal = {
  nik: "",
  nama: "",
  tempatLahir: "",
  tanggalLahir: "",
  jenisKelamin: "",
  agama: "",
  statusPerkawinan: "",
  pekerjaan: "",
  alamat: "",
  rt: "",
  rw: "",
};

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

function DataWarga() {
  const [warga, setWarga] = useState([]);
  const [pencarian, setPencarian] = useState("");

  const [form, setForm] = useState({ ...formAwal });
  const [nikAwal, setNikAwal] = useState("");
  const [sedangEdit, setSedangEdit] = useState(false);

  const [formTerbuka, setFormTerbuka] = useState(false);
  const [wargaDipilih, setWargaDipilih] = useState(null);
  const [error, setError] = useState("");
  const [sedangMemuat, setSedangMemuat] = useState(true);

  // Memuat data warga dari backend.
  async function muatWarga() {
    setSedangMemuat(true);

    try {
      const data = await getWarga();
      setWarga(data);
      setError("");
    } catch (error) {
      setError(error.message || "Gagal mengambil data warga");
    } finally {
      setSedangMemuat(false);
    }
  }

  useEffect(() => {
    muatWarga();
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
      setForm({ ...formAwal, ...wargaTerpilih });
      setNikAwal(wargaTerpilih.nik);
      setSedangEdit(true);
    } else {
      setForm({ ...formAwal });
      setNikAwal("");
      setSedangEdit(false);
    }

    setFormTerbuka(true);
  }

  // Menutup dan mereset form.
  function tutupForm() {
    setFormTerbuka(false);
    setForm({ ...formAwal });
    setNikAwal("");
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

    if (sedangEdit && nik !== nikAwal) {
      setError("NIK tidak dapat diubah saat mengedit data.");
      return;
    }

    const nikDuplikat = warga.some(
      (item) =>
        item.nik === nik &&
        (!sedangEdit || item.nik !== nikAwal),
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
      if (sedangEdit) {
        await updateWarga(nikAwal, dataWarga);
      } else {
        await tambahWarga(dataWarga);
      }

      await muatWarga();
      tutupForm();
    } catch (error) {
      setError(error.message || "Gagal menyimpan data warga");
    }
  }

  // Menghapus warga setelah konfirmasi.
  async function handleHapus(nik) {
    const dikonfirmasi = window.confirm(
      "Apakah kamu yakin ingin menghapus data warga ini?",
    );

    if (!dikonfirmasi) return;

    setError("");

    try {
      await hapusWarga(nik);

      setWargaDipilih((sebelumnya) =>
        sebelumnya?.nik === nik ? null : sebelumnya,
      );

      await muatWarga();
    } catch (error) {
      setError(error.message || "Gagal menghapus data warga");
    }
  }

  // Memformat tanggal untuk modal detail.
  function formatTanggal(tanggal) {
    if (!tanggal) return "-";

    const tanggalValid = new Date(`${tanggal}T00:00:00`);

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
          handleHapus={handleHapus}
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
      </div>
    </div>
  );
}

export default DataWarga;
