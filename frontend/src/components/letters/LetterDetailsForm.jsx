function LetterDetailsForm({ formData, onChange, selectedType }) {
  function handleChange(event) {
    const { name, value } = event.target;
    onChange(name, value);
  }

  const letterTitles = {
    domicile: "Surat Keterangan Domisili",
    business: "Surat Keterangan Usaha",
    introduction: "Surat Pengantar",
    birth: "Surat Keterangan Kelahiran",
  };
console.log("selectedType:", selectedType);
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
      <div className="mb-6">

        <h2 className="mt-2 text-lg font-bold text-slate-800">
          Keperluan Surat
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          Lengkapi informasi yang diperlukan agar surat dapat dibuat sesuai
          tujuan pengajuan.
        </p>
      </div>

      <div className="rounded-xl bg-emerald-600 p-4">
        <p className="text-xs font-medium text-white">
          Jenis surat yang dipilih
        </p>

        <p className="mt-1 font-semibold text-white">
          {letterTitles[selectedType] || "Belum memilih jenis surat"}
        </p>
      </div>

      <div className="mt-5">
        <label
          htmlFor="purpose"
          className="text-sm font-medium text-slate-700"
        >
          Tujuan atau keperluan
        </label>

        <textarea
          id="purpose"
          name="purpose"
          value={formData.purpose ?? ""}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Jelaskan tujuan penggunaan surat"
          className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />

        <p className="mt-1.5 text-xs text-slate-500">
          Contoh: persyaratan administrasi pekerjaan atau pengajuan beasiswa.
        </p>
      </div>
    </section>
  );
}

export default LetterDetailsForm;
