import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerAdmin } from '../services/authService'


function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!validateEmail(email)) {
      setError('Format email tidak valid')
      return
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter')
      return
    }
    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok')
      return
    }

    setIsLoading(true)
    try {
      await registerAdmin({ name, email, password })
navigate('/kelola-admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

return (
    
  <div className="min-h-[calc(100vh-3rem)] -m-6 bg-white p-8">
    <form onSubmit={handleSubmit} className="w-full">
      <h1 className="text-2xl font-bold text-slate-800 mb-8">
        Tambah Akun Admin
      </h1>

      <label className="block text-sm font-medium text-slate-600 mb-1">
        Nama
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border border-slate-300 rounded-lg px-4 py-3 mb-5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        placeholder="Nama admin"
      />

      <label className="block text-sm font-medium text-slate-600 mb-1">
        Email
      </label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-slate-300 rounded-lg px-4 py-3 mb-5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        placeholder="admin@desa.id"
      />

      <label className="block text-sm font-medium text-slate-600 mb-1">
        Password
      </label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border border-slate-300 rounded-lg px-4 py-3 mb-5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        placeholder="••••••••"
      />

      <label className="block text-sm font-medium text-slate-600 mb-1">
        Konfirmasi Password
      </label>
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full border border-slate-300 rounded-lg px-4 py-3 mb-5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        placeholder="••••••••"
      />

      {error && (
        <p className="text-red-500 text-sm mb-5">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:bg-slate-300"
      >
        {isLoading ? 'Memproses...' : 'Daftarkan Admin'}
      </button>
    </form>
  </div>
)
}

export default Register