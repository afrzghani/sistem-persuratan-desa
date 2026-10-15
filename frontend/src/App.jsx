import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateLetter from "./pages/CreateLetter";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import KelolaAdmin from "./pages/KelolaAdmin.jsx";
import DataWarga from "./pages/DataWarga.jsx";
import AdminLayout from "./components/AdminHeader.jsx";
import PengaturanDesa from "./pages/Pengaturan.jsx";
import Riwayat from "./pages/Riwayat.jsx";

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
          <Route path="/upload" element={<CreateLetter />} />
          <Route path="/warga" element={<DataWarga />} />
          <Route path="/kelola-admin" element={<KelolaAdmin />} />
          <Route path="/pengaturan-desa" element={<PengaturanDesa />}/>
          <Route path="/riwayat" element={<Riwayat/>}/>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;