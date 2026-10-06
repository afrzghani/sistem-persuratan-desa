import { useState, useEffect } from 'react'
import { getAdminProfile, updateAdminProfile, changePassword } from '../services/profileService'
import { getDesaSettings, updateDesaSettings, uploadLogoDesa } from '../services/desaService'

function Pengaturan() {
  // --- State Profil Admin ---
  const [adminName, setAdminName] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // --- State Pengaturan Desa ---
  const [namaDesa, setNamaDesa] = useState('')
  const [kecamatan, setKecamatan] = useState('')
  const [kabupaten, setKabupaten] = useState('')
  const [alamatDesa, setAlamatDesa] = useState('')
  const [logoPreview, setLogoPreview] = useState(null)
  const [namaKepalaDesa, setNamaKepalaDesa] = useState('')
  const [jabatan, setJabatan] = useState('')

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  // Ambil data pas halaman pertama kali dibuka
  useEffect(() => {
    async function loadData() {
      try {
        const [profile, desa] = await Promise.all([
          getAdminProfile(),
          getDesaSettings(),
        ])
        setAdminName(profile.name)
        setAdminEmail(profile.email)
        setNamaDesa(desa.namaDesa)
        setKecamatan(desa.kecamatan)
        setKabupaten(desa.kabupaten)
        setAlamatDesa(desa.alamatDesa)
        setLogoPreview(desa.logoUrl)
        setNamaKepalaDesa(desa.namaKepalaDesa)
        setJabatan(desa.jabatan)
      } catch (err) {
        setMessage(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  async function handleSaveProfile(e) {
    e.preventDefault()
    setIsSaving(true)
    setMessage('')
    try {
      await updateAdminProfile({ name: adminName, email: adminEmail })
      await updateDesaSettings({ namaDesa, kecamatan, kabupaten, alamatDesa, namaKepalaDesa, jabatan })
      setMessage('Perubahan berhasil disimpan')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    setPasswordError('')

    if (newPassword.length < 6) {
      setPasswordError('Password baru minimal 6 karakter')
      return
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('Konfirmasi password tidak cocok')
      return
    }

    try {
      await changePassword({ currentPassword, newPassword })
      setIsEditingPassword(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
      setMessage('Password berhasil diubah')
    } catch (err) {
      setPasswordError(err.message)
    }
  }

  function handleLogoChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setLogoPreview(URL.createObjectURL(file))
    uploadLogoDesa(file).catch((err) => setMessage(err.message))
  }

  if (isLoading) {
    return <p className="text-slate-400">Memuat data...</p>
  }

return (
  <div className="min-h-full bg-slate-50 -m-6 px-6 py-8">
    <div className=" mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">
          Pengaturan
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Kelola akun admin dan informasi desa.
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm px-4 py-3 rounded-lg mb-6">
          {message}
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-6">

        {/* ========================================= */}
        {/* PROFIL ADMIN */}
        {/* ========================================= */}

        <section className="bg-white border border-slate-200 rounded-xl">
          <div className="px-6 py-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">
              Profil Admin
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Informasi akun admin yang sedang digunakan.
            </p>
          </div>

          <div className="p-6 space-y-5">

            {/* Nama Admin */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Nama Admin
              </label>

              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full h-11 border border-slate-300 rounded-lg px-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Nama admin"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Email
              </label>

              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full h-11 border border-slate-300 rounded-lg px-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="admin@desa.id"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Password
              </label>

              {!isEditingPassword ? (
                <div className="flex items-center justify-between border border-slate-200 rounded-lg px-4 py-3 bg-slate-50">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Password akun
                    </p>

                    <p className="text-xs text-slate-400 mt-0.5">
                      Password tersimpan secara aman
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditingPassword(true)}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    Ubah Password
                  </button>
                </div>
              ) : (
                <div className="border border-emerald-100 bg-emerald-50/50 rounded-lg p-5">

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-slate-700">
                      Ubah Password
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Masukkan password lama dan password baru kamu.
                    </p>
                  </div>

                  <div className="space-y-4">

                    {/* Password Saat Ini */}
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">
                        Password Saat Ini
                      </label>

                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) =>
                          setCurrentPassword(e.target.value)
                        }
                        className="w-full h-11 bg-white border border-slate-300 rounded-lg px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        placeholder="Masukkan password saat ini"
                      />
                    </div>

                    {/* Password Baru */}
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">
                        Password Baru
                      </label>

                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) =>
                          setNewPassword(e.target.value)
                        }
                        className="w-full h-11 bg-white border border-slate-300 rounded-lg px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        placeholder="Masukkan password baru"
                      />
                    </div>

                    {/* Konfirmasi Password */}
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">
                        Konfirmasi Password Baru
                      </label>

                      <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) =>
                          setConfirmNewPassword(e.target.value)
                        }
                        className="w-full h-11 bg-white border border-slate-300 rounded-lg px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        placeholder="Ulangi password baru"
                      />
                    </div>

                    {passwordError && (
                      <p className="text-red-500 text-sm">
                        {passwordError}
                      </p>
                    )}

                    {/* Password Buttons */}
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingPassword(false)}
                        className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        Batal
                      </button>

                      <button
                        type="button"
                        onClick={handleChangePassword}
                        className="px-4 py-2.5 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                      >
                        Simpan Password
                      </button>
                    </div>

                  </div>
                </div>
              )}
            </div>

          </div>
        </section>


        {/* ========================================= */}
        {/* INFORMASI DESA */}
        {/* ========================================= */}

        <section className="bg-white border border-slate-200 rounded-xl">

          <div className="px-6 py-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">
              Informasi Desa
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Informasi dasar mengenai wilayah desa.
            </p>
          </div>

          <div className="p-6 space-y-5">

            {/* Nama Desa */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Nama Desa
              </label>

              <input
                type="text"
                value={namaDesa}
                onChange={(e) => setNamaDesa(e.target.value)}
                className="w-full h-11 border border-slate-300 rounded-lg px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Nama desa"
              />
            </div>

            {/* Kecamatan */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Kecamatan
              </label>

              <input
                type="text"
                value={kecamatan}
                onChange={(e) => setKecamatan(e.target.value)}
                className="w-full h-11 border border-slate-300 rounded-lg px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Nama kecamatan"
              />
            </div>

            {/* Kabupaten */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Kabupaten
              </label>

              <input
                type="text"
                value={kabupaten}
                onChange={(e) => setKabupaten(e.target.value)}
                className="w-full h-11 border border-slate-300 rounded-lg px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Nama kabupaten"
              />
            </div>

            {/* Alamat */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Alamat Desa
              </label>

              <textarea
                value={alamatDesa}
                onChange={(e) => setAlamatDesa(e.target.value)}
                rows={3}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none resize-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Alamat lengkap desa"
              />
            </div>

          </div>
        </section>


        {/* ========================================= */}
        {/* LOGO DESA */}
        {/* ========================================= */}

        <section className="bg-white border border-slate-200 rounded-xl">

          <div className="px-6 py-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">
              Logo Desa
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Atur logo yang digunakan pada identitas desa.
            </p>
          </div>

          <div className="p-6">

            <div className="flex items-center justify-between gap-6">

              {/* Preview Logo */}
              <div className="flex items-center gap-4">

                <div className="w-20 h-20 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center p-2">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo Desa"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">
                      Belum ada logo
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Logo Desa
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Format JPG atau PNG
                  </p>
                </div>

              </div>

              {/* Upload */}
              <label className="cursor-pointer border border-slate-300 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                Ganti Logo

                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>

            </div>

          </div>
        </section>


        {/* ========================================= */}
        {/* DATA KEPALA DESA */}
        {/* ========================================= */}

        <section className="bg-white border border-slate-200 rounded-xl">

          <div className="px-6 py-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">
              Data Kepala Desa
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Informasi kepala desa yang sedang menjabat.
            </p>
          </div>

          <div className="p-6 space-y-5">

            {/* Nama Kepala Desa */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Nama Kepala Desa
              </label>

              <input
                type="text"
                value={namaKepalaDesa}
                onChange={(e) =>
                  setNamaKepalaDesa(e.target.value)
                }
                className="w-full h-11 border border-slate-300 rounded-lg px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Nama kepala desa"
              />
            </div>

            {/* Jabatan */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Jabatan
              </label>

              <input
                type="text"
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                className="w-full h-11 border border-slate-300 rounded-lg px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Jabatan"
              />
            </div>

          </div>
        </section>


        {/* ========================================= */}
        {/* SAVE BUTTON */}
        {/* ========================================= */}

        <div className="flex justify-end pt-2 pb-6">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>

      </form>
    </div>
  </div>
)
}

export default Pengaturan