import { Link } from "react-router-dom";

function RecentLetters({ suratTerbaru }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between p-6 pb-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Surat Terbaru
        </h2>

        <Link
          to="/riwayat"
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-y border-slate-200 bg-emerald-600">
            <tr>
              <th className="px-6 py-4 font-semibold text-white">
                Nomor Surat
              </th>

              <th className="px-6 py-4 font-semibold text-white">
                Jenis Surat
              </th>

              <th className="px-6 py-4 font-semibold text-white">
                Pemohon
              </th>

              <th className="px-6 py-4 font-semibold text-white">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {suratTerbaru.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  Belum ada surat.
                </td>
              </tr>
            ) : (
              suratTerbaru.map((surat) => (
                <tr
                  key={surat.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-6 py-4 text-slate-700">
                    {surat.nomorSurat}
                  </td>

                  <td className="px-6 py-4 text-slate-700">
                    {surat.jenisSurat}
                  </td>

                  <td className="px-6 py-4 text-slate-700">
                    {surat.pemohon}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        surat.status === "Selesai"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {surat.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentLetters;