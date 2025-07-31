
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
    
    const validateToken = async () => {
      if (storedUser && token) {
        try {
          // Validate token by making a request to profile endpoint
          await apiClient.get(API_ENDPOINTS.MEMBER_PROFILE);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Token validation failed:', error);
          // Clear user data and token if validation fails
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    validateToken();
  }, []);

  const login = async (nrp: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Try with new structure first (only nrp and password)
      let loginResponse;
      
      // Try with new structure first (only nrp and password)
      const loginData = { nrp, password } as Record<string, unknown>;
      console.log('Sending login request with data:', loginData);
      
      try {
        loginResponse = await apiClient.post(API_ENDPOINTS.LOGIN, loginData);
        console.log('Login response received:', loginResponse);
      } catch (error) {
        // If first attempt fails, try with old structure
        console.log('First login attempt failed, trying with old structure...');
        const oldLoginData = {
          nrp,
          nama: 'User', // Default values
          jabatan: 'Member',
          password,
          role: 'member'
        } as Record<string, unknown>;
        
        loginResponse = await apiClient.post(API_ENDPOINTS.LOGIN, oldLoginData);
        console.log('Login response with old structure:', loginResponse);
      }
      
      if (!loginResponse || !loginResponse.user) {
        console.error('Login response invalid:', loginResponse);
        setIsLoading(false);
        return false;
      }
      
      // Check if response has the expected structure
      // Check for different possible response structures
      const userData = loginResponse.user || loginResponse.data?.user || loginResponse.member || loginResponse.data?.member;
      const token = loginResponse.token || loginResponse.data?.token || loginResponse.accessToken || loginResponse.data?.accessToken;
      
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
          piutang: userData.piutang || userData.debt || 0
        };
        
        console.log('Transformed user object:', user);
        
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        setIsLoading(false);
        return true;
      }
      
      console.error('Response missing user data or token:', loginResponse);
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint
      await apiClient.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local data regardless of API call result
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
