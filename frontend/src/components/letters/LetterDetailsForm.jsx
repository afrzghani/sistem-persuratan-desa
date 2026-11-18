
function LetterDetailsForm({
  formData,
  onChange,
  selectedTitle,
  templateFields = [],
  onCustomDataChange,
}) {
  function handleChange(event) {
    const { name, value } = event.target;
    onChange(name, value);
  }

  function handleCustomChange(event) {
    const { name, value } = event.target;
    if (onCustomDataChange) {
      onCustomDataChange(name, value);
    }
  }

  return (
    <section className="space-y-6">
      {templateFields.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <div className="mb-6">
            <h2 className="mt-2 text-lg font-bold text-slate-800">
              Informasi Khusus Surat
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Lengkapi data tambahan yang dibutuhkan khusus untuk jenis surat ini.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {templateFields.map((field) => {
              const value = formData.customData?.[field.name] ?? "";

              if (field.type === "select") {
                return (
                  <div key={field.name} className="flex flex-col">
                    <label
                      htmlFor={field.name}
                      className="text-sm font-medium text-slate-700"
                    >
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>

                    <select
                      id={field.name}
                      name={field.name}
                      value={value}
                      onChange={handleCustomChange}
                      required={field.required}
                      className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="">-- Pilih {field.label} --</option>
                      {(field.options || []).map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              return (
                <div key={field.name} className="flex flex-col">
                  <label
                    htmlFor={field.name}
                    className="text-sm font-medium text-slate-700"
                  >
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>

                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type || "text"}
                    value={value}
                    onChange={handleCustomChange}
                    required={field.required}
                    placeholder={field.placeholder || ""}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
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
            {selectedTitle || "Belum memilih jenis surat"}
          </p>
        </div>

        <div className="mt-5">
          <label
            htmlFor="nomorSurat"
            className="text-sm font-medium text-slate-700"
          >
            Nomor Surat
          </label>

          <input
            id="nomorSurat"
            name="nomorSurat"
            value={formData.nomorSurat ?? ""}
            onChange={handleChange}
            required
            placeholder="Contoh: 470/123/2026"
            className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />

          <p className="mt-1.5 text-xs text-slate-500">
            Nomor surat harus unik dan belum pernah dipakai.
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
      </div>
    </section>
  );
}

export default LetterDetailsForm;