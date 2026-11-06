import { useState } from "react";

import FormTambahAdmin from "../components/kelola_admin/FormTambahAdmin";

function KelolaAdmin() {
  const [showFormTambah, setShowFormTambah] = useState(false);
  const [message, setMessage] = useState("");

  function handleTambahBerhasil() {
    setShowFormTambah(false);
    setMessage("Akun admin berhasil ditambahkan.");
  }

  return (
    <div className="min-h-full -m-6 bg-slate-50 px-6 py-8">
      <div className="mx-auto">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm">
              <span className="text-slate-500">Dashboard</span>
              <span className="text-slate-500">/</span>
              <span className="font-medium text-emerald-600">
                Kelola Admin
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-800">
              Kelola Admin
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Tambah akun yang memiliki akses ke sistem administrasi desa.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setMessage("");
              setShowFormTambah((sebelumnya) => !sebelumnya);
            }}
            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            {showFormTambah ? "Tutup Form" : "+ Tambah Admin"}
          </button>
        </div>

        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Daftar, edit, dan nonaktifkan admin belum tersedia di backend.
          Saat ini hanya pembuatan akun admin baru yang didukung.
        </div>

        {message && (
          <div
            role="status"
            className="mb-6 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          >
            {message}
          </div>
        )}

        {showFormTambah && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 p-6">
              <h2 className="text-lg font-semibold text-slate-800">
                Tambah Akun Admin
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Masukkan informasi akun admin baru.
              </p>
            </div>

            <FormTambahAdmin
              onSuccess={handleTambahBerhasil}
              onCancel={() => setShowFormTambah(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default KelolaAdmin;
