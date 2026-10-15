import { useState } from "react";
import AdminStats from "../components/kelola_admin/AdminStats";
import AdminTable from "../components/kelola_admin/AdminTable";
import FormTambahAdmin from "../components/kelola_admin/FormTambahAdmin";

const dummyAdmins = [
  {
    id: 1,
    name: "Andi Saputra",
    email: "andi@desa.go.id",
    status: "Aktif",
  },
  {
    id: 2,
    name: "Siti Rahmawati",
    email: "siti@desa.go.id",
    status: "Aktif",
  },
  {
    id: 3,
    name: "Budi Santoso",
    email: "budi@desa.go.id",
    status: "Nonaktif",
  },
  {
    id: 4,
    name: "Dewi Lestari",
    email: "dewi@desa.go.id",
    status: "Aktif",
  },
  {
    id: 5,
    name: "Rizky Pratama",
    email: "rizky@desa.go.id",
    status: "Nonaktif",
  },
];

function KelolaAdmin() {
  const [admins, setAdmins] = useState(dummyAdmins);
  const [isLoading] = useState(false);
  const [error, setError] = useState("");
  const [showFormTambah, setShowFormTambah] = useState(false);

  function handleDelete(id) {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus admin ini secara permanen?",
    );

    if (!confirmed) return;

    setAdmins((dataSebelumnya) =>
      dataSebelumnya.filter((admin) => admin.id !== id),
    );
  }

  function handleTambahBerhasil() {
    setShowFormTambah(false);
    setError("");
  }

  return (
    <div className="min-h-full -m-6 bg-slate-50 px-6 py-8">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
              <div className="mb-1 flex items-center gap-2 text-sm">
                <span className="text-slate-500">Dashboard</span>
                <span className="text-slate-500">/</span>
                <span className="font-medium text-emerald-600">
                  Kelola Admin
                </span>
              </div>
            <h1 className="text-2xl font-bold text-slate-800">Kelola Admin</h1>

            <p className="mt-1 text-sm text-slate-500">
              Kelola akun yang memiliki akses ke sistem administrasi desa.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowFormTambah((sebelumnya) => !sebelumnya)}
            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            {showFormTambah ? "Tutup Form" : "+ Tambah Admin"}
          </button>
        </div>

        {/* Pesan error */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Statistik admin */}
        <AdminStats admins={admins} />

        {/* Form tambah admin */}
        {showFormTambah && (
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
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

        {/* Tabel admin */}
        <div className="mt-6">
          <AdminTable
            admins={admins}
            isLoading={isLoading}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}

export default KelolaAdmin;
