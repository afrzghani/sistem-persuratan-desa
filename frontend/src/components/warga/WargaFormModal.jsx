
import { X } from "lucide-react";

function WargaFormModal({
  form,
  sedangEdit,
  error,
  inputClass,
  handleChange,
  handleSimpan,
  tutupForm,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Header modal */}
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {sedangEdit ? "Edit Data Warga" : "Tambah Warga"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Lengkapi informasi identitas warga.
            </p>
          </div>

          <button
            type="button"
            onClick={tutupForm}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Tutup modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSimpan} className="space-y-5 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                NIK
              </label>
              <input
                type="text"
                name="nik"
                value={form.nik}
                onChange={handleChange}
                maxLength={16}
                inputMode="numeric"
                readOnly={sedangEdit}
                placeholder="Masukkan 16 digit NIK"
                className={`${inputClass} ${
                  sedangEdit ? "cursor-not-allowed bg-slate-100" : ""
                }`}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Nama lengkap warga"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Tempat Lahir
              </label>
              <input
                type="text"
                name="tempatLahir"
                value={form.tempatLahir}
                onChange={handleChange}
                placeholder="Kota tempat lahir"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Tanggal Lahir
              </label>
              <input
                type="date"
                name="tanggalLahir"
                value={form.tanggalLahir}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Jenis Kelamin
              </label>
              <select
                name="jenisKelamin"
                value={form.jenisKelamin}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Pilih jenis kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Agama
              </label>
              <select
                name="agama"
                value={form.agama}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Pilih agama</option>
                <option value="Islam">Islam</option>
                <option value="Kristen">Kristen</option>
                <option value="Katolik">Katolik</option>
                <option value="Hindu">Hindu</option>
                <option value="Buddha">Buddha</option>
                <option value="Konghucu">Konghucu</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Status Perkawinan
              </label>
              <select
                name="statusPerkawinan"
                value={form.statusPerkawinan}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Pilih status perkawinan</option>
                <option value="Belum Kawin">Belum Kawin</option>
                <option value="Kawin">Kawin</option>
                <option value="Cerai Hidup">Cerai Hidup</option>
                <option value="Cerai Mati">Cerai Mati</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Pekerjaan
              </label>
              <input
                type="text"
                name="pekerjaan"
                value={form.pekerjaan}
                onChange={handleChange}
                placeholder="Pekerjaan warga"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                RT
              </label>
              <input
                type="text"
                name="rt"
                value={form.rt}
                onChange={handleChange}
                placeholder="Nomor RT"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                RW
              </label>
              <input
                type="text"
                name="rw"
                value={form.rw}
                onChange={handleChange}
                placeholder="Nomor RW"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Alamat
            </label>
            <textarea
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              rows={3}
              placeholder="Masukkan alamat lengkap warga"
              className={`${inputClass} resize-y`}
            />
          </div>

          {/* Pesan validasi */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Tombol aksi */}
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={tutupForm}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Batal
            </button>

            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WargaFormModal;
