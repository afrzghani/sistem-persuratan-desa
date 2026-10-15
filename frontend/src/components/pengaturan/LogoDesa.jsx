
function LogoDesa({
  logoPreview,
  logoFile,
  handleLogoChange,
  handleSaveLogo,
  isSavingLogo,
}) {
  // Styling tombol simpan, sama seperti di Pengaturan.jsx
  const saveButtonClass =
    'inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300';

  // Styling bagian bawah card
  const cardFooterClass =
    'flex justify-end border-t border-slate-100 px-6 py-4';

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-6 py-5">
        <h3 className="font-semibold text-slate-800">
          Logo Desa
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Atur logo yang digunakan pada identitas desa.
        </p>
      </div>

      <div className="p-6">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          {/* Preview Logo */}
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-2">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Preview Logo Desa"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-center text-xs text-slate-400">
                  Belum ada logo
                </span>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700">
                Logo Desa
              </p>

              <p className="mt-1 text-xs text-slate-400">
                JPG atau PNG, maksimal 5 MB
              </p>
            </div>
          </div>

          {/* Pilih Logo */}
          <label className="inline-flex cursor-pointer items-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
            Ganti Logo

            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleLogoChange}
              className="hidden"
            />
          </label>
        </div>

        {logoFile && (
          <p className="mt-4 text-sm text-slate-500">
            Logo baru dipilih: {logoFile.name}
          </p>
        )}
      </div>

      <div className={cardFooterClass}>
        <button
          type="button"
          onClick={handleSaveLogo}
          disabled={!logoFile || isSavingLogo}
          className={saveButtonClass}
        >
          {isSavingLogo ? 'Menyimpan...' : 'Simpan Logo'}
        </button>
      </div>
    </section>
  );
}

export default LogoDesa;
