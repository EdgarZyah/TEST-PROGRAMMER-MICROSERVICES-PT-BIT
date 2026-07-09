# Dompet PNBP - Microservices Fullstack

Aplikasi microservices untuk manajemen pembelian token PNBP dengan arsitektur **API Gateway + 4 microservices** dan frontend **React + TypeScript**.

## Arsitektur

```
[React Frontend :5173]
        │
        │ (hanya via Gateway)
        ▼
[API Gateway :3000]  ←  Auth + RBAC + Security Middleware
        │
        ├──→ [Auth Service :3001]        ─── auth_db (users, users_role)
        ├──→ [RBAC Service :3002]        ─── auth_db (users, users_role)
        ├──→ [Master Service :3003]      ─── master_db (produk)
        └──→ [Transaction Service :3004] ─── transaction_db (transaksi, keranjang)
```

Setiap service memiliki database terpisah. Komunikasi antar service hanya melalui REST API via Gateway dengan header `X-INTERNAL-KEY`.

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Backend | Node.js + Express |
| Frontend | React + TypeScript + Vite |
| Database | MySQL |
| Styling | Tailwind CSS |
| Ikon | lucide-react |
| Auth | JWT + bcrypt |
| HTTP Proxy | express-http-proxy |

---

## Prasyarat

- **Node.js** >= 18
- **MySQL** >= 8.0
- **npm** >= 9

---

## Setup & Instalasi

### 1. Clone / Extract Project

```bash
cd test-bentang-inspira
```

### 2. Install Semua Dependencies

```bash
# Install backend services & gateway
cd gateway                    && npm install && cd ..
cd services/auth-service      && npm install && cd ../..
cd services/rbac-service      && npm install && cd ../..
cd services/master-service    && npm install && cd ../..
cd services/transaction-service && npm install && cd ../..

# Install database seed dependencies
cd database                   && npm install && cd ..

# Install frontend
cd frontend                   && npm install && cd ..
```

Atau jalankan perintah dari root:
```bash
npm run install:all
```

### 3. Konfigurasi Environment

Salin `.env.example` menjadi `.env` di setiap service, lalu sesuaikan nilainya.

#### Gateway (`gateway/.env`)

```env
PORT=3000
JWT_SECRET=your_jwt_secret_key
AUTH_SERVICE_URL=http://localhost:3001
RBAC_SERVICE_URL=http://localhost:3002
MASTER_SERVICE_URL=http://localhost:3003
TRANSACTION_SERVICE_URL=http://localhost:3004
INTERNAL_KEY=your-internal-key
```

#### Auth Service (`services/auth-service/.env`)

```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=auth_db
JWT_SECRET=your_jwt_secret_key
INTERNAL_KEY=your-internal-key
```

#### RBAC Service (`services/rbac-service/.env`)

```env
PORT=3002
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=auth_db
INTERNAL_KEY=your-internal-key
```

#### Master Service (`services/master-service/.env`)

```env
PORT=3003
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=master_db
INTERNAL_KEY=your-internal-key
```

#### Transaction Service (`services/transaction-service/.env`)

```env
PORT=3004
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=transaction_db
INTERNAL_KEY=your-internal-key
MASTER_SERVICE_URL=http://localhost:3003
```

> **PENTING:** `JWT_SECRET` di **gateway** dan **auth-service** harus sama. `INTERNAL_KEY` harus sama di **gateway** dan semua service.

### 4. Setup Database MySQL

Buat 3 database lalu jalankan file SQL:

```bash
# Login ke MySQL
mysql -u root -p

# Buat database (jika belum ada)
CREATE DATABASE IF NOT EXISTS auth_db;
CREATE DATABASE IF NOT EXISTS master_db;
CREATE DATABASE IF NOT EXISTS transaction_db;

# Jalankan file schema
source database/auth-schema.sql
source database/master-schema.sql
source database/transaction-schema.sql
```

## Menjalankan Aplikasi

### Cara 1: Manual (6 terminal)

Jalankan sesuai urutan (service tidak saling menunggu, tapi gateway membutuhkan semua service):

```bash
# Terminal 1 - Auth Service
cd services/auth-service && npm run dev

# Terminal 2 - RBAC Service
cd services/rbac-service && npm run dev

# Terminal 3 - Master Service
cd services/master-service && npm run dev

# Terminal 4 - Transaction Service
cd services/transaction-service && npm run dev

# Terminal 5 - API Gateway
cd gateway && npm run dev

# Terminal 6 - Frontend
cd frontend && npm run dev
```

### Akses Aplikasi

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| API Gateway | http://localhost:3000 |

---

## Akun Login

| Role | Email | Password |
|------|-------|----------|
| **ADMIN** | `admin@gmail.com` | `123` |
| **PEMBELI** | `pembeli@gmail.com` | `123` |

---

## Halaman Aplikasi

### Role ADMIN

| Route | Halaman | Deskripsi |
|-------|---------|-----------|
| `/login` | Login | Background biru gradasi putih, logo dompet, form login |
| `/admin/dashboard` | Dashboard | Kartu statistik total user, produk, transaksi |
| `/admin/users` | Manajemen User | DataTable user + modal tambah/edit (nama, email, username, password, role, status) |
| `/admin/products` | Master Produk | DataTable produk (#, nama, harga) + modal tambah/edit |

### Role PEMBELI

| Route | Halaman | Deskripsi |
|-------|---------|-----------|
| `/login` | Login | Sama dengan admin |
| `/pembeli/beli` | Pembelian Produk | Card grid 3 warna (biru/oren/ungu), header dengan ikon keranjang & notifikasi, modal checkout (input jumlah), modal billing SIMPONI (header hijau, kode billing, nominal, expired, tata cara bayar, tombol bayar) |
| `/pembeli/history` | History Pembayaran | Filter tanggal & status, DataTable responsif (tabel desktop / kartu mobile), modal billing detail dengan status & tombol bayar |

---

## API Endpoints

### Public (via Gateway)

| Method | Endpoint | Auth | RBAC | Deskripsi |
|--------|----------|------|------|-----------|
| POST | `/api/login` | — | — | Login user |
| GET | `/api/me` | JWT | — | Info user login |
| POST | `/api/refresh-token` | JWT | — | Refresh JWT |

### Admin Only

| Method | Endpoint | RBAC | Deskripsi |
|--------|----------|------|-----------|
| GET | `/api/users` | ADMIN | List users |
| POST | `/api/users` | ADMIN | Tambah user |
| PUT | `/api/users/:id` | ADMIN | Update user |
| DELETE | `/api/users/:id` | ADMIN | Hapus user |
| GET | `/api/products` | ADMIN, PEMBELI | List produk |
| POST | `/api/products` | ADMIN | Tambah produk |
| PUT | `/api/products/:id` | ADMIN | Update produk |
| DELETE | `/api/products/:id` | ADMIN | Hapus produk |

### Admin & Pembeli

| Method | Endpoint | RBAC | Deskripsi |
|--------|----------|------|-----------|
| PUT | `/api/transactions/:id/pay` | PEMBELI, ADMIN | Bayar / update status transaksi |
| GET | `/api/transactions` | PEMBELI, ADMIN | Riwayat transaksi |

### Pembeli Only

| Method | Endpoint | RBAC | Deskripsi |
|--------|----------|------|-----------|
| POST | `/api/cart/add` | PEMBELI | Tambah ke keranjang |
| GET | `/api/cart` | PEMBELI | Lihat keranjang |
| POST | `/api/checkout` | PEMBELI | Checkout & generate billing |

---

## Struktur Folder

```
test-bentang-inspira/
├── gateway/                          # API Gateway (:3000)
│   ├── src/
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js     # Validasi JWT
│   │   │   ├── rbac.middleware.js     # Cek role user
│   │   │   └── security.middleware.js # Internal key header
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── rbac.routes.js
│   │   │   ├── master.routes.js
│   │   │   └── transaction.routes.js
│   │   └── index.js
│   ├── .env                          # Konfigurasi gateway
│   ├── .env.example                  # Template konfigurasi
│   └── package.json
├── services/
│   ├── auth-service/                 # Auth Service (:3001)
│   │   ├── src/controllers/
│   │   ├── src/middleware/
│   │   ├── src/models/
│   │   ├── src/routes/
│   │   ├── .env / .env.example
│   │   └── package.json
│   ├── rbac-service/                 # RBAC Service (:3002)
│   │   ├── src/controllers/
│   │   ├── src/models/
│   │   ├── src/routes/
│   │   ├── .env / .env.example
│   │   └── package.json
│   ├── master-service/               # Master Service (:3003)
│   │   ├── src/controllers/
│   │   ├── src/models/
│   │   ├── src/routes/
│   │   ├── .env / .env.example
│   │   └── package.json
│   └── transaction-service/          # Transaction Service (:3004)
│       ├── src/controllers/
│       ├── src/models/
│       ├── src/routes/
│       ├── .env / .env.example
│       └── package.json
├── frontend/                         # React + TypeScript (:5173)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.tsx           # Sidebar navigasi
│   │   │   ├── DataTable.tsx         # Tabel reusable + responsif (kartu di mobile)
│   │   │   ├── Modal.tsx             # Modal reusable
│   │   │   ├── ProductCard.tsx       # Card produk
│   │   │   ├── FilterBar.tsx         # Filter history
│   │   │   └── BillingModal.tsx      # Modal billing SIMPONI
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── UserManagement.tsx
│   │   │   ├── MasterProduct.tsx
│   │   │   ├── PembelianProduk.tsx
│   │   │   └── HistoryPembayaran.tsx
│   │   ├── services/
│   │   │   └── api.ts                # Axios instance + API calls
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx        # Auth state management
│   │   └── types/
│   │       └── index.ts              # TypeScript interfaces
│   ├── vite.config.ts
│   └── package.json
├── database/
│   ├── auth-schema.sql
│   ├── master-schema.sql
│   ├── transaction-schema.sql
│   ├── seed.js                       # Script seeding data
│   └── package.json
├── start-all.ps1                     # Script start semua service
├── .gitignore
└── README.md
```

---

## Catatan Penting

1. **Semua request frontend WAJIB melalui API Gateway** — Frontend dilarang mengakses service backend secara langsung.
2. **Setiap service punya database sendiri** — Tidak ada query lintas database.
3. **Internal header** — Gateway menambahkan `X-INTERNAL-KEY` ke setiap request ke service internal. Service internal akan menolak request tanpa header ini.
4. **Password** — Semua password di-hash dengan bcrypt. Tidak ada penyimpanan plaintext.
5. **JWT** — Token memiliki masa berlaku 24 jam. Refresh token endpoint tersedia di `/api/refresh-token`.
6. **Role case** — Role disimpan di database dalam bentuk UPPERCASE (`ADMIN` / `PEMBELI`). Semua perbandingan role bersifat case-insensitive.
7. **Harga produk** — Tidak boleh negatif. Nama produk harus unik.
8. **Transaksi** — Status awal `BELUM_DIBAYAR`, expired dalam 24 jam. PEMBELI dapat membayar (status → `SUDAH_DIBAYAR`) via tombol Bayar.
9. **Responsive** — DataTable otomatis berubah menjadi kartu di layar kecil (mobile). Sidebar fixed dengan z-index tinggi.

---

## Troubleshooting

**MySQL Connection Refused:**
```powershell
# Pastikan MySQL running
net start MySQL
```
- Cek kredensial di file `.env` masing-masing service

**Frontend Can't Connect to API:**
- Pastikan semua service backend + gateway berjalan
- Cek konfigurasi proxy di `frontend/vite.config.ts`

**JWT Error:**
- Pastikan `JWT_SECRET` sama di `gateway/.env` dan `services/auth-service/.env`
- Cek token expired atau invalid

**Port Already in Use:**
- Ubah port di file `.env` masing-masing service jika ada konflik
- Update port di `frontend/vite.config.ts` proxy target jika gateway berubah

**Forbidden: insufficient permissions:**
- Pastikan role user sesuai dengan RBAC endpoint yang diakses
- Role harus UPPERCASE (`ADMIN` / `PEMBELI`) di database
