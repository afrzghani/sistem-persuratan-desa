import { useEffect, useState } from "react";

import { useAuth } from "../hooks/useAuth";
import ProfilAdmin from "../components/pengaturan/ProfilAdmin";
import DataKepalaDesa from "../components/pengaturan/DataKepalaDesa";
import {
  changePassword,
  getAdminProfile,
  updateAdminProfile,
} from "../services/profileService";
import { getDesaSettings, updateDesaSettings } from "../services/desaService";

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function Pengaturan() {
  const { user, refreshUser } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [namaKepalaDesa, setNamaKepalaDesa] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [isSavingKepalaDesa, setIsSavingKepalaDesa] = useState(false);

  useEffect(() => {
    let aktif = true;

    async function muatPengaturan() {
      try {
        const [profile, desa] = await Promise.all([
          getAdminProfile(),
          getDesaSettings(),
        ]);

        if (!aktif) return;

        setAdminName(profile.name || user?.name || "");
        setAdminEmail(profile.email || user?.email || "");
        setNamaKepalaDesa(desa.namaKepalaDesa || "");
        setJabatan(desa.jabatan || "");
        setError("");
      } catch (err) {
        if (aktif) {
          setError(err.message || "Gagal memuat pengaturan desa.");
        }
      } finally {
        if (aktif) {
          setIsLoading(false);
        }
      }
    }

    muatPengaturan();

    return () => {
      aktif = false;
    };
  }, [user?.name, user?.email]);

  useEffect(() => {
    if (!message) return undefined;

    const timer = setTimeout(() => setMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  async function handleSaveProfile() {
    setError("");
    setMessage("");

    if (!adminName.trim()) {
      setError("Nama admin harus diisi.");
      return;
    }

    if (!validateEmail(adminEmail)) {
      setError("Format email tidak valid.");
      return;
    }

    setIsSavingProfile(true);

    try {
      const profile = await updateAdminProfile({
        name: adminName.trim(),
        email: adminEmail.trim(),
      });

      setAdminName(profile.name);
      setAdminEmail(profile.email);
      setMessage("Profil berhasil diperbarui.");

      if (refreshUser) {
        await refreshUser();
      }
    } catch (err) {
      setError(err.message || "Gagal memperbarui profil.");
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordError("");
    setError("");
    setMessage("");

    if (!currentPassword) {
      setPasswordError("Password saat ini wajib diisi.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password baru minimal 6 karakter.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError("Konfirmasi password baru tidak cocok.");
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword });
      setIsEditingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setMessage("Password berhasil diperbarui.");
    } catch (err) {
      setPasswordError(err.message || "Gagal memperbarui password.");
    }
  }

  async function handleSaveKepalaDesa() {
    setError("");
    setMessage("");

    if (!namaKepalaDesa.trim() || !jabatan.trim()) {
      setError("Nama dan jabatan kepala desa wajib diisi.");
      return;
    }

    setIsSavingKepalaDesa(true);

    try {
      const desa = await updateDesaSettings({
        namaKepalaDesa: namaKepalaDesa.trim(),
        jabatan: jabatan.trim(),
      });

      setNamaKepalaDesa(desa.namaKepalaDesa);
      setJabatan(desa.jabatan);
      setMessage("Data kepala desa berhasil diperbarui.");
    } catch (err) {
      setError(err.message || "Gagal memperbarui data kepala desa.");
    } finally {
      setIsSavingKepalaDesa(false);
    }
  }

  return (
    <div className="min-h-full -m-6 bg-slate-50 px-6 py-8">
      <div className="mx-auto">
        <div className="mb-8">
          <div className="mb-1 flex items-center gap-2 text-sm">
            <span className="text-slate-500">Dashboard</span>
            <span className="text-slate-500">/</span>
            <span className="font-medium text-emerald-600">
              Pengaturan Desa
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-800">
            Pengaturan Desa
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Kelola profil akun, password, dan data kepala desa.
          </p>
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

        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
            Memuat pengaturan...
          </div>
        ) : (
          <div className="space-y-6">
            <ProfilAdmin
              adminName={adminName}
              setAdminName={setAdminName}
              adminEmail={adminEmail}
              setAdminEmail={setAdminEmail}
              isEditingPassword={isEditingPassword}
              setIsEditingPassword={setIsEditingPassword}
              currentPassword={currentPassword}
              setCurrentPassword={setCurrentPassword}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmNewPassword={confirmNewPassword}
              setConfirmNewPassword={setConfirmNewPassword}
              passwordError={passwordError}
              setPasswordError={setPasswordError}
              isSavingProfile={isSavingProfile}
              handleSaveProfile={handleSaveProfile}
              handleChangePassword={handleChangePassword}
            />

            <DataKepalaDesa
              namaKepalaDesa={namaKepalaDesa}
              setNamaKepalaDesa={setNamaKepalaDesa}
              jabatan={jabatan}
              setJabatan={setJabatan}
              handleSaveKepalaDesa={handleSaveKepalaDesa}
              isSavingKepalaDesa={isSavingKepalaDesa}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Pengaturan;
