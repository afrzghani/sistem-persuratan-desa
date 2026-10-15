
import { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";

import LetterTypeSelector from "../components/letters/LetterTypeSelector";
import KTPUploader from "../components/letters/KTPUploader";
import ApplicantForm from "../components/letters/ApplicantForm";
import LetterDetailsForm from "../components/letters/LetterDetailsForm";
import LetterPreview from "../components/letters/LetterPreview";
import { simpanSurat } from "../services/suratService";
import { simpanWarga } from "../services/wargaService";

const initialFormData = {
  nik: "",
  fullName: "",
  birthPlace: "",
  birthDate: "",
  gender: "",
  religion: "",
  maritalStatus: "",
  occupation: "",
  address: "",
  rt: "",
  rw: "",
  purpose: "",
};

const steps = ["Pilih jenis surat", "Unggah KTP", "Periksa data"];

const letterTitles = {
  domicile: "Surat Keterangan Domisili",
  business: "Surat Keterangan Usaha",
  introduction: "Surat Pengantar",
  birth: "Surat Keterangan Kelahiran",
  "example-5": "Jenis Surat 5",
  "example-6": "Jenis Surat 6",
  "example-7": "Jenis Surat 7",
  "example-8": "Jenis Surat 8",
};

function CreateLetter() {
  const [step, setStep] = useState(() => {
    const savedStep = Number(sessionStorage.getItem("createLetterStep"));
    return [1, 2, 3].includes(savedStep) ? savedStep : 1;
  });

  const [letterType, setLetterType] = useState(
    () => sessionStorage.getItem("createLetterType") || ""
  );

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("createLetterStep", String(step));
  }, [step]);

  useEffect(() => {
    sessionStorage.setItem("createLetterType", letterType);
  }, [letterType]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

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
      // Simulasi sementara, belum memanggil API OCR.
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStep(3);
    } catch {
      setError("Terjadi kesalahan saat memproses KTP.");
    } finally {
      setIsProcessing(false);
    }
  }

  function handleGenerate() {
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
      ["purpose", "Keperluan surat"],
    ];

    const missingField = requiredFields.find(
      ([name]) => !String(formData[name] ?? "").trim()
    );

    if (missingField) {
      window.alert(`Mohon lengkapi ${missingField[1]}.`);
      return;
    }

    if (!/^\d{16}$/.test(formData.nik)) {
      window.alert("NIK harus terdiri dari 16 digit angka.");
      return;
    }

    setShowPreview(true);
  }

  
function handleCompleteLetter() {
  const dataWarga = {
    nik: formData.nik.trim(),
    nama: formData.fullName.trim(),
    tempatLahir: formData.birthPlace,
    tanggalLahir: formData.birthDate,
    jenisKelamin: formData.gender,
    agama: formData.religion,
    statusPerkawinan: formData.maritalStatus,
    pekerjaan: formData.occupation,
    alamat: formData.address,
    rt: formData.rt,
    rw: formData.rw,
  };

  const suratBaru = {
    id: crypto.randomUUID(),
    nomorSurat: `DRAFT-${Date.now()}`,
    jenisSurat: letterTitles[letterType] || "Surat Keterangan",
    pemohon: formData.fullName,
    tanggal: new Date().toISOString(),
    status: "Selesai",
    dataPemohon: { ...formData },
    keperluan: formData.purpose,
  };

  try {
    // Simpan atau perbarui data warga berdasarkan NIK.
    simpanWarga(dataWarga);

    // Simpan riwayat surat seperti sebelumnya.
    simpanSurat(suratBaru);

    sessionStorage.removeItem("createLetterStep");
    sessionStorage.removeItem("createLetterType");

    window.location.href = "/riwayat";
  } catch (saveError) {
    console.error("Gagal menyimpan data warga atau surat:", saveError);
    window.alert(
      "Data warga atau surat gagal disimpan. Silakan coba kembali."
    );
  }
}


  if (showPreview) {
    return (
      <LetterPreview
        formData={formData}
        letterType={letterType}
        onBack={() => setShowPreview(false)}
        onComplete={handleCompleteLetter}
      />
    );
  }

  return (
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
              selectedType={letterType}
              onSelect={setLetterType}
            />

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setStep(2);
                }}
                disabled={!letterType}
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
            onBack={() => {
              setError("");
              setStep(1);
            }}
            isProcessing={isProcessing}
          />
        )}

        {step === 3 && (
          <>
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-800">
                Mode pengembangan
              </p>

              <p className="mt-1 text-sm leading-6 text-amber-700">
                OCR belum terhubung. Isi data pemohon secara manual untuk
                menguji tampilan formulir.
              </p>
            </div>

            <div className="space-y-6">
              <ApplicantForm
                formData={formData}
                onChange={handleFormChange}
              />

              <LetterDetailsForm
                formData={formData}
                onChange={handleFormChange}
                selectedType={letterType}
              />
            </div>

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
                className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Buat Surat
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default CreateLetter;
