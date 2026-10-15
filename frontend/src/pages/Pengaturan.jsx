
import { useState, useEffect } from 'react';

import {
  getAdminProfile,
  updateAdminProfile,
  changePassword,
} from '../services/profileService';

import {
  getDesaSettings,
  updateDesaSettings,
  uploadLogoDesa,
} from '../services/desaService';

import ProfilAdmin from '../components/pengaturan/ProfilAdmin';
import InformasiDesa from '../components/pengaturan/InformasiDesa';
import LogoDesa from '../components/pengaturan/LogoDesa';
import DataKepalaDesa from '../components/pengaturan/DataKepalaDesa';

function Pengaturan() {
  // State Profil Admin
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // State Pengaturan Desa
  const [namaDesa, setNamaDesa] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [kabupaten, setKabupaten] = useState('');
  const [alamatDesa, setAlamatDesa] = useState('');
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [namaKepalaDesa, setNamaKepalaDesa] = useState('');
  const [jabatan, setJabatan] = useState('');

  // State umum
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingDesa, setIsSavingDesa] = useState(false);
  const [isSavingLogo, setIsSavingLogo] = useState(false);
  const [isSavingKepalaDesa, setIsSavingKepalaDesa] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  // Ambil data ketika halaman pertama kali dibuka
  useEffect(() => {
    async function loadData() {
      try {
        const [profile, desa] = await Promise.all([
          getAdminProfile(),
          getDesaSettings(),
        ]);

        setAdminName(profile.name ?? '');
        setAdminEmail(profile.email ?? '');

        setNamaDesa(desa.namaDesa ?? '');
        setKecamatan(desa.kecamatan ?? '');
        setKabupaten(desa.kabupaten ?? '');
        setAlamatDesa(desa.alamatDesa ?? '');
        setLogoPreview(desa.logoUrl ?? null);
        setNamaKepalaDesa(desa.namaKepalaDesa ?? '');
        setJabatan(desa.jabatan ?? '');
      } catch (err) {
        tampilkanPesan(
          err.message || 'Gagal memuat data pengaturan.',
          'error'
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Menampilkan pesan berhasil atau gagal
  function tampilkanPesan(teks, tipe = 'success') {
    setMessage(teks);
    setMessageType(tipe);
  }

  // Simpan profil admin
  async function handleSaveProfile() {
    setIsSavingProfile(true);
    setMessage('');

    try {
      await updateAdminProfile({
        name: adminName,
        email: adminEmail,
      });

      tampilkanPesan('Profil admin berhasil disimpan.');
    } catch (err) {
      tampilkanPesan(
        err.message || 'Gagal menyimpan profil admin.',
        'error'
      );
    } finally {
      setIsSavingProfile(false);
    }
  }

  // Simpan informasi desa
  async function handleSaveInformasiDesa() {
    setIsSavingDesa(true);
    setMessage('');

    try {
      await updateDesaSettings({
        namaDesa,
        kecamatan,
        kabupaten,
        alamatDesa,
      });

      tampilkanPesan('Informasi desa berhasil disimpan.');
    } catch (err) {
      tampilkanPesan(
        err.message || 'Gagal menyimpan informasi desa.',
        'error'
      );
    } finally {
      setIsSavingDesa(false);
    }
  }

  // Simpan data kepala desa
  async function handleSaveKepalaDesa() {
    setIsSavingKepalaDesa(true);
    setMessage('');

    try {
      await updateDesaSettings({
        namaKepalaDesa,
        jabatan,
      });

      tampilkanPesan('Data kepala desa berhasil disimpan.');
    } catch (err) {
      tampilkanPesan(
        err.message || 'Gagal menyimpan data kepala desa.',
        'error'
      );
    } finally {
      setIsSavingKepalaDesa(false);
    }
  }

  // Validasi dan simpan password
  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword) {
      setPasswordError('Password saat ini harus diisi.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password baru minimal 6 karakter.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('Konfirmasi password tidak cocok.');
      return;
    }

    try {
      await changePassword({
        currentPassword,
        newPassword,
      });

      setIsEditingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');

      tampilkanPesan('Password berhasil diubah.');
    } catch (err) {
      setPasswordError(err.message || 'Gagal mengubah password.');
    }
  }

  // Pilih logo dan tampilkan preview
  function handleLogoChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      tampilkanPesan('Logo harus berformat JPG atau PNG.', 'error');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      tampilkanPesan('Ukuran logo maksimal 5 MB.', 'error');
      e.target.value = '';
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setMessage('');
  }

  // Simpan logo ketika tombol ditekan
  async function handleSaveLogo() {
    if (!logoFile) {
      tampilkanPesan('Pilih logo baru terlebih dahulu.', 'error');
      return;
    }

    setIsSavingLogo(true);
    setMessage('');

    try {
      await uploadLogoDesa(logoFile);

      setLogoFile(null);
      tampilkanPesan('Logo desa berhasil disimpan.');
    } catch (err) {
      tampilkanPesan(
        err.message || 'Gagal mengunggah logo desa.',
        'error'
      );
    } finally {
      setIsSavingLogo(false);
    }
  }

  // Menampilkan indikator ketika data sedang dimuat
  if (isLoading) {
    return <p className="text-slate-400">Memuat data...</p>;
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
              Pengaturan Desa
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-800">
            Pengaturan Desa
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Kelola akun admin dan informasi desa.
          </p>
        </div>

        {/* Pesan status */}
        {message && (
          <div
            role="status"
            className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
              messageType === 'error'
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-emerald-100 bg-emerald-50 text-emerald-700'
            }`}
          >
            {message}
          </div>
        )}

        <div className="space-y-6">
          {/* PROFIL ADMIN */}
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

          {/* INFORMASI DESA */}
          <InformasiDesa
            namaDesa={namaDesa}
            setNamaDesa={setNamaDesa}
            kecamatan={kecamatan}
            setKecamatan={setKecamatan}
            kabupaten={kabupaten}
            setKabupaten={setKabupaten}
            alamatDesa={alamatDesa}
            setAlamatDesa={setAlamatDesa}
            isSavingDesa={isSavingDesa}
            handleSaveInformasiDesa={handleSaveInformasiDesa}
          />

          {/* LOGO DESA */}
          <LogoDesa
            logoPreview={logoPreview}
            logoFile={logoFile}
            handleLogoChange={handleLogoChange}
            handleSaveLogo={handleSaveLogo}
            isSavingLogo={isSavingLogo}
          />

          {/* DATA KEPALA DESA */}
          <DataKepalaDesa
            namaKepalaDesa={namaKepalaDesa}
            setNamaKepalaDesa={setNamaKepalaDesa}
            jabatan={jabatan}
            setJabatan={setJabatan}
            handleSaveKepalaDesa={handleSaveKepalaDesa}
            isSavingKepalaDesa={isSavingKepalaDesa}
          />
        </div>
      </div>
    </div>
  );
}

export default Pengaturan;
