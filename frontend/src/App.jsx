import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/home'
import Login from './pages/login'
import Dashboard from './pages/dashboard'
import UploadKTP from './pages/uploadKTP'
import Riwayat from './pages/riwayat'
import ProtectedRoute from './components/ProtectedRoute'
import Register from './pages/register'
import KelolaAdmin from './pages/KelolaAdmin'
import AdminLayout from './components/AdminLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman publik */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Halaman yang membutuhkan login */}
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadKTP />} />
          <Route path="/riwayat" element={<Riwayat />} />
          <Route path="/kelola-admin" element={<KelolaAdmin />} />
          <Route path="/kelola-admin/register" element={<Register />} />
        </Route>

        {/* Home dari branch sebelumnya */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App