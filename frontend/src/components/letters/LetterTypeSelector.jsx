
import { useState } from "react";
import { Search, X, FileText } from "lucide-react";

const letterTypes = [
  {
    id: "domicile",
    title: "Surat Keterangan Domisili",
    description: "Keterangan tempat tinggal penduduk.",
  },
  {
    id: "business",
    title: "Surat Keterangan Usaha",
    description: "Keterangan kepemilikan usaha.",
  },
  {
    id: "introduction",
    title: "Surat Pengantar",
    description: "Pengantar untuk keperluan administrasi.",
  },
  {
    id: "birth",
    title: "Surat Keterangan Kelahiran",
    description: "Keterangan peristiwa kelahiran.",
  },
  {
    id: "example-5",
    title: "Jenis Surat 5",
    description: "Nama surat menunggu konfirmasi desa.",
  },
  {
    id: "example-6",
    title: "Jenis Surat 6",
    description: "Nama surat menunggu konfirmasi desa.",
  },
  {
    id: "example-7",
    title: "Jenis Surat 7",
    description: "Nama surat menunggu konfirmasi desa.",
  },
  {
    id: "example-8",
    title: "Jenis Surat 8",
    description: "Nama surat menunggu konfirmasi desa.",
  },
];

function LetterTypeSelector({ selectedType, onSelect }) {
  const [search, setSearch] = useState("");

  const filteredLetterTypes = letterTypes.filter((letter) =>
    `${letter.title} ${letter.description}`
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  const isSingleResult = filteredLetterTypes.length === 1;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
      {/* Header */}
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <FileText className="h-6 w-6" strokeWidth={1.8} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Pilih Jenis Surat
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Tentukan dokumen yang ingin dibuat untuk pemohon.
          </p>
        </div>
      </div>

      {/* Search jenis surat */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama jenis surat..."
            aria-label="Cari jenis surat"
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Hapus pencarian"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {search && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-slate-500">
              Ditemukan {filteredLetterTypes.length} jenis surat
            </p>

            <button
              type="button"
              onClick={() => setSearch("")}
              className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              <X className="h-4 w-4" />
              Reset pencarian
            </button>
          </div>
        )}
      </div>

      {/* Daftar jenis surat */}
      {filteredLetterTypes.length > 0 ? (
        <div
          className={`overflow-y-auto pr-2 ${
            isSingleResult ? "" : "max-h-[363px]"
          }`}
        >
          <div
            className={`grid grid-cols-1 gap-3 ${
              isSingleResult ? "" : "sm:grid-cols-2"
            }`}
          >
            {filteredLetterTypes.map((letter) => {
              const isSelected = selectedType === letter.id;

              return (
                <button
                  key={letter.id}
                  type="button"
                  onClick={() => onSelect(letter.id)}
                  aria-pressed={isSelected}
                  className={`relative min-h-[110px] rounded-xl border p-4 text-left transition ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-600 ring-2 ring-emerald-100"
                      : "border-slate-200 hover:border-emerald-300 hover:bg-slate-50"
                  }`}
                >
                  {/* Indikator pilihan */}
                  <span
                    className={`absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border ${
                      isSelected
                        ? "border-white bg-white text-emerald-600"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="h-4 w-4"
                        aria-hidden="true"
                      >
                        <path
                          d="m4 10 4 4 8-8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>

                  {/* Nama surat */}
                  <h3
                    className={`pr-10 font-semibold leading-6 ${
                      isSelected ? "text-white" : "text-slate-800"
                    }`}
                  >
                    {letter.title}
                  </h3>

                  {/* Deskripsi surat */}
                  <p
                    className={`mt-1 pr-10 text-sm leading-5 ${
                      isSelected ? "text-white/90" : "text-slate-500"
                    }`}
                  >
                    {letter.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Hasil pencarian kosong */
        <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center">
          <Search className="mx-auto h-8 w-8 text-slate-300" />

          <p className="mt-3 text-sm font-medium text-slate-700">
            Jenis surat tidak ditemukan
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Coba gunakan kata kunci lain.
          </p>

          <button
            type="button"
            onClick={() => setSearch("")}
            className="mt-3 text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            Reset pencarian
          </button>
        </div>
      )}
    </section>
  );
}

export default LetterTypeSelector;
