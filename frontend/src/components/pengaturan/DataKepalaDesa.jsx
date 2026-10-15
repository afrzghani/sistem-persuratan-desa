
function DataKepalaDesa({
  namaKepalaDesa,
  setNamaKepalaDesa,
  jabatan,
  setJabatan,
  handleSaveKepalaDesa,
  isSavingKepalaDesa,
}) {
  // Styling tombol simpan
  const saveButtonClass =
    'inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300';

  // Styling bagian bawah card
  const cardFooterClass =
    'flex justify-end border-t border-slate-100 px-6 py-4';

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-6 py-5">
        <h3 className="font-semibold text-slate-800">
          Data Kepala Desa
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Informasi kepala desa yang sedang menjabat.
        </p>
      </div>

      <div className="space-y-5 p-6">
        {/* Nama Kepala Desa */}
        <div>
          <label
            htmlFor="nama-kepala-desa"
            className="mb-2 block text-sm font-medium text-slate-600"
          >
            Nama Kepala Desa
          </label>

          <input
            id="nama-kepala-desa"
            type="text"
            value={namaKepalaDesa}
            onChange={(e) => setNamaKepalaDesa(e.target.value)}
            className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="Nama kepala desa"
          />
        </div>

        {/* Jabatan */}
        <div>
          <label
            htmlFor="jabatan-kepala-desa"
            className="mb-2 block text-sm font-medium text-slate-600"
          >
            Jabatan
          </label>

          <input
            id="jabatan-kepala-desa"
            type="text"
            value={jabatan}
            onChange={(e) => setJabatan(e.target.value)}
            className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="Jabatan"
          />
        </div>
      </div>

      <div className={cardFooterClass}>
        <button
          type="button"
          onClick={handleSaveKepalaDesa}
          disabled={isSavingKepalaDesa}
          className={saveButtonClass}
        >
          {isSavingKepalaDesa
            ? 'Menyimpan...'
            : 'Simpan Data Kepala Desa'}
        </button>
      </div>
    </section>
  );
}

export default DataKepalaDesa;
