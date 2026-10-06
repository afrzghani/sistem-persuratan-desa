import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logoDesa from "../assets/logodesa.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  //Regular Expression (Regex)----------------------
  function validateEmail(value) {
    //hasil hanya true/false
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Format email tidak valid");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    const success = login(email, password);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Email atau password salah");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg">
        {/* Bagian kiri */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-emerald-600 text-white p-8">
          <div className="w-full max-w-xl text-left">
            <h1 className="text-3xl font-bold mb-2">Selamat Datang!</h1>

            <h2 className="text-xl font-semibold mb-4">
              Sistem Administrasi dan Pelayanan Desa
            </h2>

            <p className="mb-8 leading-relaxed">
              Platform digital untuk memudahkan pengelolaan administrasi,
              persuratan, dan pendataan warga desa secara terintegrasi.
            </p>

            <div className="space-y-5">
              {/* Fitur 1 */}
              <div className="flex items-center gap-4">
                <svg
                  className="w-7 h-7 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 22v-6h6v6"
                  />
                </svg>

                <span className="text-base">
                  Pelayanan Administrasi Kependudukan
                </span>
              </div>

              {/* Fitur 2 */}
              <div className="flex items-center gap-4">
                <svg
                  className="w-7 h-7 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 2h9l5 5v15H6a2 2 0 01-2-2V4a2 2 0 012-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 2v6h6"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 13h8M8 17h6"
                  />
                </svg>

                <span className="text-base">
                  Pengajuan Surat Administrasi Desa
                </span>
              </div>

              {/* Fitur 3 */}
              <div className="flex items-center gap-4">
                <svg
                  className="w-7 h-7 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                  />
                  <circle cx="9" cy="7" r="4" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                  />
                </svg>

                <span className="text-base">Pendataan Warga Desa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bagian kanan */}
        <form onSubmit={handleSubmit} className="w-1/2 bg-white p-8">
          <img src={logoDesa} alt="Logo Desa" className="w-50 object-contain" />

          <h1 className="text-xl font-bold my-3 text-slate-800 ">
            Login Admin
          </h1>

          <label className="block text-sm font-medium text-slate-600 mb-1">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 outline-none focus:border-emerald-500"
            placeholder="admin@desa.id"
          />

          <label className="block text-sm font-medium text-slate-600 mb-1">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 outline-none focus:border-emerald-500"
            placeholder="••••••••"
          />

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
