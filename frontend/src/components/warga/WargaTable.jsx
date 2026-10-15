
import {
  Search,
  UserRound,
  Plus,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

function WargaTable({
  warga,
  wargaDitampilkan,
  pencarian,
  setPencarian,
  bukaForm,
  bukaDetail,
  handleHapus,
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Header daftar warga */}
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <UserRound size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">
              Daftar Warga
            </h2>
            <p className="text-sm text-slate-500">
              Total {warga.length} warga terdaftar
            </p>
          </div>
        </div>

        {/* Pencarian dan tombol tambah */}
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[360px]">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Cari NIK atau nama warga..."
              value={pencarian}
              onChange={(event) => setPencarian(event.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <button
            type="button"
            onClick={() => bukaForm()}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <Plus size={18} />
            Tambah Warga
          </button>
        </div>
      </div>

      {/* Tabel warga dengan scroll */}
      <div className="max-h-[480px] overflow-auto">
        <table className="w-full min-w-[900px] table-fixed text-left text-sm">
          <colgroup>
            <col className="w-[23%]" />
            <col className="w-[19%]" />
            <col className="w-[18%]" />
            <col className="w-[25%]" />
            <col className="w-[15%]" />
          </colgroup>

          <thead className="sticky top-0 z-10 bg-emerald-600 text-white">
            <tr>
              <th className="px-5 py-4 font-semibold">
                NIK
              </th>
              <th className="px-5 py-4 font-semibold">
                Nama Lengkap
              </th>
              <th className="px-5 py-4 font-semibold">
                Jenis Kelamin
              </th>
              <th className="px-5 py-4 font-semibold">
                Alamat
              </th>
              <th className="px-3 py-4 text-center font-semibold">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {wargaDitampilkan.length > 0 ? (
              wargaDitampilkan.map((item) => (
                <tr
                  key={item.nik}
                  className="transition hover:bg-slate-50"
                >
                  <td className="whitespace-nowrap px-5 py-4 text-left text-slate-700">
                    {item.nik}
                  </td>

                  <td className="break-words px-5 py-4  text-slate-700">
                    {item.nama}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {item.jenisKelamin || "-"}
                  </td>

                  <td className="break-words px-5 py-4 text-slate-700">
                    <p>{item.alamat || "-"}</p>
                    <p className="mt-1 text-xs text-slate-600">
                      RT {item.rt || "-"} / RW {item.rw || "-"}
                    </p>
                  </td>

                  <td className="px-3 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        title="Lihat detail"
                        aria-label={`Lihat detail ${item.nama}`}
                        onClick={() => bukaDetail(item)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-500  transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        title="Edit warga"
                        aria-label={`Edit ${item.nama}`}
                        onClick={() => bukaForm(item)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        title="Hapus warga"
                        aria-label={`Hapus ${item.nama}`}
                        onClick={() => handleHapus(item.nik)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center">
                  {warga.length === 0 ? (
                    <div className="flex flex-col items-center">
                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <UserRound size={26} />
                      </div>

                      <h3 className="font-semibold text-slate-800">
                        Belum ada data warga
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Data warga yang tersimpan akan muncul di sini.
                      </p>

                      <button
                        type="button"
                        onClick={() => bukaForm()}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                      >
                        <Plus size={17} />
                        Tambah warga pertama
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Search
                        size={28}
                        className="mb-3 text-slate-400"
                      />

                      <h3 className="font-semibold text-slate-800">
                        Warga tidak ditemukan
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Coba gunakan kata kunci pencarian yang lain.
                      </p>

                      <button
                        type="button"
                        onClick={() => setPencarian("")}
                        className="mt-4 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                      >
                        Reset pencarian
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default WargaTable;
