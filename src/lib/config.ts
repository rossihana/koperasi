// Environment configuration
export const config = {
  // API Configuration - gunakan proxy di development
  API_BASE_URL: import.meta.env.DEV 
    ? '/api' 
    : (import.meta.env.VITE_API_BASE_URL || 'https://polres-be-fix.vercel.app'),
  
  // App Configuration
  APP_NAME: 'Sistem Anggota Koperasi',
  APP_VERSION: '1.0.0',
  
  // Feature flags
  FEATURES: {
    ENABLE_REGISTRATION: true,
    ENABLE_PRODUCT_MANAGEMENT: true,
    ENABLE_TRANSACTION_HISTORY: true,
    ENABLE_FINANCIAL_MANAGEMENT: true,
  },
  
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  
  // File upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  
  // Cache configuration
  CACHE_DURATION: {
    SHORT: 5 * 60 * 1000, // 5 minutes
    MEDIUM: 30 * 60 * 1000, // 30 minutes
    LONG: 24 * 60 * 60 * 1000, // 24 hours
  },
};

// Validation rules
export const validationRules = {
  // User validation
  USER: {
    NRP_MIN_LENGTH: 6,
    NRP_MAX_LENGTH: 20,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_MIN_LENGTH: 6,
  },
  
  // Product validation
  PRODUCT: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 200,
    DESCRIPTION_MAX_LENGTH: 1000,
    PRICE_MIN: 0,
    STOCK_MIN: 0,
  },
  
  // Transaction validation
  TRANSACTION: {
    QUANTITY_MIN: 1,
    QUANTITY_MAX: 1000,
  },
};

// Error messages
export const errorMessages = {
  // Auth errors
  AUTH: {
    INVALID_CREDENTIALS: 'Email atau password salah',
    USER_NOT_FOUND: 'User tidak ditemukan',
    EMAIL_ALREADY_EXISTS: 'Email sudah terdaftar',
    NRP_ALREADY_EXISTS: 'NRP sudah terdaftar',
    UNAUTHORIZED: 'Anda tidak memiliki akses',
    TOKEN_EXPIRED: 'Sesi telah berakhir, silakan login kembali',
  },
  
  // Validation errors
  VALIDATION: {
    REQUIRED: 'Field ini wajib diisi',
    INVALID_EMAIL: 'Format email tidak valid',
    PASSWORD_TOO_SHORT: 'Password minimal 6 karakter',
    NRP_TOO_SHORT: 'NRP minimal 6 karakter',
    NAME_TOO_SHORT: 'Nama minimal 2 karakter',
    PRICE_INVALID: 'Harga harus lebih dari 0',
    STOCK_INVALID: 'Stok harus lebih dari atau sama dengan 0',
    QUANTITY_INVALID: 'Jumlah harus lebih dari 0',
  },
  
  // Network errors
  NETWORK: {
    CONNECTION_ERROR: 'Koneksi internet bermasalah',
    SERVER_ERROR: 'Terjadi kesalahan pada server',
    TIMEOUT: 'Request timeout',
  },
  
  // File upload errors
  FILE: {
    TOO_LARGE: 'File terlalu besar',
    INVALID_TYPE: 'Tipe file tidak didukung',
    UPLOAD_FAILED: 'Gagal mengupload file',
  },
};

// Success messages
export const successMessages = {
  AUTH: {
    LOGIN_SUCCESS: 'Login berhasil',
    REGISTER_SUCCESS: 'Registrasi berhasil',
    LOGOUT_SUCCESS: 'Logout berhasil',
  },
  
  CRUD: {
    CREATE_SUCCESS: 'Data berhasil ditambahkan',
    UPDATE_SUCCESS: 'Data berhasil diperbarui',
    DELETE_SUCCESS: 'Data berhasil dihapus',
  },
  
  TRANSACTION: {
    PURCHASE_SUCCESS: 'Pembelian berhasil',
    PAYMENT_SUCCESS: 'Pembayaran berhasil',
  },
}; 