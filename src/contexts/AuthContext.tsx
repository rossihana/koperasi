
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, API_ENDPOINTS, LoginRequest, LoginResponse, Member } from '@/lib/api';

interface AuthContextType {
  user: Member | null;
  login: (nrp: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data and token
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (nrp: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Try with new structure first (only nrp and password)
      let loginData: LoginRequest = { nrp, password };
      console.log('Sending login request with data:', loginData);
      
      let response = await apiClient.post(API_ENDPOINTS.LOGIN, loginData);
      console.log('Login response received:', response);
      
      // If first attempt fails, try with old structure (with nama, jabatan, role)
      if (!response || !response.user) {
        console.log('Trying with old login structure...');
        const oldLoginData = {
          nrp,
          nama: 'User', // Default values
          jabatan: 'Member',
          password,
          role: 'member'
        };
        response = await apiClient.post(API_ENDPOINTS.LOGIN, oldLoginData);
        console.log('Login response with old structure:', response);
      }
      
      // Check if response has the expected structure
      if (response && typeof response === 'object') {
        // Check for different possible response structures
        const userData = response.user || response.data?.user || response.member || response.data?.member;
        const token = response.token || response.data?.token || response.accessToken || response.data?.accessToken;
        
        console.log('Extracted user data:', userData);
        console.log('Extracted token:', token);
        
        if (userData && token) {
          // Transform user data to match our Member interface
          const user: Member = {
            id: userData.id || userData._id || '',
            nrp: userData.nrp || '',
            nama: userData.nama || userData.name || '',
            jabatan: userData.jabatan || userData.position || '',
            role: userData.role || 'member',
            createdAt: userData.createdAt || userData.joinDate || new Date().toISOString(),
            activeLoanCount: userData.activeLoanCount || 0,
            hasActiveLoan: userData.hasActiveLoan || false,
            // Optional fields for backward compatibility
            simpanan: userData.simpanan || userData.savings || 0,
            piutang: userData.piutang || userData.debt || 0,
            joinDate: userData.joinDate || userData.createdAt || new Date().toISOString()
          };
          
          console.log('Transformed user object:', user);
          
          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);
          setIsLoading(false);
          return true;
        } else {
          console.error('Response missing user data or token:', response);
          setIsLoading(false);
          return false;
        }
      } else {
        console.error('Invalid response format:', response);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint
      const response = await apiClient.post(API_ENDPOINTS.LOGOUT);
      if (response && response.success) {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } else {
        console.error('Logout gagal:', response?.message || 'Unknown error');
        // Optional: tampilkan toast error jika ingin
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Optional: tampilkan toast error jika ingin
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
