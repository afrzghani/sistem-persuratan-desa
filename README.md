# sistem-persuratan-desa

# Backend API - Sistem Pelayanan Surat Desa Gempolkurung

RESTful API backend for village letter administration services with e-KTP OCR integration and automated document generation, tailored for Desa Gempolkurung, Kec. Menganti, Kab. Gresik.

---

## 📋 Batch 1 Development Report

### 🎯 Summary
The initial development phase establishes the core backend architecture using **Node.js, Express.js, TypeScript, and Prisma ORM (MySQL)**, fully aligned with the software specifications documented in the SRS (**SKPL**).

---

### ✅ What's Done

1. **Project Architecture & Tooling Setup**
   - Initialized TypeScript configuration (`tsconfig.json`) with strict type safety (`NodeNext`, `ES2022`).
   - Configured high-performance dev environment using `tsx` watcher (`npm run dev`).
   - Setup environment variable management (`src/config/env.ts`, `.env.example`).
   - Built standardized API response utility (`successResponse`, `errorResponse`).

2. **Database Modeling & ORM (Prisma & MySQL)**
   - Created database models in `prisma/schema.prisma`:
     - `User`: Operator/Admin accounts with role-based attributes.
     - `Resident`: Centralized population records indexed by 16-digit `nik` (Single Source of Truth).
     - `LetterTemplate`: Registered village letter template configurations.
     - `IssuedLetter`: Historical logs of generated letters.
   - Generated Prisma Client (`@prisma/client`) with full TypeScript autocomplete.
   - Implemented database seeder (`prisma/seed.ts`) populating default operator account, 3 letter templates (`SKTM`, `SKU`, `SKD`), and a sample resident.

3. **Authentication & Authorization (SKPL Sec. 5.1 & 5.2)**
   - User registration & login with password hashing via `bcryptjs`.
   - Form validation via `zod` enforcing email format and minimum 6-character password rules.
   - Stateless JWT generation and token verification middleware (`authMiddleware.ts`).
   - Current user profile retrieval (`GET /api/auth/me`) and logout endpoint.

4. **KTP OCR Orchestration (SKPL Sec. 4.3 & 6.1)**
   - Upload middleware using `multer` with 5MB file-size limit and image MIME-type filter.
   - Service client (`ocrService.ts`) to proxy uploaded KTP image buffers to the Python FastAPI OCR microservice (`/ocr/ktp`).
   - Automatic cross-referencing: checks whether extracted NIK already exists in the local database.

5. **Resident Data Management (SKPL Sec. 6.2 - Auto-Fill Flow)**
   - Query resident by 16-digit NIK (`GET /api/residents/nik/:nik`) for auto-filling letter request forms.
   - Resident listing with pagination and search (`GET /api/residents`).
   - Resident upsert endpoint (`POST /api/residents`) to register new citizens or update existing profiles.

6. **Document Automation Engine (Docxtemplater)**
   - Configured `docxtemplater` + `pizzip` pipeline (`docxtemplaterService.ts`).
   - Variable mapper replacing placeholders (`{{nik}}`, `{{nama}}`, `{{alamat}}`, `{{nomor_surat}}`, `{{tanggal_surat}}`, etc.).
   - Letter issuance endpoint (`POST /api/letters/issue`) rendering `.docx` documents and persisting issuance history to `issued_letters`.
   - File download route (`GET /api/letters/download/:filename`) with directory traversal protection.

---

### 🟢 What's Working & Verified

| Feature / Component | Status | Details |
| :--- | :---: | :--- |
| **Server Startup** | `WORKING` | Boots on port `5000` with Helmet security headers & CORS enabled. |
| **Health Check (`GET /health`)** | `WORKING` | Verified live response returning JSON status and timestamp. |
| **Root Welcome (`GET /`)** | `WORKING` | Verified response returning API guide. |
| **TypeScript Compilation** | `WORKING` | `tsc --noEmit` passes with **0 type errors**. |
| **Prisma Client Generation** | `WORKING` | Type bindings fully generated into `node_modules/@prisma/client`. |
| **Input Validation** | `WORKING` | Zod schema validation blocks invalid emails & short passwords. |
| **Error Handling** | `WORKING` | Centralized `errorHandler` catches Zod errors (422) and Multer limits (413). |

---

---

## 📋 Batch 2 Integration Report (OCR, Official Template, & Frontend Web UI)

### 🎯 Summary
Batch 2 completes the end-to-end integration across all three system tiers:
1. **Live OCR Microservice** (`FastAPI` + `PaddleOCR` on port `8000`).
2. **Backend Document Engine & Official Template** (`Express` + `Prisma` + `Docxtemplater` on port `5000`).
3. **Frontend Web UI** (`React` + `Vite` + `Tailwind CSS` on port `5173`).

---

### ✅ What's Done in Batch 2

1. **Live OCR Microservice Integration**
   - Active Python FastAPI OCR service listening on `http://127.0.0.1:8000/ocr/ktp`.
   - Secured via `X-API-Key` authentication.
   - Tested and verified with real Indonesian e-KTP images (`dummy_ohim.png`), extracting NIK, Nama, Tempat/Tgl Lahir, Jenis Kelamin, Alamat, RT/RW, Agama, Status Perkawinan, and Pekerjaan.

2. **Official Letter Template Integration & Normalization**
   - Added official village template `C_SURAT KETERANGAN BELUM MENIKAH.docx` with template code `SKBM`.
   - Normalized tag delimiters (`{{...}}`) and repaired single brace occurrences (`{Tempat}`, `{Tanggal}`).
   - Registered `SKBM` into MySQL database via `prisma/seed.ts`.
   - Updated `letterController.ts` to map both PascalCase (`Nama`, `NIK`, `Tempat`, `Tanggal`, `Alamat`, `No_Surat`, `Keterangan`, `Keperluan`, `Tanggal_Surat`, `Kepala_Desa`) and snake_case aliases.
   - Added dynamic `customData` payload support for non-KTP custom template fields.
   - Verified 100% tag replacement in generated documents (0 unreplaced tags).

3. **Frontend Integration (`sistem-frontend`)**
   - Configured environment variable `VITE_BACKEND_URL=http://localhost:5000` in `.env`.
   - Updated `AuthContext.jsx` and `Login.jsx` to authenticate against `POST /api/auth/login`, persisting JWT tokens to `localStorage` and attaching them to subsequent requests.
   - Created API client `src/services/letterService.js` providing methods for `scanKtp`, `saveResident`, `getLetterTemplates`, and `issueLetter`.
   - Modernized `UploadKTP.jsx` into a 3-step letter creation wizard:
     - **Step 1: Unggah KTP**: Drag-and-drop or file picker with instant preview.
     - **Step 2: AI OCR Scanning & Verifikasi**: Auto-populates all extracted citizen fields, allows operator corrections, and configures letter parameters (`Nomor Surat`, `Keperluan`, `Keterangan`).
     - **Step 3: Terbitkan & Unduh**: Issues letter, logs record to database, and presents an instant download button for the generated `.docx` document.
   - Built and validated frontend bundle with Vite (`npm run build`) and launched development server on `http://localhost:5173`.

---

### 🟢 What's Working & Verified in Batch 2

| Feature / Component | Status | Details |
| :--- | :---: | :--- |
| **Python OCR Microservice** | `WORKING` | Running on port `8000`, processes e-KTP images and returns standardized JSON. |
| **OCR Proxy Route (`POST /api/ocr/ktp`)** | `WORKING` | Forwards image buffers, verifies JWT, and cross-references existing residents. |
| **Resident Upsert (`POST /api/residents`)** | `WORKING` | Persists scanned resident data to MySQL database (`residents` table). |
| **Template Registration (`SKBM`)** | `WORKING` | Seeded in database, loaded dynamically via `GET /api/letters/templates`. |
| **Letter Issuance (`POST /api/letters/issue`)** | `WORKING` | Renders `C_SURAT KETERANGAN BELUM MENIKAH.docx` with 100% tag resolution. |
| **File Download (`GET /api/letters/download/:file`)** | `WORKING` | Streams generated `.docx` documents with correct MIME type headers. |
| **Frontend Web UI (`http://localhost:5173`)** | `WORKING` | React application running with live login, OCR upload wizard, and letter download. |

---

### ⏳ What Needs To Be Done Next (Batch 3 Roadmap)

1. **Batch Template Enrollment**:
   - Register the remaining 18+ village templates into database seeds and configure dynamic fields.
2. **Dashboard Statistics Integration**:
   - Wire `/api/dashboard` analytics with Recharts visualizations on the frontend dashboard page.
3. **Arsip & Riwayat Surat UI**:
   - Build letter issuance history table with pagination and re-download capability (`/riwayat`).
4. **(Optional) PDF Conversion Engine**:
   - Add headless LibreOffice converter if PDF downloads are requested.

---

### TLDR (Too Long Didn't Read)
- **Batch 1**: Built core backend architecture with Node.js, Express, TypeScript, Prisma ORM, and Docxtemplater.
- **Batch 2**: Fully integrated OCR microservice (Python FastAPI + PaddleOCR), official village template (`SKBM`), and frontend web UI (React + Tailwind CSS). Users can now upload e-KTP images via browser, auto-fill resident data, and generate downloadable official `.docx` letters end-to-end.
----