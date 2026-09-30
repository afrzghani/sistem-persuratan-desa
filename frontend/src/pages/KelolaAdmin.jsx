import { Link } from 'react-router-dom'

function KelolaAdmin() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Kelola Admin</h1>
<Link
  to="/kelola-admin/register"
  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
>
  + Tambah Admin
</Link>
      </div>

      {/* List admin nanti di sini, sementara placeholder dulu */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <p className="text-slate-400 text-sm">Daftar admin akan tampil di sini.</p>
      </div>
    </div>
  )
}

export default KelolaAdmin