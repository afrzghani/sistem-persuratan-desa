
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";

import LetterTypeSelector from "../components/letters/LetterTypeSelector";
import KTPUploader from "../components/letters/KTPUploader";
import ApplicantForm from "../components/letters/ApplicantForm";
import LetterDetailsForm from "../components/letters/LetterDetailsForm";
import LetterPreview from "../components/letters/LetterPreview";
import ModalPemberitahuan from "../components/ModalPemberitahuan";

import { extractKtp } from "../services/ocrService";
import {
  getDownloadUrl,
  getDraftSurat,
  hapusDraftSurat,
  issueLetter,
  simpanDraftSurat,
  updateLetterStatus,
} from "../services/letterService";
import { tambahWarga } from "../services/wargaService";

const initialFormData = {
  nik: "",
  fullName: "",
  birthPlace: "",
  birthDate: "",
  gender: "",
  bloodType: "",
  religion: "",
  maritalStatus: "",
  occupation: "",
  address: "",
  rt: "",
  rw: "",
  purpose: "",
  nomorSurat: "",
  keterangan: "",
};

const steps = ["Pilih jenis surat", "Unggah KTP", "Periksa data"];

function toDateInput(value) {
  if (!value) return "";

  const text = String(value).trim();
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (iso) {
    return `${iso[1]}-${iso[2]}-${iso[3]}`;
  }

  const dmy = text.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);

  if (dmy) {
    return `${dmy[3]}-${String(dmy[2]).padStart(2, "0")}-${String(
      dmy[1]
    ).padStart(2, "0")}`;
  }

  const date = new Date(text);

  if (!Number.isNaN(date.getTime())) {
    return date.toISOString().slice(0, 10);
  }

  return "";
}

function normalizeGender(value) {
  const text = String(value ?? "").toLowerCase();

  if (text.includes("laki") || text.includes("pria") || text.includes("male")) {
    return "Laki-laki";
  }

  if (
    text.includes("perempuan") ||
    text.includes("wanita") ||
    text.includes("female")
  ) {
    return "Perempuan";
  }

  return value || "";
}

function mapProfile(profile = {}) {
  return {
    nik: profile.nik ?? "",
    fullName: profile.nama ?? "",
    birthPlace: profile.tempatLahir ?? "",
    birthDate: toDateInput(profile.tanggalLahir),
    gender: normalizeGender(profile.jenisKelamin),
    bloodType: profile.golonganDarah ?? "",
    religion: profile.agama ?? "",
    maritalStatus: profile.statusPerkawinan ?? "",
    occupation: profile.pekerjaan ?? "",
    address: profile.alamat ?? "",
    rt: profile.rt ?? "",
    rw: profile.rw ?? "",
  };
}

function mapTemplateDraft(template) {
  if (!template) return null;

  return {
    id: String(template.id ?? ""),
    kodeSurat: template.kodeSurat ?? "",
    title: template.namaSurat ?? "Template tanpa nama",
    description: template.deskripsi ?? "",
  };
}

function toResidentPayload(formData) {
  return {
    nik: formData.nik,
    nama: formData.fullName,
    tempatLahir: formData.birthPlace,
    tanggalLahir: formData.birthDate,
    jenisKelamin: formData.gender,
    golonganDarah: formData.bloodType || undefined,
    alamat: formData.address,
    rt: formData.rt,
    rw: formData.rw,
    agama: formData.religion,
    statusPerkawinan: formData.maritalStatus,
    pekerjaan: formData.occupation,
    kelDesa: "Gempolkurung",
    kecamatan: "Menganti",
    kabupaten: "Gresik",
    kewarganegaraan: "WNI",
  };
}

function CreateLetter() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [generatedLetter, setGeneratedLetter] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [notifikasi, setNotifikasi] = useState(null);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Lanjutkan draft yang belum selesai saat halaman dibuka kembali.
  useEffect(() => {
    let aktif = true;

    getDraftSurat()
      .then((draft) => {
        if (!aktif || !draft) return;

        setSelectedTemplate(mapTemplateDraft(draft.template));
        setFormData({ ...initialFormData, ...(draft.formData || {}) });
        setStep(Math.min(Math.max(Number(draft.step) || 1, 1), 3));

        if (draft.issuedLetter) {
          setGeneratedLetter({
            issuedLetter: draft.issuedLetter,
            downloadUrl: getDownloadUrl(draft.issuedLetter.generatedFile),
          });
          setShowPreview(true);
        }
      })
      .catch(() => {
        // Draft bersifat opsional; abaikan bila gagal dimuat.
      });

    return () => {
      aktif = false;
    };
  }, []);

  // Simpan draft otomatis saat sudah masuk tahap 2 ke atas.
  useEffect(() => {
    if (step < 2 || !selectedTemplate?.id || showPreview || generatedLetter) {
      return;
    }

    const timer = setTimeout(() => {
      simpanDraftSurat({
        templateId: Number(selectedTemplate.id),
        step,
        formData,
      }).catch(() => undefined);
    }, 500);

    return () => clearTimeout(timer);
  }, [formData, step, selectedTemplate, showPreview, generatedLetter]);

  async function handleFile(selectedFile) {
    setError("");

    if (!selectedFile) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Format file harus JPG atau PNG.");
      return;
    }

    if (selectedFile.size > maxSize) {
      setError("Ukuran file maksimal 5 MB.");
      return;
    }

    try {
      setIsProcessing(true);

      const compressedFile = await imageCompression(selectedFile, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
        fileType: selectedFile.type,
      });

      const previewUrl = URL.createObjectURL(compressedFile);

      setFile(compressedFile);
      setPreview(previewUrl);
    } catch (compressionError) {
      console.error("Gagal mengompres foto KTP:", compressionError);
      setError("Foto KTP gagal diproses. Silakan coba foto lain.");
    } finally {
      setIsProcessing(false);
    }
  }

  function removeFile() {
    setFile(null);
    setPreview("");
    setError("");
  }

  function handleFormChange(name, value) {
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  async function handleProcessKTP() {
    if (!file) {
      setError("Silakan unggah foto KTP terlebih dahulu.");
      return;
    }

    setError("");
    setIsProcessing(true);

    try {
      const data = await extractKtp(file);
      const profile = data?.existingProfile || data?.extracted || {};

      setFormData((previousData) => ({
        ...previousData,
        ...mapProfile(profile),
      }));

      setStep(3);
    } catch (err) {
      setError(
        err.message ||
          "OCR KTP gagal diproses. Kamu bisa mengisi data secara manual."
      );
    } finally {
      setIsProcessing(false);
    }
  }

  function handleSkipOcr() {
    setError("");
    setStep(3);
  }

  async function handleGenerate() {
    const requiredFields = [
      ["nik", "NIK"],
      ["fullName", "Nama lengkap"],
      ["birthPlace", "Tempat lahir"],
      ["birthDate", "Tanggal lahir"],
      ["gender", "Jenis kelamin"],
      ["religion", "Agama"],
      ["maritalStatus", "Status perkawinan"],
      ["occupation", "Pekerjaan"],
      ["address", "Alamat lengkap"],
      ["nomorSurat", "Nomor surat"],
      ["purpose", "Keperluan surat"],
    ];

    const missingField = requiredFields.find(
      ([name]) => !String(formData[name] ?? "").trim()
    );

    if (missingField) {
      setError(`Mohon lengkapi ${missingField[1]}.`);
      return;
    }

    if (!/^\d{16}$/.test(formData.nik)) {
      setError("NIK harus terdiri dari 16 digit angka.");
      return;
    }

    if (!selectedTemplate?.id) {
      setError("Jenis surat belum dipilih.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await tambahWarga(toResidentPayload(formData));

      const payload = {
        residentNik: formData.nik,
        templateId: Number(selectedTemplate.id),
        nomorSurat: formData.nomorSurat.trim(),
        keperluan: formData.purpose.trim(),
      };

      if (formData.keterangan.trim()) {
        payload.keterangan = formData.keterangan.trim();
      }

      await simpanDraftSurat({
        templateId: Number(selectedTemplate.id),
        step: 3,
        formData,
      });

      const result = await issueLetter(payload);

      setGeneratedLetter(result);
      setShowPreview(true);
    } catch (err) {
      setNotifikasi({
        judul: "Surat gagal dibuat",
        pesan: err.message || "Gagal membuat surat. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCompleteLetter() {
    const issuedLetterId = generatedLetter?.issuedLetter?.id;

    if (issuedLetterId) {
      try {
        setIsCompleting(true);
        await updateLetterStatus(issuedLetterId, "Selesai");
      } catch (err) {
        setNotifikasi({
          judul: "Surat gagal diselesaikan",
          pesan: err.message || "Gagal menyelesaikan surat. Silakan coba lagi.",
        });
        setIsCompleting(false);
        return;
      }
    }

    await hapusDraftSurat().catch(() => undefined);

    setStep(1);
    setSelectedTemplate(null);
    setFile(null);
    setPreview("");
    setError("");
    setFormData(initialFormData);
    setGeneratedLetter(null);
    setShowPreview(false);
    setIsCompleting(false);

    navigate("/riwayat");
  }

  if (showPreview) {
    return (
      <>
        <LetterPreview
          formData={formData}
          letterTitle={selectedTemplate?.title}
          letterNumber={formData.nomorSurat}
          downloadUrl={generatedLetter?.downloadUrl}
          fileName={generatedLetter?.issuedLetter?.generatedFile}
          error={error}
          isCompleting={isCompleting}
          onBack={() => setShowPreview(false)}
          onComplete={handleCompleteLetter}
        />

        <ModalPemberitahuan
          terbuka={Boolean(notifikasi)}
          judul={notifikasi?.judul || ""}
          pesan={notifikasi?.pesan || ""}
          onTutup={() => setNotifikasi(null)}
        />
      </>
    );
  }

  return (
    <>
    <main className="min-h-full -m-6 bg-slate-50 px-6 py-8">
      <div className="mx-auto">
        <div className="mb-8">
          <div className="mb-1 flex items-center gap-2 text-sm">
            <span className="text-slate-500">Dashboard</span>
            <span className="text-slate-500">/</span>
            <span className="font-medium text-emerald-600">
              Buat Surat
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-800">
            Buat Surat
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Buat surat administrasi desa.
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
          <div className="flex items-start">
            {steps.map((label, index) => {
              const stepNumber = index + 1;
              const isActive = step === stepNumber;
              const isCompleted = step > stepNumber;

              return (
                <div
                  key={label}
                  className={`relative flex flex-1 flex-col items-center ${
                    index < steps.length - 1
                      ? "after:absolute after:left-1/2 after:top-4 after:h-0.5 after:w-full after:bg-slate-200"
                      : ""
                  }`}
                >
                  <div
                    className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                      isCompleted
                        ? "bg-emerald-600 text-white"
                        : isActive
                          ? "border-2 border-emerald-600 bg-white text-emerald-700"
                          : "border border-slate-300 bg-white text-slate-500"
                    }`}
                  >
                    {isCompleted ? (
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-4 w-4"
                        aria-hidden="true"
                      >
                        <path
                          d="m4 10 4 4 8-8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      stepNumber
                    )}
                  </div>

                  <span
                    className={`mt-2 text-center text-xs sm:text-sm ${
                      isActive || isCompleted
                        ? "font-semibold text-emerald-700"
                        : "text-slate-500"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {step === 1 && (
          <>
            <LetterTypeSelector
              selectedTemplate={selectedTemplate}
              onSelect={setSelectedTemplate}
            />

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!selectedTemplate) {
                    setError("Silakan pilih jenis surat terlebih dahulu.");
                    return;
                  }

                  setError("");
                  simpanDraftSurat({
                    templateId: Number(selectedTemplate.id),
                    step: 2,
                    formData,
                  }).catch(() => undefined);
                  setStep(2);
                }}
                disabled={!selectedTemplate}
                className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Lanjutkan
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <KTPUploader
            file={file}
            preview={preview}
            error={error}
            onFileChange={handleFile}
            onRemove={removeFile}
            onProcess={handleProcessKTP}
            onSkip={handleSkipOcr}
            onBack={() => {
              setError("");
              setStep(1);
            }}
            isProcessing={isProcessing}
          />
        )}

        {step === 3 && (
          <>
            <div className="space-y-6">
              <ApplicantForm
                formData={formData}
                onChange={handleFormChange}
              />

              <LetterDetailsForm
                formData={formData}
                onChange={handleFormChange}
                selectedTitle={selectedTemplate?.title}
              />
            </div>

            {error && (
              <p
                role="alert"
                className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse justify-between gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Kembali ke unggah KTP
              </button>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isSubmitting}
                className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Membuat surat..." : "Buat Surat"}
              </button>
            </div>
          </>
        )}
      </div>
    </main>

    <ModalPemberitahuan
      terbuka={Boolean(notifikasi)}
      judul={notifikasi?.judul || ""}
      pesan={notifikasi?.pesan || ""}
      onTutup={() => setNotifikasi(null)}
    />
    </>
  );
}

export default CreateLetter;
