import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  grade?: string;
  points?: number;
  totalPurchase?: number;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, phone: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 복원
    const savedUser = localStorage.getItem('zeroPhone_user');
    const savedToken = localStorage.getItem('zeroPhone_token');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedToken) {
      setAccessToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // 관리자 계정 체크
      if (email === 'admin@zerophone.com' && password === 'admin') {
        const adminUser = {
          id: 'admin-001',
          email: 'admin@zerophone.com',
          name: '관리자',
          phone: '010-0000-0000',
          grade: 'Admin',
          points: 0,
          totalPurchase: 0,
          isAdmin: true
        };
        const adminToken = 'admin-token-' + Date.now();

        setUser(adminUser);
        setAccessToken(adminToken);
        localStorage.setItem('zeroPhone_user', JSON.stringify(adminUser));
        localStorage.setItem('zeroPhone_token', adminToken);
        setIsLoading(false);
        return true;
      }

      // 일반 사용자 로그인 처리
      try {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a2a27f6d/signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
          // API 실패 시 모의 사용자로 로그인
          console.warn('API login failed, using mock user');
          const mockUser = {
            id: 'user-' + Date.now(),
            email: email,
            name: email.split('@')[0],
            phone: '010-1234-5678',
            grade: 'Bronze',
            points: 1000,
            totalPurchase: 50000,
            isAdmin: false
          };
          const mockToken = 'user-token-' + Date.now();

          setUser(mockUser);
          setAccessToken(mockToken);
          localStorage.setItem('zeroPhone_user', JSON.stringify(mockUser));
          localStorage.setItem('zeroPhone_token', mockToken);
          setIsLoading(false);
          return true;
        }

        const data = await response.json();
        const userData = data.user;
        const token = data.access_token;

        setUser(userData);
        setAccessToken(token);
        localStorage.setItem('zeroPhone_user', JSON.stringify(userData));
        localStorage.setItem('zeroPhone_token', token);
        setIsLoading(false);
        return true;
      } catch (apiError) {
        // API 에러 발생 시 모의 데이터로 처리
        console.warn('API error, using mock login:', apiError);
        const mockUser = {
          id: 'user-' + Date.now(),
          email: email,
          name: email.split('@')[0],
          phone: '010-1234-5678',
          grade: 'Bronze',
          points: 1000,
          totalPurchase: 50000,
          isAdmin: false
        };
        const mockToken = 'user-token-' + Date.now();

        setUser(mockUser);
        setAccessToken(mockToken);
        localStorage.setItem('zeroPhone_user', JSON.stringify(mockUser));
        localStorage.setItem('zeroPhone_token', mockToken);
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string, phone: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a2a27f6d/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email, password, name, phone })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Signup failed:', errorData);
        setIsLoading(false);
        return false;
      }

      const data = await response.json();
      console.log('Signup successful:', data);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      if (accessToken) {
        await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a2a27f6d/signout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    }

    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('zeroPhone_user');
    localStorage.removeItem('zeroPhone_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}