import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import UploadKTP from "./pages/UploadKTP.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Register from "./pages/Register.jsx";
import KelolaAdmin from "./pages/KelolaAdmin.jsx";
import AdminLayout from "./components/AdminHeader.jsx";
import PengaturanDesa from "./pages/Pengaturan.jsx";

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
          <Route path="/kelola-admin" element={<KelolaAdmin />} />
          <Route path="/kelola-admin/register" element={<Register />} />
          <Route
            path="/pengaturan-desa"
            element={<PengaturanDesa />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;