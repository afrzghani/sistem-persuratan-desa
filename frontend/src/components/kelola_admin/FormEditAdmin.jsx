import { useState } from "react";
import { updateAdmin } from "../../services/adminService";

function FormEditAdmin({ admin, onSuccess, onCancel }) {
  const [name, setName] = useState(admin.name || "");
  const [email, setEmail] = useState(admin.email || "");
  const [error, setError] = useState("");
  const [sedangMenyimpan, setSedangMenyimpan] = useState(false);

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function simpanPerubahan(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Nama admin harus diisi.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Format email tidak valid.");
      return;
    }

    setSedangMenyimpan(true);

    try {
      await updateAdmin(admin.id, {
        name: name.trim(),
        email: email.trim(),
      });

      onSuccess();
    } catch (err) {
      setError(err.message || "Gagal memperbarui data admin.");
    } finally {
      setSedangMenyimpan(false);
    }
  }

  function batalEditAdmin() {
    if (sedangMenyimpan) return;

    setError("");
    onCancel();
  }

  return (
    <form onSubmit={simpanPerubahan} className="border-b border-slate-100 p-6">
      <div>
        <label
          htmlFor="edit-nama-admin"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Nama Admin
        </label>

        <input
          id="edit-nama-admin"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: Andi Saputra"
          required
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="edit-email-admin"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Email
        </label>

        <input
          id="edit-email-admin"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@desa.id"
          required
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={sedangMenyimpan}
          onClick={batalEditAdmin}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={sedangMenyimpan}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {sedangMenyimpan ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}

export default FormEditAdmin;
