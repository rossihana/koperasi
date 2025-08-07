import { config } from './config';

// API Configuration
export const API_BASE_URL = config.API_BASE_URL;

// API endpoints berdasarkan Postman collection
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  
  // Member endpoints (admin)
  ADMIN_MEMBERS: '/admin/members',
  ADMIN_MEMBER_BY_ID: (id: string) => `/admin/members/${id}`,
  ADMIN_MEMBER_PASSWORD: (id: string) => `/admin/members/${id}/password`,
  ADMIN_MEMBER_PIUTANG: (id: string) => `/admin/members/${id}/piutang`,
  ADMIN_MEMBER_PIUTANG_BY_ID: (memberId: string, piutangId: string) => `/admin/members/${memberId}/piutang/${piutangId}`,
  ADMIN_MEMBER_SIMPANAN: (id: string) => `/admin/members/${id}/simpanan`,
  ADMIN_MEMBER_TRANSACTIONS_SIMPANAN: (id: string) => `/admin/members/${id}/transactions/simpanan`,
  ADMIN_MEMBER_TRANSACTIONS_PIUTANG: (id: string) => `/admin/members/${id}/transactions/piutang`,
  ADMIN_MEMBER_TRANSACTIONS_COMBINED: (id: string) => `/admin/members/${id}/transactions/combined`,
  
  // Member endpoints (user)
  MEMBER_PROFILE: '/member/profile',
  MEMBER_PASSWORD: '/member/password',
  MEMBER_ME_TRANSACTIONS_SIMPANAN: '/member/me/transactions/simpanan',
  MEMBER_ME_TRANSACTIONS_PIUTANG: '/member/me/transactions/piutang',
  MEMBER_ME_TRANSACTIONS_COMBINED: '/member/me/transactions/combined',
  
  // Product endpoints (admin)
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCT_BY_ID: (id: string) => `/admin/products/${id}`,
  
  // Product endpoints (user)
  USER_PRODUCTS: '/user/products',
  USER_PRODUCT_BY_ID: (id: string) => `/user/products/${id}`,
};

// API client configuration
export const apiClient = {
  baseURL: API_BASE_URL,
  
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      mode: 'cors', // Explicitly set CORS mode
      credentials: 'include', // Include credentials if needed
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      console.log('Making API request to:', url);
      console.log('Request config:', config);
      
      const response = await fetch(url, config);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        let errorDetail = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorDetail = errorData.message;
          } else if (errorData.error) {
            errorDetail = errorData.error;
          }
        } catch (parseError) {
          console.warn('Could not parse error response as JSON:', parseError);
        }

        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Token expired, silakan login kembali');
        }
        throw new Error(errorDetail);
      }
      
      const responseData = await response.json();
      console.log('Response data:', responseData);
      
      return responseData;
    } catch (error) {
      console.error('API request failed:', error);
      
      // Handle CORS errors specifically
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.error('CORS Error: Backend tidak mengizinkan request dari origin ini');
        throw new Error('CORS Error: Backend tidak mengizinkan request dari origin ini. Silakan hubungi administrator backend.');
      }
      
      throw error;
    }
  },

  // GET request
  async get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  },

  // POST request
  async post<T extends Record<string, unknown>>(endpoint: string, data?: T) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  // PUT request
  async put<T extends Record<string, unknown>>(endpoint: string, data?: T) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  // DELETE request
  async delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  // PATCH request
  async patch<T extends Record<string, unknown>>(endpoint: string, data?: T) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  // POST request with FormData (for file uploads)
  async postFormData(endpoint: string, formData: FormData) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      method: 'POST',
      body: formData,
    };

    // Add authorization header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  // PUT request with FormData (for file uploads)
  async putFormData(endpoint: string, formData: FormData) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      method: 'PUT',
      body: formData,
    };

    // Add authorization header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },
};

// Type definitions berdasarkan Postman collection
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Login request berdasarkan Postman - hanya NRP dan password
export interface LoginRequest {
  nrp: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    nrp: string;
    nama: string;
    jabatan: string;
    role: string;
    simpanan: number;
    piutang: number;
    joinDate: string;
  };
  token: string;
}

// Member/User types
export interface MemberSimpanan {
  totalSimpanan: number;
  simpananPokok: number;
  simpananWajib: number;
  simpananSukarela: number;
  tabunganHariRaya: number;
}

export interface TransactionByType {
  type: string;
  count: number;
  amount: string;
}

export interface SimpananTransactionsSummary {
  total: {
    transactions: number;
    amount: string;
  };
  byType: TransactionByType[];
  lastTransactionDate?: string;
}

export interface MemberSummary {
  totalPiutang: number;
  activePiutang: number;
  completedPiutang: number;
  totalActivePiutangAmount: number;
  totalCompletedPiutangAmount: number;
  totalSimpanan: number;
  simpananTransactions: SimpananTransactionsSummary;
  simpananBreakdown?: {
    simpananPokok: number;
    simpananWajib: number;
    simpananSukarela: number;
    tabunganHariRaya: number;
  };
}

export interface Member {
  id: string;
  nrp: string;
  nama: string;
  jabatan: string;
  role: string;
  createdAt: string;
  activeLoanCount: number;
  hasActiveLoan: boolean;
  simpanan?: MemberSimpanan | number;
  piutang?: number;
  summary?: MemberSummary;
  joinDate?: string;
}

// Product types berdasarkan Postman
export interface Product {
  id: string;
  namaProduk: string;
  harga: number;
  deskripsi: string;
  namaKategori: string;
  foto: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  namaProduk: string;
  harga: number;
  deskripsi: string;
  namaKategori: string;
  foto: File;
}

// Piutang types
export interface Piutang {
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

export type PiutangTransactionType = 'payment' | 'pelunasan';

export interface UpdatePiutangRequest extends Record<string, unknown> {
  type: PiutangTransactionType;
  amount?: number;
  description: string;
}

export interface CreatePiutangRequest extends Record<string, unknown> {
  jenis: string;
  besarPinjaman: number;
  totalPiutang: number;
  biayaAngsuran: number;
  totalAngsuran: number;
  description: string;
}

// Simpanan types
export interface UpdateSimpananRequest extends Record<string, unknown> {
  type: 'setoran' | 'penarikan' | 'koreksi';
  category: 'wajib' | 'sukarela' | 'pokok' | 'thr';
  amount: number;
  description: string;
}

// Transaction types
export interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  category?: string;
  createdAt: string;
}

// Pagination response
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SimpananTransactionListResponse {
  transactions: Transaction[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalTransactions: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  statistics: SimpananTransactionsSummary;
} 