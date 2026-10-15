
import { useState } from "react";
import { registerAdmin } from "../../services/authService";

function FormTambahAdmin({ onSuccess, onCancel }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [sedangMenyimpan, setSedangMenyimpan] = useState(false);

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function tambahAdmin(e) {
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

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setSedangMenyimpan(true);

    try {
      await registerAdmin({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      onSuccess();
    } catch (err) {
      setError(err.message || "Gagal mendaftarkan admin.");
    } finally {
      setSedangMenyimpan(false);
    }
  }

  function batalTambahAdmin() {
    if (sedangMenyimpan) return;

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");

    onCancel();
  }

  return (
    <form
      onSubmit={tambahAdmin}
      className="border-b border-slate-100 p-6"
    >
      {/* Nama admin */}
      <div>
        <label
          htmlFor="nama-admin"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Nama Admin
        </label>

        <input
          id="nama-admin"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: Andi Saputra"
          required
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* Email admin */}
      <div className="mt-4">
        <label
          htmlFor="email-admin"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Email
        </label>

        <input
          id="email-admin"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@desa.id"
          required
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* Password */}
      <div className="mt-4">
        <label
          htmlFor="password-admin"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Password
        </label>

        <input
          id="password-admin"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimal 6 karakter"
          autoComplete="new-password"
          required
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* Konfirmasi password */}
      <div className="mt-4">
        <label
          htmlFor="konfirmasi-password-admin"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Konfirmasi Password
        </label>

        <input
          id="konfirmasi-password-admin"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Ulangi password"
          autoComplete="new-password"
          required
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* Pesan error */}
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Tombol formulir */}
      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={sedangMenyimpan}
          onClick={batalTambahAdmin}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={sedangMenyimpan}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {sedangMenyimpan ? "Menyimpan..." : "Simpan Admin"}
        </button>
      </div>
    </form>
  );
}

export default FormTambahAdmin;
