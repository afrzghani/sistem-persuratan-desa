import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logoDesa from "../assets/logodesa.png";

function AdminHeader() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const navClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? "bg-white/20 text-white font-medium"
        : "text-white/90 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-64 min-h-screen flex flex-col">
        {/* Header Sidebar */}
        <div className="bg-white p-5">
          <div className="w-full flex flex-col items-center gap-3">
            <div className="w-40">
              <img
                src={logoDesa}
                alt="Logo Desa"
                className="w-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Menu Sidebar */}
        <div className="flex-1 bg-emerald-600 p-5">
          <nav className="space-y-2">
            <NavLink to="/dashboard" end className={navClass}>
              Dashboard
            </NavLink>

            <NavLink to="/upload" className={navClass}>
              Buat Surat
            </NavLink>

            <NavLink to="/riwayat" className={navClass}>
              Arsip Surat
            </NavLink>

            <NavLink to="/warga" className={navClass}>
              Data Warga
            </NavLink>

            <NavLink to="/kelola-admin" className={navClass}>
              Kelola Admin
            </NavLink>
            <NavLink to="/pengaturan-desa" className={navClass}>
              Pengaturan Desa
            </NavLink>
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full mt-8 bg-red-500 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Konten halaman aktif */}
      <main className="ml-64 flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminHeader;
