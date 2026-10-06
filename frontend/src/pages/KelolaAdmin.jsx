import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getAdmins, deactivateAdmin } from "../services/adminService";

import AdminStats from "../components/kelola_admin/AdminStats";
import AdminTable from "../components/kelola_admin/AdminTable";

function KelolaAdmin() {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadAdmins() {
    try {
      setIsLoading(true);
      setError("");

      const data = await getAdmins();
      setAdmins(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  async function handleDeactivate(id) {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menonaktifkan admin ini?"
    );

    if (!confirmed) return;

    try {
      await deactivateAdmin(id);

      // Ambil ulang data setelah berhasil
      loadAdmins();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="min-h-full bg-slate-50 -m-6 px-6 py-8">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Kelola Admin
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Kelola akun yang memiliki akses ke sistem administrasi desa.
            </p>
          </div>

          <Link
            to="/kelola-admin/register"
            className="bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            + Tambah Admin
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Statistik */}
        <AdminStats admins={admins} />

        {/* Tabel */}
        <AdminTable
          admins={admins}
          isLoading={isLoading}
          onDeactivate={handleDeactivate}
        />
      </div>
    </div>
  );
}

export default KelolaAdmin;