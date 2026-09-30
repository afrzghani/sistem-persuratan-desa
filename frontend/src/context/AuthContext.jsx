// ============================================================
// AUTH CONTEXT
// File ini mengatur status login user di seluruh aplikasi.
//
// AuthContext  → tempat menyimpan & membagikan data auth
// AuthProvider → pembungkus aplikasi agar komponen bisa akses auth
//
// Saat ini login masih DUMMY untuk testing:
// Email    : admin@desa.id
// Password : admin123
//
// Nanti saat backend sudah siap, fungsi login() akan diganti
// dengan request ke API/backend.
// ============================================================
import { createContext, useState } from 'react'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  function login(email, password) {
    if (email === 'admin@desa.id' && password === 'admin123') {
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  function logout() {
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}