# Integrasi Backend API

Proyek ini telah diintegrasikan dengan backend API dari `https://polres-be-fix.vercel.app/` berdasarkan Postman collection yang disediakan.

## Struktur Integrasi

### 1. Konfigurasi API (`src/lib/api.ts`)
- Base URL: `https://polres-be-fix.vercel.app`
- Endpoint definitions berdasarkan Postman collection
- API client dengan method GET, POST, PUT, DELETE, PATCH
- Support untuk FormData (file uploads)
- Type definitions untuk request/response

### 2. Konfigurasi Environment (`src/lib/config.ts`)
- Konfigurasi aplikasi yang dapat disesuaikan
- Validation rules
- Error dan success messages
- Feature flags

### 3. Custom Hooks (`src/hooks/useApi.ts`)
- React Query hooks untuk semua operasi API
- Automatic cache invalidation
- Error handling
- Loading states

### 4. Authentication Context (`src/contexts/AuthContext.tsx`)
- Integrasi dengan backend authentication
- Token management
- User session handling

## Endpoint yang Tersedia (Berdasarkan Postman Collection)

### Authentication
- `POST /auth/login` - Login dengan NRP dan password
- `POST /auth/logout` - Logout user

### Member Management (Admin)
- `GET /admin/members` - Get semua members
- `POST /admin/members` - Tambah member baru
- `GET /admin/members/:id` - Get member detail
- `DELETE /admin/members/:id` - Hapus member

### Member Profile (User)
- `GET /member/profile` - Get profile member yang sedang login

### Piutang Management (Admin)
- `POST /admin/members/:id/piutang` - Tambah piutang untuk member
- `PATCH /admin/members/:id/piutang/:piutangId` - Update piutang (pembayaran)

### Simpanan Management (Admin)
- `PATCH /admin/members/:id/simpanan` - Update simpanan (setoran)

### Transaction History (Admin)
- `GET /admin/members/:id/transactions/simpanan` - Riwayat simpanan member
- `GET /admin/members/:id/transactions/piutang` - Riwayat piutang member
- `GET /admin/members/:id/transactions/combined` - Riwayat gabungan

### Transaction History (User)
- `GET /member/me/transactions/simpanan` - Riwayat simpanan sendiri
- `GET /member/me/transactions/piutang` - Riwayat piutang sendiri
- `GET /member/me/transactions/combined` - Riwayat gabungan sendiri

### Product Management (Admin)
- `GET /admin/products` - Get semua products (admin view)
- `POST /admin/products` - Tambah product baru (dengan FormData)
- `PUT /admin/products/:id` - Update product (dengan FormData)

### Product Management (User)
- `GET /user/products?page=1` - Get products dengan pagination
- `GET /user/products/:id` - Get product detail

## Struktur Data

### Login Request
```typescript
{
  nrp: string;
  password: string;
}
```

### Member
```typescript
{
  id: string;
  nrp: string;
  nama: string;
  jabatan: string;
  role: string;
  simpanan: number;
  piutang: number;
  joinDate: string;
}
```

### Product
```typescript
{
  id: string;
  namaProduk: string;
  harga: number;
  deskripsi: string;
  namaKategori: string;
  foto: string;
  createdAt: string;
  updatedAt: string;
}
```

### Piutang
```typescript
{
  id: string;
  jenis: string;
  besarPinjaman: number;
  totalPiutang: number;
  biayaAngsuran: number;
  totalAngsuran: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}
```

## Cara Penggunaan

### 1. Authentication

```typescript
import { useAuth } from '@/contexts/AuthContext';

const { user, login, logout, isLoading } = useAuth();

// Login
const handleLogin = async () => {
  const success = await login('123456', 'admin1234');
  if (success) {
    // Redirect atau update UI
  }
};
```

### 2. Member Management

```typescript
import { useMembers, useCreateMember, useDeleteMember } from '@/hooks/useApi';

// Get all members
const { data: members, isLoading } = useMembers();

// Create member
const createMemberMutation = useCreateMember();
const handleCreate = (memberData) => {
  createMemberMutation.mutate(memberData);
};

// Delete member
const deleteMemberMutation = useDeleteMember();
const handleDelete = (id) => {
  deleteMemberMutation.mutate(id);
};
```

### 3. Product Management

```typescript
import { useUserProducts, useCreateProduct } from '@/hooks/useApi';

// Get products with pagination
const { data: productsResponse } = useUserProducts(1);
const products = productsResponse?.data || [];

// Create product with file upload
const createProductMutation = useCreateProduct();
const handleCreate = (productData) => {
  createProductMutation.mutate(productData);
};
```

### 4. Financial Management

```typescript
import { useCreatePiutang, useUpdateSimpanan } from '@/hooks/useApi';

// Add piutang
const createPiutangMutation = useCreatePiutang();
const handleAddPiutang = (memberId, piutangData) => {
  createPiutangMutation.mutate({ memberId, data: piutangData });
};

// Update simpanan
const updateSimpananMutation = useUpdateSimpanan();
const handleUpdateSimpanan = (memberId, simpananData) => {
  updateSimpananMutation.mutate({ memberId, data: simpananData });
};
```

## Error Handling

Semua API calls memiliki error handling yang konsisten:

```typescript
try {
  const data = await apiClient.get('/endpoint');
  // Handle success
} catch (error) {
  console.error('API Error:', error);
  // Handle error (show toast, redirect, etc.)
}
```

## Token Management

- Token disimpan di localStorage dengan key 'token'
- Token otomatis ditambahkan ke header Authorization untuk setiap request
- Token dihapus saat logout atau session expired

## File Upload

Untuk endpoint yang memerlukan file upload (seperti products), gunakan FormData:

```typescript
const formData = new FormData();
formData.append('namaProduk', 'Product Name');
formData.append('harga', '100000');
formData.append('deskripsi', 'Product description');
formData.append('namaKategori', 'Elektronik');
formData.append('foto', file);

await apiClient.postFormData('/admin/products', formData);
```

## Pagination

Untuk endpoint yang mendukung pagination (seperti products):

```typescript
const { data: response } = useUserProducts(1);
const products = response?.data || [];
const totalPages = response?.totalPages || 1;
```

## Environment Configuration

Untuk mengubah base URL atau konfigurasi lain, edit file `src/lib/config.ts`:

```typescript
export const config = {
  API_BASE_URL: 'https://your-api-url.com',
  // ... other config
};
```

## Testing API Connection

Untuk memastikan koneksi ke backend berfungsi:

1. Buka browser developer tools
2. Cek Network tab saat melakukan request
3. Pastikan request ke `https://polres-be-fix.vercel.app` berhasil
4. Cek response status dan data

## Troubleshooting

### CORS Error
- Pastikan backend mengizinkan request dari domain frontend
- Cek header CORS di backend

### Authentication Error
- Pastikan token valid dan tidak expired
- Cek format Authorization header
- Pastikan endpoint authentication berfungsi

### Network Error
- Cek koneksi internet
- Pastikan backend server running
- Cek URL endpoint yang benar

### File Upload Error
- Pastikan file size tidak melebihi limit
- Cek file type yang diizinkan
- Pastikan FormData dikirim dengan benar

## Development Notes

- Semua API calls menggunakan React Query untuk caching dan state management
- Error handling konsisten di seluruh aplikasi
- TypeScript types tersedia untuk semua API responses
- Loading states ditangani otomatis oleh React Query hooks
- File uploads menggunakan FormData untuk kompatibilitas dengan backend 