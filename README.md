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

### ⏳ What Needs To Be Done Next (Pending / Roadmap)

1. **Connecting Live OCR Microservice:**
   - Run the Python OCR FastAPI service (`sistem-persuratan-desa/ocr-service`) and test end-to-end extraction with real KTP sample images (`image.png`).
2. **Template File Assets:**
   - Supply official village Word templates (`.docx`) in `templates/` (`sktm_template.docx`, `sku_template.docx`, `skd_template.docx`) matching village administration standards.
3. **Frontend Integration:**
   - Wire API endpoints with the web UI (`sistem-frontend`): Login page, OCR upload widget, Auto-Fill resident lookup form, and letter download button.
4. **(Optional) PDF Conversion Engine:**
   - Add headless LibreOffice or PDF conversion if direct `.pdf` generation is preferred alongside `.docx`.

### TLDR (Too Long Didn't Read)
- Create basic infrastructure with typescript on express
- Add database system using PrismaORM (MySQL)
- Add authentication system using JWT & bcryptjs for login, register, profile, logout (To be implemented)
- Add OCR microservice using Python FastAPI (To be implemented) 
- Implement NIK lookup endpoint for auto fill feature
- Add document automation with docxtemplater, pizzip, and generate .docx and save to `generated` folder (to be implemented)
- Tested on local server 5000
----