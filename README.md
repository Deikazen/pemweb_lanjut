# Simple CRUD API with Express & Supabase

API backend sederhana yang dibangun menggunakan **Express.js** dan **Supabase** sebagai database. API ini mendukung operasi CRUD (Create, Read, Update, Delete) untuk entitas `User` dan `Item`, serta dilengkapi dengan autentikasi (Login) dan otorisasi (Admin Role).

---

## 🚀 Fitur Utama
- **Node.js & Express:** Framework backend yang cepat dan minimalis.
- **Supabase:** Integrasi langsung dengan Supabase untuk Database (PostgreSQL) dan Autentikasi.
- **CORS Configured:** Sudah dikonfigurasi untuk menerima request dari Frontend (bisa diatur via `.env`).
- **Middleware Otorisasi:** Fitur `verifyAdmin` untuk membatasi endpoint tertentu hanya untuk Admin.
- **Vercel Ready:** Sudah siap di-deploy secara serverless ke Vercel.

---

## 🛠️ Instalasi & Menjalankan di Lokal

1. **Clone repository ini** (jika belum).
2. Buka terminal di dalam folder project dan jalankan:
   ```bash
   npm install
   ```
3. Buat file `.env` di root folder (sejajar dengan `package.json`) dan isi variabel berikut:
   ```env
   PORT=5000
   SUPABASE_URL=https://<id-project-anda>.supabase.co
   SUPABASE_KEY=<anon-public-key-anda>
   FRONTEND_URL=http://localhost:5173
   ```
4. Jalankan server:
   - Mode Development (Auto-restart): `npm run dev`
   - Mode Production: `npm start`
5. Server akan berjalan di `http://localhost:5000`.

---

## 🌐 Deployment (Vercel)

Aplikasi ini sudah dikonfigurasi (`vercel.json`) agar bisa langsung di-deploy ke Vercel:
1. Push project ini ke repositori GitHub.
2. Login ke [Vercel](https://vercel.com) dan buat project baru dari repositori Anda.
3. Di bagian **Environment Variables** pada dashboard Vercel, tambahkan `SUPABASE_URL`, `SUPABASE_KEY`, dan `FRONTEND_URL`.
4. Klik **Deploy**.

---

## 📚 Dokumentasi API Endpoint

Berikut adalah daftar endpoint yang bisa dipanggil oleh tim Frontend.

### 1. Root
- **GET `/`**
  - Mengecek status server.
  - **Response:** `App berjalan`

---

### 2. Autentikasi & Users

#### Login User
- **URL:** `POST /api/login`
- **Body Request (JSON):**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response Sukses:**
  Mengembalikan token yang nantinya dipakai untuk akses Endpoint Admin.
  ```json
  {
    "message": "Login Berhasil!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5..."
  }
  ```

### 3. Items (Membutuhkan Akses Admin)

> ⚠️ **PENTING:** Semua endpoint `/api/item` wajib menyertakan token di bagian **Headers** request.
> 
> Format Header:
> `Authorization: Bearer <token-yang-didapat-saat-login>`
>
> *(Selain itu, user yang login harus memiliki `role` bernilai `admin` di dalam tabel `users` Supabase).*

#### Ambil Semua Item
- **URL:** `GET /api/item`
- **Headers:** `Authorization: Bearer <token>`
- **Response Sukses:** Array of items.

#### Buat Item Baru
- **URL:** `POST /api/item`
- **Headers:** `Authorization: Bearer <token>`
- **Body Request (JSON):**
  ```json
  {
    "name": "Nama Item Baru"
  }
  ```

#### Edit Item
- **URL:** `PUT /api/item/:id` (Ganti `:id` dengan ID item)
- **Headers:** `Authorization: Bearer <token>`
- **Body Request (JSON):**
  ```json
  {
    "name": "Nama Item Update"
  }
  ```

#### Hapus Item
- **URL:** `DELETE /api/item/:id` (Ganti `:id` dengan ID item)
- **Headers:** `Authorization: Bearer <token>`

---

## 💡 Notes untuk Tim Frontend
1. Jika mendapatkan pesan error **CORS Policy**, pastikan URL frontend Anda (`http://localhost:5173` atau URL deploy) sudah dimasukkan ke dalam `FRONTEND_URL` di konfigurasi `.env` backend.
2. Untuk memanggil API Item, selalu pastikan user sudah memanggil `POST /api/login` dan menyimpan token tersebut (misalnya di `localStorage`), lalu tempelkan ke header tiap kali melakukan Fetch/Axios.
