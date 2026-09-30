import { useState, useRef } from "react";

function UploadKTP() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  function validateFile(selectedFile) {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSizeMB = 5;

    if (!allowedTypes.includes(selectedFile.type)) {
      return "Format file harus JPG atau PNG";
    }
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      return `Ukuran file maksimal ${maxSizeMB}MB`;
    }
    return null;
  }

  function handleFile(selectedFile) {
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      setFile(null);
      setPreview(null);
      return;
    }

    setError("");
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }

  function handleInputChange(e) {
    const selectedFile = e.target.files[0];
    if (selectedFile) handleFile(selectedFile);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Upload Foto KTP</h2>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
    ${isDragging ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleInputChange}
          className="hidden"
        />

        {preview ? (
          <img
            src={preview}
            alt="Preview KTP"
            className="mx-auto max-h-48 rounded-lg"
          />
        ) : (
          <div className="text-slate-500">
            <p className="font-medium">Klik atau seret foto KTP ke sini</p>
            <p className="text-sm mt-1">Format JPG/PNG, maksimal 5MB</p>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <button
        disabled={!file}
        onClick={() => console.log("Submit file:", file)}
        className={`w-full mt-4 py-2 rounded-lg font-medium transition-colors
    ${
      file
        ? "bg-blue-600 text-white hover:bg-blue-700"
        : "bg-slate-200 text-slate-400 cursor-not-allowed"
    }`}
      >
        Proses KTP
      </button>
    </div>
  );
}

export default UploadKTP;
