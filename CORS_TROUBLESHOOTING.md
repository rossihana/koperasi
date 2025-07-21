# Troubleshooting CORS Error

## 🔍 Masalah yang Ditemui

Error CORS (Cross-Origin Resource Sharing) terjadi ketika frontend tidak dapat berkomunikasi dengan backend karena kebijakan keamanan browser.

### Error yang Muncul:
```
Access to fetch at 'https://polres-be-fix.vercel.app/auth/login' from origin 'http://localhost:8081' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## 🛠️ Solusi

### 1. **Solusi Backend (Recommended)**

Backend perlu dikonfigurasi untuk mengizinkan request dari frontend. Administrator backend perlu menambahkan header CORS:

```javascript
// Contoh konfigurasi CORS di backend (Node.js/Express)
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 2. **Solusi Frontend (Temporary)**

#### A. Menggunakan CORS Proxy
Tambahkan proxy untuk development:

```typescript
// src/lib/api.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://polres-be-fix.vercel.app';

// Gunakan CORS proxy untuk development
const getApiUrl = (endpoint: string) => {
  if (import.meta.env.DEV) {
    // Gunakan CORS proxy untuk development
    return `https://cors-anywhere.herokuapp.com/${API_BASE_URL}${endpoint}`;
  }
  return `${API_BASE_URL}${endpoint}`;
};
```

#### B. Menggunakan Browser Extension
Install CORS browser extension untuk development:
- Chrome: "CORS Unblock" atau "Allow CORS"
- Firefox: "CORS Everywhere"

### 3. **Solusi Development Server**

#### A. Vite Proxy Configuration
Tambahkan proxy di `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://polres-be-fix.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

Kemudian update API base URL:
```typescript
export const API_BASE_URL = import.meta.env.DEV ? '/api' : 'https://polres-be-fix.vercel.app';
```

## 🔧 Langkah-langkah Troubleshooting

### 1. **Cek Status Backend**
```bash
# Test backend langsung
curl -X POST https://polres-be-fix.vercel.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"nrp":"12345","password":"admin123"}'
```

### 2. **Cek CORS Headers**
```bash
# Test preflight request
curl -X OPTIONS https://polres-be-fix.vercel.app/auth/login \
  -H "Origin: http://localhost:8081" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

### 3. **Browser Developer Tools**
1. Buka Developer Tools (F12)
2. Cek Network tab
3. Lihat request yang gagal
4. Cek Response headers untuk CORS

## 📋 Checklist Troubleshooting

- [ ] Backend server running dan accessible
- [ ] CORS headers dikonfigurasi di backend
- [ ] Origin frontend diizinkan di backend
- [ ] Methods HTTP diizinkan (GET, POST, PUT, DELETE, PATCH, OPTIONS)
- [ ] Headers diizinkan (Content-Type, Authorization)
- [ ] Credentials diizinkan jika diperlukan

## 🚨 Temporary Workarounds

### 1. **Disable CORS di Browser (Development Only)**
```bash
# Chrome (Windows)
chrome.exe --disable-web-security --user-data-dir="C:/temp/chrome_dev"

# Chrome (Mac)
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev" --disable-web-security

# Chrome (Linux)
google-chrome --disable-web-security --user-data-dir="/tmp/chrome_dev"
```

### 2. **Gunakan Postman/Insomnia**
Test API menggunakan Postman atau Insomnia untuk memastikan backend berfungsi.

### 3. **Local Development dengan Mock Data**
Buat mock data untuk development sementara:

```typescript
// src/lib/mockApi.ts
export const mockLogin = async (nrp: string, password: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (nrp === '12345' && password === 'admin123') {
    return {
      user: {
        id: '1',
        nrp: '12345',
        nama: 'Admin User',
        jabatan: 'Admin',
        role: 'admin',
        simpanan: 1000000,
        piutang: 0,
        joinDate: '2024-01-01'
      },
      token: 'mock-jwt-token'
    };
  }
  
  throw new Error('Invalid credentials');
};
```

## 📞 Kontak Support

Jika masalah CORS masih berlanjut:

1. **Hubungi Administrator Backend** untuk konfigurasi CORS
2. **Cek dokumentasi backend** untuk panduan CORS
3. **Test dengan Postman** untuk memastikan backend berfungsi
4. **Gunakan temporary workarounds** untuk development

## 🔄 Update Status

- [x] Error handling CORS di frontend
- [x] Alert CORS error di halaman login
- [x] Dokumentasi troubleshooting
- [ ] Konfigurasi CORS di backend (perlu administrator)
- [ ] Proxy configuration (opsional) 