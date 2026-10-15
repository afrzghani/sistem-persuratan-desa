
function InformasiDesa({
  namaDesa,
  setNamaDesa,
  kecamatan,
  setKecamatan,
  kabupaten,
  setKabupaten,
  alamatDesa,
  setAlamatDesa,
  isSavingDesa,
  handleSaveInformasiDesa,
}) {
  const saveButtonClass =
    'inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300';

  const cardFooterClass =
    'flex justify-end border-t border-slate-100 px-6 py-4';

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-6 py-5">
        <h3 className="font-semibold text-slate-800">Informasi Desa</h3>
        <p className="mt-1 text-sm text-slate-500">
          Informasi umum mengenai desa.
        </p>
      </div>

      <div className="space-y-5 p-6">
        {/* Nama Desa */}
        <div>
          <label
            htmlFor="nama-desa"
            className="mb-2 block text-sm font-medium text-slate-600"
          >
            Nama Desa
          </label>
          <input
            id="nama-desa"
            type="text"
            value={namaDesa}
            onChange={(e) => setNamaDesa(e.target.value)}
            className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="Nama desa"
          />
        </div>

        {/* Kecamatan */}
        <div>
          <label
            htmlFor="kecamatan"
            className="mb-2 block text-sm font-medium text-slate-600"
          >
            Kecamatan
          </label>
          <input
            id="kecamatan"
            type="text"
            value={kecamatan}
            onChange={(e) => setKecamatan(e.target.value)}
            className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="Nama kecamatan"
          />
        </div>

        {/* Kabupaten */}
        <div>
          <label
            htmlFor="kabupaten"
            className="mb-2 block text-sm font-medium text-slate-600"
          >
            Kabupaten
          </label>
          <input
            id="kabupaten"
            type="text"
            value={kabupaten}
            onChange={(e) => setKabupaten(e.target.value)}
            className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="Nama kabupaten"
          />
        </div>

        {/* Alamat Desa */}
        <div>
          <label
            htmlFor="alamat-desa"
            className="mb-2 block text-sm font-medium text-slate-600"
          >
            Alamat Desa
          </label>
          <textarea
            id="alamat-desa"
            value={alamatDesa}
            onChange={(e) => setAlamatDesa(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="Alamat lengkap desa"
            rows={3}
          />
        </div>
      </div>

      <div className={cardFooterClass}>
        <button
          type="button"
          onClick={handleSaveInformasiDesa}
          disabled={isSavingDesa}
          className={saveButtonClass}
        >
          {isSavingDesa ? 'Menyimpan...' : 'Simpan Informasi Desa'}
        </button>
      </div>
    </section>
  );
}

export default InformasiDesa;
