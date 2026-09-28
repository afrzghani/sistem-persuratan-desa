# Backend API - Sistem Pelayanan Surat Desa Gempolkurung

RESTful API backend for village letter administration services with e-KTP OCR integration and automated document generation.

## 🛠 Tech Stack
- **Runtime & Language:** Node.js & TypeScript
- **Web Framework:** Express.js
- **Database ORM:** Prisma ORM (MySQL)
- **Document Engine:** `docxtemplater` + `pizzip`
- **Authentication:** JWT & bcryptjs
- **File Upload:** Multer (Memory buffer forwarding to Python OCR FastAPI service)
- **Validation:** Zod

---

## 🚀 Getting Started

### 1. Requirements
- Node.js >= 18
- MySQL Server (e.g. XAMPP, Docker, or Cloud MySQL)
- Python OCR FastAPI Service running on `http://127.0.0.1:8000`

### 2. Setup Environment
Copy `.env.example` to `.env` and configure your database connection string:
```bash
cp .env.example .env
```

### 3. Database Migration & Seed
Run Prisma migrations to create the database tables, then run the seed script:
```bash
npx prisma migrate dev --name init
npm run prisma:seed
```

Default seeded credentials:
- **Email:** `operator@gempolkurung.desa.id`
- **Password:** `password123`

### 4. Running the Development Server
```bash
npm run dev
```

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Login operator/admin desa | No |
| `POST` | `/api/auth/register` | Register new operator | No |
| `GET` | `/api/auth/me` | Get current logged-in operator | Yes (Bearer Token) |
| `POST` | `/api/auth/logout` | Logout operator session | No |

### 🔍 OCR Service Proxy (`/api/ocr`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ocr/ktp` | Upload KTP image (multipart, max 5MB) and extract data | Yes |

### 👥 Data Kependudukan / Resident (`/api/residents`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/residents/nik/:nik` | Auto-fill query by 16-digit NIK | Yes |
| `GET` | `/api/residents?search=&page=&limit=` | List residents with pagination & search | Yes |
| `POST` | `/api/residents` | Save / Upsert resident data | Yes |

### 📄 Letter Issuing & Automation (`/api/letters`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/letters/templates` | List active letter templates | Yes |
| `POST` | `/api/letters/issue` | Generate letter (.docx) and record issuance | Yes |
| `GET` | `/api/letters/history?page=&limit=` | View letter issuing history | Yes |
| `GET` | `/api/letters/download/:filename` | Download generated `.docx` document | No / Direct |