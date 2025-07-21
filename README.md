# Sistem Anggota Koperasi

Aplikasi web untuk manajemen anggota koperasi dengan integrasi backend API berdasarkan Postman collection.

## 🚀 Fitur

- **Authentication**: Login dengan NRP dan password
- **Member Management**: Kelola data anggota koperasi (CRUD)
- **Product Management**: Kelola produk toko koperasi dengan file upload
- **Financial Management**: Kelola simpanan dan piutang anggota
- **Transaction History**: Riwayat transaksi simpanan dan piutang
- **Role-based Access**: Admin dan member biasa
- **Responsive Design**: Optimized untuk desktop dan mobile

## 🛠️ Tech Stack

### Frontend
- **React 18** dengan TypeScript
- **Vite** untuk build tool
- **Tailwind CSS** untuk styling
- **Shadcn/ui** untuk komponen UI
- **React Router** untuk routing
- **React Query** untuk state management dan caching
- **React Hook Form** untuk form handling
- **Zod** untuk validation

### Backend Integration
- **Base URL**: `https://polres-be-fix.vercel.app`
- **RESTful API** dengan JWT authentication
- **FormData support** untuk file uploads
- **Real-time data** dari backend server

## 📦 Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd anggota-koperasi-sistem-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   # atau
   bun install
   ```

3. **Konfigurasi Environment**
   
   Buat file `.env` di root directory:
   ```env
   VITE_API_BASE_URL=https://polres-be-fix.vercel.app
   VITE_APP_NAME=Sistem Anggota Koperasi
   VITE_APP_VERSION=1.0.0
   VITE_DEV_MODE=true
   VITE_ENABLE_LOGGING=true
   ```

4. **Jalankan aplikasi**
   ```bash
   npm run dev
   # atau
   bun dev
   ```

5. **Buka browser**
   
   Aplikasi akan berjalan di `http://localhost:5173`

## 🔧 Konfigurasi

### API Configuration
File konfigurasi API berada di `src/lib/api.ts`:
- Base URL dapat diubah di `src/lib/config.ts`
- Endpoint definitions berdasarkan Postman collection
- Type definitions untuk request/response
- FormData support untuk file uploads

### Environment Variables
- `VITE_API_BASE_URL`: URL backend API
- `VITE_APP_NAME`: Nama aplikasi
- `VITE_APP_VERSION`: Versi aplikasi
- `VITE_DEV_MODE`: Mode development
- `VITE_ENABLE_LOGGING`: Enable/disable logging

## 📁 Struktur Proyek

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom hooks (API, etc.)
├── lib/                # Utilities and configurations
│   ├── api.ts         # API client dan endpoints
│   ├── config.ts      # App configuration
│   └── utils.ts       # Utility functions
├── pages/              # Page components
└── App.tsx            # Main app component
```

## 🔌 API Integration

### Authentication Endpoints
- `POST /auth/login` - Login dengan NRP dan password
- `POST /auth/logout` - Logout user

### Member Management (Admin)
- `GET /admin/members` - Get semua members
- `POST /admin/members` - Tambah member baru
- `GET /admin/members/:id` - Get member detail
- `DELETE /admin/members/:id` - Hapus member

### Member Profile (User)
- `GET /member/profile` - Get profile member yang sedang login

### Product Management (Admin)
- `GET /admin/products` - Get semua products (admin view)
- `POST /admin/products` - Tambah product baru (dengan FormData)
- `PUT /admin/products/:id` - Update product (dengan FormData)

### Product Management (User)
- `GET /user/products?page=1` - Get products dengan pagination
- `GET /user/products/:id` - Get product detail

### Financial Management (Admin)
- `POST /admin/members/:id/piutang` - Tambah piutang untuk member
- `PATCH /admin/members/:id/piutang/:piutangId` - Update piutang (pembayaran)
- `PATCH /admin/members/:id/simpanan` - Update simpanan (setoran)

### Transaction History
- `GET /admin/members/:id/transactions/simpanan` - Riwayat simpanan member (admin)
- `GET /admin/members/:id/transactions/piutang` - Riwayat piutang member (admin)
- `GET /admin/members/:id/transactions/combined` - Riwayat gabungan (admin)
- `GET /member/me/transactions/simpanan` - Riwayat simpanan sendiri
- `GET /member/me/transactions/piutang` - Riwayat piutang sendiri
- `GET /member/me/transactions/combined` - Riwayat gabungan sendiri

## 🎯 Cara Penggunaan

### 1. Login
- Buka aplikasi di browser
- Masukkan NRP dan password
- Setelah berhasil, akan diarahkan ke dashboard

### 2. Admin Features
- **Member Management**: Lihat, tambah, edit, hapus member
- **Product Management**: Kelola produk toko dengan file upload
- **Financial Management**: Update simpanan/piutang member
- **Transaction History**: Lihat riwayat transaksi member

### 3. Member Features
- **View Profile**: Lihat profil sendiri
- **Shop**: Belanja produk koperasi
- **Transaction History**: Lihat riwayat transaksi sendiri

## 🔐 Authentication

- Menggunakan JWT token untuk authentication
- Login dengan NRP dan password
- Token disimpan di localStorage
- Automatic token refresh
- Protected routes untuk admin-only pages

## 📱 Responsive Design

- Mobile-first approach
- Optimized untuk semua device
- Touch-friendly interface
- Progressive Web App (PWA) ready

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Build & Deploy

```bash
# Build untuk production
npm run build

# Preview build
npm run preview

# Build untuk development
npm run build:dev
```

## 🔍 Debugging

### Browser Developer Tools
1. Buka Developer Tools (F12)
2. Cek Network tab untuk API calls
3. Cek Console untuk error messages
4. Cek Application tab untuk localStorage

### API Testing
1. Pastikan backend server running
2. Cek Network tab saat melakukan request
3. Pastikan CORS settings benar
4. Cek token authentication

## 🐛 Troubleshooting

### Common Issues

1. **CORS Error**
   - Pastikan backend mengizinkan request dari frontend domain
   - Cek CORS headers di backend

2. **Authentication Error**
   - Pastikan token valid dan tidak expired
   - Cek format Authorization header
   - Pastikan endpoint authentication berfungsi

3. **Network Error**
   - Cek koneksi internet
   - Pastikan backend server running
   - Cek URL endpoint yang benar

4. **File Upload Error**
   - Pastikan file size tidak melebihi limit
   - Cek file type yang diizinkan
   - Pastikan FormData dikirim dengan benar

5. **Build Error**
   - Pastikan semua dependencies terinstall
   - Cek TypeScript errors
   - Cek environment variables

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Support

Untuk bantuan dan dukungan:
- Email: support@koperasi.com
- Documentation: [Link ke dokumentasi]
- Issues: [GitHub Issues]

---

**Note**: Pastikan backend API server running sebelum menjalankan frontend aplikasi. Aplikasi ini menggunakan endpoint berdasarkan Postman collection yang disediakan.
