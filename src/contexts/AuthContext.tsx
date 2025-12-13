import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUser } from '@/lib/mockData';

// Mock user type for demo
interface MockUser {
  id: string;
  email: string;
  name: string;
  organization?: string;
  created_at: string;
}

interface AuthContextType {
  user: MockUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<{ requiresEmailConfirmation: boolean }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Start med mock-bruker innlogget for demo
  const [user, setUser] = useState<MockUser | null>(mockUser);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Mock login - alltid suksess, setter mock-bruker
  const login = async (_email: string, _password: string) => {
    setIsLoading(true);
    // Simuler kort delay for realistisk UX
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(mockUser);
    setIsLoading(false);
    navigate('/dashboard');
  };

  // Mock register - alltid suksess
  const register = async (_email: string, _password: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(mockUser);
    setIsLoading(false);
    navigate('/dashboard');
    return { requiresEmailConfirmation: false };
  };

  // Mock logout
  const logout = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setUser(null);
    setIsLoading(false);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
