
import { useEffect, useState } from "react";
import { Files, Plus } from "lucide-react";

import {
  getTemplates,
  addTemplate,
  deleteTemplate as hapusTemplateAPI,
} from "../../services/templateService";

import FormTemplateSurat from "./FormTemplateSurat";
import TabelTemplateSurat from "./TabelTemplateSurat";
import DetailTemplateSurat from "./DetailTemplateSurat";

// Menyesuaikan data API dengan properti yang dipakai tampilan.
function sesuaikanTemplate(data) {
  if (!Array.isArray(data)) return [];

  return data.map((item) => ({
    ...item,
    id: item.id,
    nama: item.nama ?? item.namaTemplate ?? "",
    fileName: item.fileName ?? item.file_name ?? "",
    isi: item.isi ?? "",
  }));
}

function TemplateSurat() {
  const [templates, setTemplates] = useState([]);
  const [templateDipilih, setTemplateDipilih] = useState(null);

  const [progress, setProgress] = useState(0);
  const [sedangUpload, setSedangUpload] = useState(false);
  const [formTerbuka, setFormTerbuka] = useState(false);

  const [error, setError] = useState("");
  const [sedangMemuat, setSedangMemuat] = useState(true);

  // Mengambil data template dari backend.
  async function muatTemplates() {
    const data = await getTemplates();
    setTemplates(sesuaikanTemplate(data));
  }

  useEffect(() => {
    let masihAktif = true;

    async function ambilTemplates() {
      try {
        const data = await getTemplates();

        if (masihAktif) {
          setTemplates(sesuaikanTemplate(data));
        }
      } catch (err) {
        if (masihAktif) {
          setError(
            err.message || "Gagal mengambil data template dari server.",
          );
        }
      } finally {
        if (masihAktif) {
          setSedangMemuat(false);
        }
      }
    }

    ambilTemplates();

    return () => {
      masihAktif = false;
    };
  }, []);

  // Mengunggah template melalui service API.
  async function tambahTemplate(namaTemplate, fileTemplate) {
    try {
      setError("");
      setProgress(0);
      setSedangUpload(true);

      await addTemplate(
        namaTemplate,
        fileTemplate,
        setProgress,
      );

      await muatTemplates();

      setProgress(0);
      setFormTerbuka(false);

      return true;
    } catch (err) {
      setError(
        err.message || "Gagal mengunggah template ke server.",
      );

      return false;
    } finally {
      setSedangUpload(false);
    }
  }

  // Menghapus template melalui service API.
  async function hapusTemplate(id) {
    const yakin = window.confirm(
      "Apakah kamu yakin ingin menghapus template surat ini?",
    );

    if (!yakin) return;

    try {
      setError("");

      await hapusTemplateAPI(id);

      setTemplates((prev) =>
        prev.filter(
          (item) => String(item.id) !== String(id),
        ),
      );

      if (
        templateDipilih &&
        String(templateDipilih.id) === String(id)
      ) {
        setTemplateDipilih(null);
      }
    } catch (err) {
      setError(
        err.message || "Gagal menghapus template dari server.",
      );
    }
  }

  return (
    <>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* 7A. HEADER TEMPLATE SURAT */}
        <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <Files className="h-5 w-5 text-emerald-600" />
              </div>

              <h2 className="text-lg font-semibold text-slate-800">
                Template Surat
              </h2>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Kelola format surat yang digunakan untuk pelayanan desa.
            </p>
          </div>

          <button
            type="button"
            disabled={sedangUpload}
            onClick={() => {
              setFormTerbuka((prev) => !prev);
              setError("");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            Tambah Template
          </button>
        </div>

        {/* 7B. FORM TAMBAH TEMPLATE */}
        {formTerbuka && (
          <FormTemplateSurat
            onSimpan={tambahTemplate}
            progress={progress}
            sedangUpload={sedangUpload}
            error={error}
            setError={setError}
            onBatal={() => setFormTerbuka(false)}
          />
        )}

        {/* Pesan error dari proses API */}
        {error && !formTerbuka && (
          <p className="px-6 pt-4 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* 7C. DAFTAR TEMPLATE DALAM BENTUK TABEL RINGKAS */}
        {sedangMemuat ? (
          <div className="px-6 py-12 text-center text-sm text-slate-500">
            Memuat data template...
          </div>
        ) : (
          <TabelTemplateSurat
            templates={templates}
            onLihat={setTemplateDipilih}
            onHapus={hapusTemplate}
          />
        )}
      </section>

      {/* 8. MODAL DETAIL / LIHAT TEMPLATE */}
      <DetailTemplateSurat
        template={templateDipilih}
        onTutup={() => setTemplateDipilih(null)}
      />
    </>
  );
}

export default TemplateSurat;
