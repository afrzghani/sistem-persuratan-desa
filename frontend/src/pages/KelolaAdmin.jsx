import { useEffect, useState } from "react";

import AdminStats from "../components/kelola_admin/AdminStats";
import AdminTable from "../components/kelola_admin/AdminTable";
import FormEditAdmin from "../components/kelola_admin/FormEditAdmin";
import FormTambahAdmin from "../components/kelola_admin/FormTambahAdmin";
import {
  activateAdmin,
  deactivateAdmin,
  getAdmins,
} from "../services/adminService";

function KelolaAdmin() {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showFormTambah, setShowFormTambah] = useState(false);
  const [adminDiedit, setAdminDiedit] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  async function muatAdmins() {
    setIsLoading(true);

    try {
      const data = await getAdmins();
      setAdmins(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err.message || "Gagal memuat data admin.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let aktif = true;

    async function muatDataAwal() {
      try {
        const data = await getAdmins();

        if (aktif) {
          setAdmins(Array.isArray(data) ? data : []);
          setError("");
        }
      } catch (err) {
        if (aktif) {
          setError(err.message || "Gagal memuat data admin.");
        }
      } finally {
        if (aktif) {
          setIsLoading(false);
        }
      }
    }

    muatDataAwal();

    return () => {
      aktif = false;
    };
  }, []);

  function handleTambahBerhasil() {
    setShowFormTambah(false);
    setMessage("Akun admin berhasil ditambahkan.");
    muatAdmins();
  }

  function handleEditBerhasil() {
    setAdminDiedit(null);
    setMessage("Data admin berhasil diperbarui.");
    muatAdmins();
  }

  async function handleToggleStatus(admin) {
    setProcessingId(admin.id);
    setError("");
    setMessage("");

    try {
      if (admin.status === "Aktif") {
        await deactivateAdmin(admin.id);
        setMessage(`Akun ${admin.name} berhasil dinonaktifkan.`);
      } else {
        await activateAdmin(admin.id);
        setMessage(`Akun ${admin.name} berhasil diaktifkan.`);
      }

      await muatAdmins();
    } catch (err) {
      setError(err.message || "Gagal mengubah status admin.");
    } finally {
      setProcessingId(null);
    }
  }

  function bukaFormTambah() {
    setMessage("");
    setError("");
    setAdminDiedit(null);
    setShowFormTambah((sebelumnya) => !sebelumnya);
  }

  function bukaFormEdit(admin) {
    setMessage("");
    setError("");
    setShowFormTambah(false);
    setAdminDiedit(admin);
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
              Kelola akun yang memiliki akses ke sistem administrasi desa.
            </p>
          </div>

          <button
            type="button"
            onClick={bukaFormTambah}
            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            {showFormTambah ? "Tutup Form" : "+ Tambah Admin"}
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="mb-6 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          >
            {message}
          </div>
        )}

        <AdminStats admins={admins} />

        {showFormTambah && (
          <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
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

        {adminDiedit && (
          <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 p-6">
              <h2 className="text-lg font-semibold text-slate-800">
                Edit Akun Admin
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Perbarui nama atau email akun admin.
              </p>
            </div>

            <FormEditAdmin
              key={adminDiedit.id}
              admin={adminDiedit}
              onSuccess={handleEditBerhasil}
              onCancel={() => setAdminDiedit(null)}
            />
          </div>
        )}

        <AdminTable
          admins={admins}
          isLoading={isLoading}
          onEdit={bukaFormEdit}
          onToggleStatus={handleToggleStatus}
          processingId={processingId}
        />
      </div>
    </div>
  );
}

export default KelolaAdmin;
