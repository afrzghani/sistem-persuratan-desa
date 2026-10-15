function ProfilAdmin({
  adminName,
  setAdminName,
  adminEmail,
  setAdminEmail,
  isEditingPassword,
  setIsEditingPassword,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmNewPassword,
  setConfirmNewPassword,
  passwordError,
  setPasswordError,
  isSavingProfile,
  handleSaveProfile,
  handleChangePassword,
}) {
  // Styling tombol simpan, sama seperti di Pengaturan.jsx
  const saveButtonClass =
    'inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300';

  // Styling bagian bawah card, sama seperti di Pengaturan.jsx
  const cardFooterClass =
    'flex justify-end border-t border-slate-100 px-6 py-4';

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-6 py-5">
        <h3 className="font-semibold text-slate-800">Profil Admin</h3>
        <p className="mt-1 text-sm text-slate-500">
          Informasi akun admin yang sedang digunakan.
        </p>
      </div>

      <div className="space-y-5 p-6">
        {/* Nama Admin */}
        <div>
          <label
            htmlFor="admin-name"
            className="mb-2 block text-sm font-medium text-slate-600"
          >
            Nama Admin
          </label>
          <input
            id="admin-name"
            type="text"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="Nama admin"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="admin-email"
            className="mb-2 block text-sm font-medium text-slate-600"
          >
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="admin@desa.id"
          />
        </div>

        {/* Password */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Password
          </label>

          {!isEditingPassword ? (
            <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Password akun
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  Password tersimpan secara aman
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPasswordError('');
                  setIsEditingPassword(true);
                }}
                className="shrink-0 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Ubah Password
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleChangePassword}
              className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-5"
            >
              <div className="mb-4">
                <p className="text-sm font-semibold text-slate-700">
                  Ubah Password
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Masukkan password lama dan password baru kamu.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="current-password"
                    className="mb-2 block text-sm font-medium text-slate-600"
                  >
                    Password Saat Ini
                  </label>
                  <input
                    id="current-password"
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Masukkan password saat ini"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="new-password"
                    className="mb-2 block text-sm font-medium text-slate-600"
                  >
                    Password Baru
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Minimal 6 karakter"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirm-new-password"
                    className="mb-2 block text-sm font-medium text-slate-600"
                  >
                    Konfirmasi Password Baru
                  </label>
                  <input
                    id="confirm-new-password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Ulangi password baru"
                    required
                  />
                </div>

                {passwordError && (
                  <p role="alert" className="text-sm text-red-500">
                    {passwordError}
                  </p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingPassword(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmNewPassword('');
                      setPasswordError('');
                    }}
                    className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className={saveButtonClass}
                  >
                    Simpan Password
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className={cardFooterClass}>
        <button
          type="button"
          onClick={handleSaveProfile}
          disabled={isSavingProfile}
          className={saveButtonClass}
        >
          {isSavingProfile ? 'Menyimpan...' : 'Simpan Profil'}
        </button>
      </div>
    </section>
  );
}

export default ProfilAdmin;
