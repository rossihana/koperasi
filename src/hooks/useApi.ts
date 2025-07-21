import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, API_ENDPOINTS, Member, Product, Transaction, Piutang, CreateProductRequest, CreatePiutangRequest, UpdatePiutangRequest, UpdateSimpananRequest, PaginatedResponse } from '@/lib/api';

// Auth hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (loginData: { nrp: string; password: string }) =>
      apiClient.post(API_ENDPOINTS.LOGIN, loginData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member-profile'] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => apiClient.post(API_ENDPOINTS.LOGOUT),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

// Member hooks (admin)
export const useMembers = () => {
  return useQuery({
    queryKey: ['members'],
    queryFn: () => apiClient.get(API_ENDPOINTS.ADMIN_MEMBERS),
    retry: 1, // Only retry once
    retryDelay: 1000,
  });
};

// Hook untuk mendapatkan daftar anggota yang bisa diakses oleh semua user
export const useMembersPublic = (page: number = 1) => {
  return useQuery({
    queryKey: ['members-public', page],
    queryFn: async () => {
      try {
        // Try admin endpoint first with pagination
        return await apiClient.get(`${API_ENDPOINTS.ADMIN_MEMBERS}?page=${page}`);
      } catch (error: any) {
        // If admin endpoint fails, return empty array or mock data
        console.log('Admin endpoint failed, returning empty array');
        return { 
          data: { 
            members: [],
            pagination: {
              currentPage: 1,
              totalPages: 1,
              totalItems: 0,
              itemsPerPage: 20,
              hasNextPage: false,
              hasPrevPage: false
            }
          } 
        };
      }
    },
    retry: false, // Don't retry
  });
};

export const useMember = (id: string) => {
  return useQuery({
    queryKey: ['member', id],
    queryFn: () => apiClient.get(API_ENDPOINTS.ADMIN_MEMBER_BY_ID(id)),
    enabled: !!id,
  });
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (memberData: { nrp: string; nama: string; jabatan: string; password: string }) =>
      apiClient.post(API_ENDPOINTS.ADMIN_MEMBERS, memberData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(API_ENDPOINTS.ADMIN_MEMBER_BY_ID(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};

// Member profile (user)
export const useMemberProfile = () => {
  return useQuery({
    queryKey: ['member-profile'],
    queryFn: () => apiClient.get(API_ENDPOINTS.MEMBER_PROFILE),
  });
};

// Piutang hooks
export const useCreatePiutang = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ memberId, data }: { memberId: string; data: CreatePiutangRequest }) =>
      apiClient.post(API_ENDPOINTS.ADMIN_MEMBER_PIUTANG(memberId), data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['member', variables.memberId] });
      queryClient.invalidateQueries({ queryKey: ['member-profile'] });
    },
  });
};

export const useUpdatePiutang = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ memberId, piutangId, data }: { memberId: string; piutangId: string; data: UpdatePiutangRequest }) =>
      apiClient.patch(API_ENDPOINTS.ADMIN_MEMBER_PIUTANG_BY_ID(memberId, piutangId), data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['member', variables.memberId] });
      queryClient.invalidateQueries({ queryKey: ['member-profile'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-piutang'] });
    },
  });
};

// Simpanan hooks
export const useUpdateSimpanan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ memberId, data }: { memberId: string; data: UpdateSimpananRequest }) =>
      apiClient.patch(API_ENDPOINTS.ADMIN_MEMBER_SIMPANAN(memberId), data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['member', variables.memberId] });
      queryClient.invalidateQueries({ queryKey: ['member-profile'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-simpanan'] });
    },
  });
};

// Transaction hooks (admin)
export const useMemberTransactionsSimpanan = (memberId: string) => {
  return useQuery({
    queryKey: ['transactions-simpanan', memberId],
    queryFn: () => apiClient.get(API_ENDPOINTS.ADMIN_MEMBER_TRANSACTIONS_SIMPANAN(memberId)),
    enabled: !!memberId,
  });
};

export const useMemberTransactionsPiutang = (memberId: string) => {
  return useQuery({
    queryKey: ['transactions-piutang', memberId],
    queryFn: () => apiClient.get(API_ENDPOINTS.ADMIN_MEMBER_TRANSACTIONS_PIUTANG(memberId)),
    enabled: !!memberId,
  });
};

export const useMemberTransactionsCombined = (memberId: string) => {
  return useQuery({
    queryKey: ['transactions-combined', memberId],
    queryFn: () => apiClient.get(API_ENDPOINTS.ADMIN_MEMBER_TRANSACTIONS_COMBINED(memberId)),
    enabled: !!memberId,
  });
};

// Transaction hooks (user)
export const useMyTransactionsSimpanan = () => {
  return useQuery({
    queryKey: ['my-transactions-simpanan'],
    queryFn: () => apiClient.get(API_ENDPOINTS.MEMBER_ME_TRANSACTIONS_SIMPANAN),
  });
};

export const useMyTransactionsPiutang = () => {
  return useQuery({
    queryKey: ['my-transactions-piutang'],
    queryFn: () => apiClient.get(API_ENDPOINTS.MEMBER_ME_TRANSACTIONS_PIUTANG),
  });
};

export const useMyTransactionsCombined = () => {
  return useQuery({
    queryKey: ['my-transactions-combined'],
    queryFn: () => apiClient.get(API_ENDPOINTS.MEMBER_ME_TRANSACTIONS_COMBINED),
  });
};

// Product hooks (admin)
export const useAdminProducts = () => {
  return useQuery({
    queryKey: ['admin-products'],
    queryFn: () => apiClient.get(API_ENDPOINTS.ADMIN_PRODUCTS),
  });
};

export const useAdminProduct = (id: string) => {
  return useQuery({
    queryKey: ['admin-product', id],
    queryFn: () => apiClient.get(API_ENDPOINTS.ADMIN_PRODUCT_BY_ID(id)),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateProductRequest) => {
      const formData = new FormData();
      formData.append('namaProduk', data.namaProduk);
      formData.append('harga', data.harga.toString());
      formData.append('deskripsi', data.deskripsi);
      formData.append('namaKategori', data.namaKategori);
      formData.append('foto', data.foto);
      
      return apiClient.postFormData(API_ENDPOINTS.ADMIN_PRODUCTS, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['user-products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => {
      return apiClient.putFormData(API_ENDPOINTS.ADMIN_PRODUCT_BY_ID(id), data);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-product', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['user-products'] });
      queryClient.invalidateQueries({ queryKey: ['user-product', variables.id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(API_ENDPOINTS.ADMIN_PRODUCT_BY_ID(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['user-products'] });
    },
  });
};

// Product hooks (user)
export const useUserProducts = (page: number = 1) => {
  return useQuery({
    queryKey: ['user-products', page],
    queryFn: () => apiClient.get(`${API_ENDPOINTS.USER_PRODUCTS}?page=${page}`),
  });
};

export const useUserProduct = (id: string) => {
  return useQuery({
    queryKey: ['user-product', id],
    queryFn: () => apiClient.get(API_ENDPOINTS.USER_PRODUCT_BY_ID(id)),
    enabled: !!id,
  });
}; 