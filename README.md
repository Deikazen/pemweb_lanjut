# 🚀 PemWeb Lanjut - Full Stack CRUD Application

Backend sederhana menggunakan **Express.js** dan database menggunakan **Supabase** untuk CRUD landing page. Aplikasi ini terdiri dari dua bagian: Backend (Express.js) dan Frontend (React).

**Frontend:** [https://pemweb-lanjut-frontend.vercel.app](https://pemweb-lanjut-frontend.vercel.app)

---

## 📋 Daftar Isi
- [Gambaran Umum](#gambaran-umum)
- [Stack Teknologi](#stack-teknologi)
- [Struktur Project](#struktur-project)
- [Flowchart Sistem](#flowchart-sistem)
- [Quick Start](#quick-start)
- [Instalasi & Setup](#instalasi--setup)
- [Konfigurasi Environment](#konfigurasi-environment)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Tim Pengembang](#tim-pengembang)

---

## 🎯 Gambaran Umum

Aplikasi ini adalah sistem CRUD lengkap dengan:
- ✅ **Backend API** - Express.js dengan Supabase PostgreSQL
- ✅ **Frontend Dashboard** - React dengan React Router
- ✅ **Authentication** - Sistem login dengan JWT Token
- ✅ **Authorization** - Role-based access (Admin)
- ✅ **CORS Support** - Konfigurasi untuk development dan production
- ✅ **Deployment Ready** - Siap di-deploy ke Vercel

---

## 🛠️ Stack Teknologi

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | - | JavaScript Runtime |
| **Express.js** | ^5.2.1 | Web Framework |
| **Supabase** | ^2.105.1 | PostgreSQL Database & Auth |
| **JWT** | - | Token-based Authentication |
| **CORS** | ^2.8.6 | Cross-Origin Resource Sharing |
| **Midtrans** | ^1.4.3 | Payment Gateway (optional) |
| **Dotenv** | ^17.4.2 | Environment Variable Management |
| **Nodemon** | ^3.1.14 | Development Auto-reload |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | ^19.2.6 | UI Library |
| **React Router** | ^7.15.0 | Client-side Routing |
| **React Scripts** | 5.0.1 | Build & Dev Tools |

---

## 📁 Struktur Project

```
pemweb_lanjut/
├── backend/
│   ├── src/
│   │   ├── index.js                 # Entry point backend
│   │   ├── middleware/
│   │   │   └── authMiddleware.js    # JWT verification & authorization
│   │   ├── routes/
│   │   │   ├── auth.routes.js       # Login endpoint
│   │   │   └── item.routes.js       # CRUD endpoints
│   │   ├── controllers/
│   │   │   ├── authController.js    # Login logic
│   │   │   └── itemController.js    # CRUD logic
│   │   └── db/
│   │       └── supabase.js          # Supabase client
│   ├── .env.example
│   ├── package.json
│   ├── vercel.json                  # Vercel deployment config
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── index.js                 # React entry point
│   │   ├── App.js                   # Main component
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── DashboardPage.js
│   │   │   └── CRUDPage.js
│   │   ├── components/
│   │   │   ├── ItemForm.js
│   │   │   ├── ItemList.js
│   │   │   └── Navigation.js
│   │   ├── services/
│   │   │   └── api.js              # API calls
│   │   └── styles/                 # CSS files
│   ├── package.json
│   ├── .env.development
│   └── README.md
│
├── package.json                     # Root workspace
├── README.md                        # This file
└── .gitignore
```

---

## 🔄 Flowchart Sistem

### 1. **Authentication Flow (Login)**

```
┌─────────────────────────────────────────────────────────────────────┐
│                        LOGIN FLOW                                   │
└─────────────────────────────────────────────────────────────────────┘

   Frontend (React)               Backend (Express)            Database (Supabase)
   ────────────────               ────────────────              ──────────────────

        │                                │                               │
        │  1. User Input Email & Pass    │                               │
        │  ──────────────────────────>   │                               │
        │                                │                               │
        │                       2. POST /api/login                       │
        │                       Validate Input                           │
        │                                │                               │
        │                                │  3. Query Users Table         │
        │                                │  ──────────────────────────>  │
        │                                │                               │
        │                                │  4. Find User Record <─────── │
        │                                │  (email match)                │
        │                                │                               │
        │                       5. Verify Password                       │
        │                       (Supabase auth)                          │
        │                                │                               │
        │                       6. Generate JWT Token                    │
        │                       (sign with secret)                       │
        │                                │                               │
        │  7. Return Token & Message    │                               │
        │  <───────────────────────────  │                               │
        │                                │                               │
        │  8. Store Token in localStorage                               │
        │  Set Authorization Header                                      │
        │                                │                               │
        └─────────────────────────────────────────────────────────────────

        ✅ Success: Token stored, User logged in
        ❌ Fail: Invalid credentials, Error message shown
```

### 2. **CRUD Operations Flow**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CRUD OPERATIONS FLOW                             │
└─────────────────────────────────────────────────────────────────────┘

   Frontend (React)              Backend (Express)             Database (Supabase)
   ────────────────              ────────────────               ──────────────────

        │                               │                                │
        ├─────── CREATE ────────────────┤                                │
        │ POST /api/item               │                                │
        │ + Token (Header)             │                                │
        │ + Item Data (Body)           │                                │
        │ ──────────────────────────>  │                                │
        │                              │ Verify Token                    │
        │                              │ (middleware)                    │
        │                              │                                │
        │                              │ Check User Role = "admin"       │
        │                              │                                │
        │                              │ INSERT INTO items (...)         │
        │                              │ ──────────────────────────────> │
        │                              │                                │
        │ Return Created Item <────────│ <────── Item Data ──────────────│
        │                              │                                │
        │                               │                                │
        ├─────── READ ──────────────────┤                                │
        │ GET /api/item               │                                │
        │ + Token (Header)            │                                │
        │ ──────────────────────────> │                                │
        │                              │ Verify Token                    │
        │                              │ SELECT * FROM items             │
        │                              │ ──────────────────────────────> │
        │                              │                                │
        │ Return Item Array <─────────│ <────── All Items ──────────────│
        │                              │                                │
        │                               │                                │
        ├─────── UPDATE ────────────────┤                                │
        │ PUT /api/item/:id            │                                │
        │ + Token (Header)             │                                │
        │ + Updated Data (Body)        │                                │
        │ ──────────────────────────>  │                                │
        │                              │ Verify Token & Check Role       │
        │                              │ UPDATE items SET ...            │
        │                              │ WHERE id = :id                  │
        │                              │ ──────────────────────────────> │
        │                              │                                │
        │ Return Updated Item <────────│ <────── Updated Data ───────────│
        │                              │                                │
        │                               │                                │
        ├─────── DELETE ────────────────┤                                │
        │ DELETE /api/item/:id        │                                │
        │ + Token (Header)            │                                │
        │ ──────────────────────────> │                                │
        │                              │ Verify Token & Check Role       │
        │                              │ DELETE FROM items               │
        │                              │ WHERE id = :id                  │
        │                              │ ──────────────────────────────> │
        │                              │                                │
        │ Return Success Message <─────│ <───── Confirmation ────────────│
        │                              │                                │
        └──────────────────────────────────────────────────────────────────

        ✅ Success: Data operation completed, state updated in frontend
        ❌ Fail: Unauthorized, Invalid data, or database error
```

### 3. **Complete Application Flow**

```
┌──────────────────────────────────────────────────────────────────────┐
│                   COMPLETE APPLICATION FLOW                          │
└──────────────────────────────────────────────────────────────────────┘

                              START
                                │
                                ▼
                    ┌──────────────────────┐
                    │  User Open Frontend  │
                    └──────────────────────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │  Is User Logged In?  │
                    └──────────────────────┘
                         │          │
                        No         Yes
                         │          │
                         ▼          ▼
                   ┌──────────┐  ┌────────────────┐
                   │ Login    │  │ Show Dashboard │
                   │ Page     │  │                │
                   └──────────┘  └────────────────┘
                         │                │
                         ▼                │
                   ┌──────────────────┐   │
                   │ Enter Email &    │   │
                   │ Password         │   │
                   └──────────────────┘   │
                         │                │
                         ▼                │
                   ┌──────────────────┐   │
                   │ POST /api/login  │   │
                   │ (Verify in DB)   │   │
                   └──────────────────┘   │
                         │                │
                    ┌────┴────┐           │
                   Yes       No          │
                    │         │           │
                    ▼         ▼           │
              ┌────────┐  ┌────────┐     │
              │ Valid  │  │ Invalid│     │
              │ Gen    │  │ Show   │     │
              │ Token  │  │ Error  │     │
              └────────┘  └────────┘     │
                    │         │           │
                    │         └─────┐     │
                    └──────┬────────┘     │
                           ▼             │
                   ┌──────────────────┐   │
                   │ Store Token in   │   │
                   │ localStorage     │   │
                   └──────────────────┘   │
                           │             │
                           ▼             │
                   ┌──────────────────┐   │
                   │ Set Auth Header  │   │
                   │ with Token       │   │
                   └──────────────────┘   │
                           │             │
                           └─────┬───────┘
                                 ▼
                      ┌──────────────────────┐
                      │  Show Dashboard      │
                      │  - View Items        │
                      │  - Create Item       │
                      │  - Edit Item         │
                      │  - Delete Item       │
                      └──────────────────────┘
                                 │
                    ┌────────────┬┴────────────┐
                    │            │            │
                    ▼            ▼            ▼
              ┌──────────┐ ┌──────────┐ ┌──────────┐
              │ GET      │ │ POST/PUT │ │ DELETE   │
              │ Items    │ │ Item     │ │ Item     │
              │ /item    │ │ /item    │ │ /item/:id│
              └──────────┘ └──────────┘ └──────────┘
                    │            │            │
                    └────────────┬┴────────────┘
                                 ▼
                      ┌──────────────────────┐
                      │ Update UI State      │
                      │ Show Success/Error   │
                      └──────────────────────┘
                                 │
                                 ▼
                      ┌──────────────────────┐
                      │ User Logs Out?       │
                      └──────────────────────┘
                         │              │
                        Yes            No
                         │              │
                         ▼              │
                  ┌────────────────┐   │
                  │ Clear Token &  │   │
                  │ localStorage   │   │
                  │ Redirect Login │   │
                  └────────────────┘   │
                         │             │
                         └─────┬───────┘
                               ▼
                            END
```

### 4. **Request/Response Cycle with Authentication**

```
┌─────────────────────────────────────────────────────────────────────┐
│                  REQUEST/RESPONSE WITH AUTH                         │
└─────────────────────────────────────────────────────────────────────┘

Frontend                              Backend
────────                              ───────

1. User Action
   (Click Edit Item)
        │
        ▼
2. Prepare Request
   - Get Token from localStorage
   - Set Headers: {
       Authorization: "Bearer <token>",
       Content-Type: "application/json"
     }
   - Prepare Body Data
        │
        ▼
3. Send Request
   PUT /api/item/123
   ──────────────────────────────────>
                                      ▼
                              4. Receive Request
                                  │
                                  ▼
                              5. Check Headers
                                  - Extract Token
                                  │
                                  ▼
                              6. Verify Token
                                  - Decode JWT
                                  - Check Signature
                                  - Check Expiry
                                  │
                              ┌───┴───┐
                             Valid   Invalid
                              │        │
                              ▼        ▼
                         Continue  Return 401
                              │      │
                              ├──────┤
                              │
                              ▼
                          7. Check Role
                             Is User Admin?
                              │
                          ┌───┴───┐
                         Yes      No
                          │        │
                          ▼        ▼
                    Continue  Return 403
                          │      │
                          ├──────┤
                          │
                          ▼
                      8. Process Request
                         - Validate Data
                         - Query Database
                         - Update Record
                          │
                          ▼
                      9. Prepare Response
                         {
                           success: true,
                           data: {...},
                           message: "Updated"
                         }
        │<──────────────────────────────────
        │
        ▼
10. Receive Response
    - Check Status Code
    - Parse JSON
        │
        ▼
11. Handle Response
    - Success: Update UI
    - Error: Show Error Message
        │
        ▼
12. Update Component State
    - Trigger Re-render
    - Show Success Alert
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v16+ 
- npm atau yarn
- Akun Supabase (free)
- Git

### Langkah Cepat

```bash
# 1. Clone repository
git clone https://github.com/Deikazen/pemweb_lanjut.git
cd pemweb_lanjut

# 2. Install dependencies (dari root folder)
npm install

# 3. Setup environment variables
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env dengan kredensial Supabase Anda

# 4. Run both backend & frontend
npm run dev

# 5. Akses aplikasi
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

---

## 🔧 Instalasi & Setup

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env dengan kredensial Supabase
nano .env
```

**File `.env` Backend:**
```env
PORT=5000
SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_KEY=<your-anon-public-key>
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_secret_key_here
```

**Run Backend:**
```bash
# Development (dengan auto-reload)
npm run dev

# Production
npm start
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm start
```

**File `.env` Frontend** (jika diperlukan):
```env
REACT_APP_API_URL=http://localhost:5000
```

---

## ⚙️ Konfigurasi Environment

### Backend (.env)

| Variable | Required | Deskripsi | Contoh |
|----------|----------|-----------|---------|
| `PORT` | ✅ | Port backend server | `5000` |
| `SUPABASE_URL` | ✅ | URL Supabase project | `https://xxx.supabase.co` |
| `SUPABASE_KEY` | ✅ | Anon public key Supabase | `eyJ...` |
| `FRONTEND_URL` | ✅ | URL frontend (untuk CORS) | `http://localhost:3000` |
| `JWT_SECRET` | ✅ | Secret key untuk sign JWT | `your_secret_123` |

### Frontend (.env)

| Variable | Required | Deskripsi | Contoh |
|----------|----------|-----------|---------|
| `REACT_APP_API_URL` | ⚠️ | Backend API URL | `http://localhost:5000` |

---

## 📡 API Documentation

### Base URL
```
Development: http://localhost:5000
Production: https://your-domain.vercel.app
```

### Authentication Headers
Semua endpoint yang membutuhkan autentikasi harus menyertakan:
```
Authorization: Bearer <token>
Content-Type: application/json
```

### 1. **Root Endpoint**

#### Check Server Status
```http
GET /
```

**Response:**
```json
{
  "message": "App berjalan"
}
```

---

### 2. **Authentication Endpoints**

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response Success (200):**
```json
{
  "message": "Login Berhasil!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Response Error (401):**
```json
{
  "message": "Email atau password salah",
  "success": false
}
```

---

### 3. **Item Endpoints** (Memerlukan Auth + Admin Role)

#### Get All Items
```http
GET /api/item
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "item-1",
    "name": "Produk A",
    "created_at": "2024-06-09T10:00:00Z",
    "updated_at": "2024-06-09T10:00:00Z"
  },
  {
    "id": "item-2",
    "name": "Produk B",
    "created_at": "2024-06-09T11:00:00Z",
    "updated_at": "2024-06-09T11:00:00Z"
  }
]
```

#### Get Item by ID
```http
GET /api/item/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "item-1",
  "name": "Produk A",
  "created_at": "2024-06-09T10:00:00Z",
  "updated_at": "2024-06-09T10:00:00Z"
}
```

#### Create Item
```http
POST /api/item
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Produk Baru"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Item berhasil dibuat",
  "data": {
    "id": "new-item-id",
    "name": "Produk Baru",
    "created_at": "2024-06-09T12:00:00Z",
    "updated_at": "2024-06-09T12:00:00Z"
  }
}
```

#### Update Item
```http
PUT /api/item/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Produk Update"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Item berhasil diupdate",
  "data": {
    "id": "item-1",
    "name": "Produk Update",
    "created_at": "2024-06-09T10:00:00Z",
    "updated_at": "2024-06-09T12:30:00Z"
  }
}
```

#### Delete Item
```http
DELETE /api/item/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Item berhasil dihapus"
}
```

#### Error Response (Unauthorized)
```json
{
  "success": false,
  "message": "Akses ditolak. Token tidak valid atau user bukan admin"
}
```

---

## 🗄️ Database Schema

### Tabel: `users`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (Auto) |
| email | VARCHAR | Unique email address |
| password_hash | VARCHAR | Hashed password (managed by Supabase) |
| role | VARCHAR | User role: 'admin' atau 'user' |
| created_at | TIMESTAMP | Account creation date |
| updated_at | TIMESTAMP | Last update date |

**Contoh Data:**
```sql
INSERT INTO users (email, role) VALUES 
('admin@example.com', 'admin'),
('user@example.com', 'user');
```

### Tabel: `items`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (Auto) |
| name | VARCHAR | Item name |
| user_id | UUID | Foreign key to users table |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update date |

**Contoh Data:**
```sql
INSERT INTO items (name, user_id) VALUES 
('Item 1', '<user-uuid>'),
('Item 2', '<user-uuid>');
```

### Database Diagram

```
┌──────────────────────┐
│      users           │
├──────────────────────┤
│ id (UUID) PK         │
│ email (VARCHAR)      │
│ password_hash (VAR)  │
│ role (VARCHAR)       │
│ created_at (TS)      │
│ updated_at (TS)      │
└──────────────────────┘
          │
          │ 1:N
          │
          ▼
┌──────────────────────┐
│      items           │
├──────────────────────┤
│ id (UUID) PK         │
│ name (VARCHAR)       │
│ user_id (UUID) FK    │
│ created_at (TS)      │
│ updated_at (TS)      │
└──────────────────────┘
```

---

## 🚀 Deployment

### Deploy Backend ke Vercel

1. **Push project ke GitHub** (jika belum)
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Login ke Vercel** dan import repository
   - Buka [vercel.com](https://vercel.com)
   - Klik "New Project" → Select GitHub repo
   - Select "Deikazen/pemweb_lanjut"

3. **Configure Environment Variables**
   - Di dashboard Vercel → Settings → Environment Variables
   - Add variables:
     ```
     PORT=5000
     SUPABASE_URL=https://xxx.supabase.co
     SUPABASE_KEY=your-anon-key
     FRONTEND_URL=https://your-frontend-url.vercel.app
     JWT_SECRET=your-secret
     ```

4. **Configure Build Settings**
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Output Directory: `dist` (jika ada)
   - Install Command: `npm install`

5. **Deploy**
   - Klik "Deploy"
   - Backend akan live di `your-backend.vercel.app`

### Deploy Frontend ke Vercel

1. **Prepare Frontend**
```bash
cd frontend
npm run build
```

2. **Deploy via Vercel**
   - Buat project baru untuk frontend
   - Select `frontend` folder sebagai root directory
   - Add environment variable: `REACT_APP_API_URL=https://your-backend.vercel.app`

3. **Update Backend CORS**
   - Di backend `.env`: `FRONTEND_URL=https://your-frontend.vercel.app`
   - Redeploy backend

---

## 🔍 Troubleshooting

### CORS Error

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
- Pastikan `FRONTEND_URL` di `.env` backend sesuai dengan URL frontend Anda
- Restart backend server
- Clear browser cache

```env
# .env backend
FRONTEND_URL=http://localhost:3000  # development
# atau
FRONTEND_URL=https://your-frontend.vercel.app  # production
```

### Token Not Valid

**Error:**
```
{"message": "Akses ditolak. Token tidak valid"}
```

**Solution:**
1. Pastikan Anda sudah login terlebih dahulu
2. Token disimpan di `localStorage` dengan key `token`
3. Header request: `Authorization: Bearer <token>`
4. Jika masih error, login ulang

### Database Connection Error

**Error:**
```
could not connect to server: Connection refused
```

**Solution:**
- Verifikasi `SUPABASE_URL` dan `SUPABASE_KEY` sudah benar
- Check Supabase project status di dashboard
- Pastikan internet connection stabil

### 401 Unauthorized on Item Endpoints

**Error:**
```
{"message": "Unauthorized"}
```

**Solution:**
- User harus memiliki role "admin" di database
- Check di Supabase table `users` → role column
- Update user role jika diperlukan:
  ```sql
  UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
  ```

### Port Already in Use

**Error:**
```
listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Cari process yang menggunakan port 5000
lsof -i :5000

# Kill process (ganti PID)
kill -9 <PID>

# Atau ubah PORT di .env
PORT=5001
```

---

## 📊 Statistics

- **Backend Language Composition:**
  - JavaScript: 67.5%
  - CSS: 31.7%
  - HTML: 0.8%

- **Repository Info:**
  - Created: 36 days ago
  - Last Update: 2 hours ago
  - Default Branch: main
  - Repository Size: 18 MB

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:

1. Fork repository
2. Buat branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

---

## 📝 Lisensi

Project ini berlisensi ISC. Lihat `LICENSE` untuk detail.

---

## 👥 Tim Pengembang

- **Owner:** [@Deikazen](https://github.com/Deikazen)
- **Frontend:** [https://pemweb-lanjut-frontend.vercel.app](https://pemweb-lanjut-frontend.vercel.app)

---

## 📞 Support & Questions

Jika ada pertanyaan atau butuh bantuan:
- Buka [GitHub Issues](https://github.com/Deikazen/pemweb_lanjut/issues)
- Review dokumentasi di folder `backend/README.md` dan `frontend/README.md`

---

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [JWT.io](https://jwt.io/)
- [Vercel Deployment Guide](https://vercel.com/docs)

---

**Last Updated:** June 9, 2024  
**Version:** 1.0.0
