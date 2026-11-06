import { useEffect, useState } from "react";
import { Files, Plus, X } from "lucide-react";

import { createTemplate, getTemplates } from "../../services/templateService";

import TabelTemplateSurat from "./TabelTemplateSurat";
import DetailTemplateSurat from "./DetailTemplateSurat";
import FormTemplateSurat from "./FormTemplateSurat";

function sesuaikanTemplate(data) {
  if (!Array.isArray(data)) return [];

  return data.map((item) => ({
    ...item,
    id: item.id,
    nama: item.namaSurat ?? "",
    fileName: item.templateFile ?? "",
    isi: item.deskripsi ?? "",
  }));
}

function TemplateSurat() {
  const [templates, setTemplates] = useState([]);
  const [templateDipilih, setTemplateDipilih] = useState(null);
  const [error, setError] = useState("");
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [formTerbuka, setFormTerbuka] = useState(false);
  const [sedangUpload, setSedangUpload] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formError, setFormError] = useState("");
  const [pesanSukses, setPesanSukses] = useState("");

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
            err.message || "Gagal mengambil data template dari server."
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

  async function simpanTemplate(data) {
    setSedangUpload(true);
    setProgress(0);
    setFormError("");
    setPesanSukses("");

    try {
      const templateBaru = await createTemplate(data, setProgress);

      setTemplates((daftar) =>
        [...daftar, ...sesuaikanTemplate([templateBaru])].sort((a, b) =>
          a.nama.localeCompare(b.nama),
        ),
      );
      setFormTerbuka(false);
      setPesanSukses(
        `Template "${templateBaru.namaSurat}" berhasil ditambahkan.`,
      );

      return true;
    } catch (err) {
      setFormError(err.message || "Gagal menambahkan template.");
      return false;
    } finally {
      setSedangUpload(false);
    }
  }

  function bukaForm() {
    setFormError("");
    setPesanSukses("");
    setFormTerbuka(true);
  }

  return (
    <>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
                Daftar format surat yang terdaftar di server.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                formTerbuka ? setFormTerbuka(false) : bukaForm()
              }
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              {formTerbuka ? (
                <X className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}

              {formTerbuka ? "Tutup Form" : "Tambah Template"}
            </button>
          </div>
        </div>

        {error && <p className="px-6 pt-4 text-sm text-red-600">{error}</p>}

        {pesanSukses && (
          <p className="px-6 pt-4 text-sm text-emerald-600">{pesanSukses}</p>
        )}

        {formTerbuka && (
          <FormTemplateSurat
            onSimpan={simpanTemplate}
            progress={progress}
            sedangUpload={sedangUpload}
            error={formError}
            setError={setFormError}
            onBatal={() => setFormTerbuka(false)}
          />
        )}

        {sedangMemuat ? (
          <div className="px-6 py-12 text-center text-sm text-slate-500">
            Memuat data template...
          </div>
        ) : (
          <TabelTemplateSurat
            templates={templates}
            onLihat={setTemplateDipilih}
          />
        )}
      </section>

      <DetailTemplateSurat
        template={templateDipilih}
        onTutup={() => setTemplateDipilih(null)}
      />
    </>
  );
}

export default TemplateSurat;
