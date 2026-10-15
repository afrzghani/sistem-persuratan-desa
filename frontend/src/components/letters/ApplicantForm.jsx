
const fields = [
  {
    name: "nik",
    label: "NIK",
    type: "text",
    placeholder: "Masukkan 16 digit NIK",
    required: true,
  },
  {
    name: "fullName",
    label: "Nama lengkap",
    type: "text",
    placeholder: "Nama sesuai KTP",
    required: true,
  },
  {
    name: "birthPlace",
    label: "Tempat lahir",
    type: "text",
    placeholder: "Masukkan tempat lahir",
    required: true,
  },
  {
    name: "birthDate",
    label: "Tanggal lahir",
    type: "date",
    required: true,
  },
  {
    name: "gender",
    label: "Jenis kelamin",
    type: "select",
    options: [
      { value: "", label: "Pilih jenis kelamin" },
      { value: "Laki-laki", label: "Laki-laki" },
      { value: "Perempuan", label: "Perempuan" },
    ],
    required: true,
  },
  {
    name: "religion",
    label: "Agama",
    type: "select",
    options: [
      { value: "", label: "Pilih agama" },
      { value: "Islam", label: "Islam" },
      { value: "Kristen", label: "Kristen" },
      { value: "Katolik", label: "Katolik" },
      { value: "Hindu", label: "Hindu" },
      { value: "Buddha", label: "Buddha" },
      { value: "Konghucu", label: "Konghucu" },
    ],
    required: true,
  },
  {
    name: "maritalStatus",
    label: "Status perkawinan",
    type: "select",
    options: [
      { value: "", label: "Pilih status perkawinan" },
      { value: "Belum Kawin", label: "Belum kawin" },
      { value: "Kawin", label: "Kawin" },
      { value: "Cerai Hidup", label: "Cerai hidup" },
      { value: "Cerai Mati", label: "Cerai mati" },
    ],
    required: true,
  },
  {
    name: "occupation",
    label: "Pekerjaan",
    type: "text",
    placeholder: "Masukkan pekerjaan",
    required: true,
  },
];

function ApplicantForm({ formData, onChange }) {
  function handleChange(event) {
    const { name, value } = event.target;
    onChange(name, value);
  }

  function renderField(field) {
    const commonProps = {
      id: field.name,
      name: field.name,
      value: formData[field.name] ?? "",
      onChange: handleChange,
      required: field.required,
      className:
        "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
    };

    return (
      <div key={field.name}>
        <label
          htmlFor={field.name}
          className="text-sm font-medium text-slate-700"
        >
          {field.label}
        </label>

        {field.type === "select" ? (
          <select {...commonProps}>
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            {...commonProps}
            type={field.type}
            placeholder={field.placeholder}
            maxLength={field.name === "nik" ? 16 : undefined}
            inputMode={field.name === "nik" ? "numeric" : undefined}
            pattern={field.name === "nik" ? "[0-9]{16}" : undefined}
          />
        )}
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
      <div className="mb-6">

        <h2 className="text-lg font-bold text-slate-800">
          Periksa Data Pemohon
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          Periksa kembali data identitas. Jika ada kesalahan pembacaan OCR,
          perbaiki sebelum melanjutkan.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {fields.map(renderField)}
      </div>

      <div className="mt-5">
        <label
          htmlFor="address"
          className="text-sm font-medium text-slate-700"
        >
          Alamat lengkap
        </label>

        <textarea
          id="address"
          name="address"
          value={formData.address ?? ""}
          onChange={handleChange}
          required
          rows={3}
          placeholder="Masukkan alamat sesuai KTP"
          className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="rt"
            className="text-sm font-medium text-slate-700"
          >
            RT
          </label>

          <input
            id="rt"
            name="rt"
            value={formData.rt ?? ""}
            onChange={handleChange}
            placeholder="Nomor RT"
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label
            htmlFor="rw"
            className="text-sm font-medium text-slate-700"
          >
            RW
          </label>

          <input
            id="rw"
            name="rw"
            value={formData.rw ?? ""}
            onChange={handleChange}
            placeholder="Nomor RW"
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>
    </section>
  );
}

export default ApplicantForm;