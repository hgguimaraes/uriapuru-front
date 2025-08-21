/**
 * Authentication context with JWT and RBAC
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

export type UserRole = 'ENGINEER' | 'ADMIN' | 'USER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (resource: string, action: 'read' | 'write') => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const RBAC_RULES: Record<string, Record<'read' | 'write', UserRole[]>> = {
  orders: {
    read: ['ENGINEER', 'ADMIN', 'USER'],
    write: ['ENGINEER', 'ADMIN']
  },
  contracts: {
    read: ['ENGINEER', 'ADMIN', 'USER'],
    write: ['ADMIN']
  },
  invoices: {
    read: ['ENGINEER', 'ADMIN', 'USER'],
    write: ['ADMIN']
  },
  billing: {
    read: ['ENGINEER', 'ADMIN', 'USER'],
    write: ['ENGINEER', 'ADMIN']
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const savedToken = Cookies.get('auth-token');
    const savedUser = Cookies.get('auth-user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        logout();
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v2/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-request-id': crypto.randomUUID(),
          'x-tenant-id': process.env.NEXT_PUBLIC_TENANT_ID || 'public'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      // Set secure cookies
      Cookies.set('auth-token', data.token, { 
        expires: 7, // 7 days
        httpOnly: false, // Client needs to read this
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      Cookies.set('auth-user', JSON.stringify(data.user), { 
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      setToken(data.token);
      setUser(data.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove('auth-token');
    Cookies.remove('auth-user');
    setToken(null);
    setUser(null);
  };

  const hasPermission = (resource: string, action: 'read' | 'write'): boolean => {
    if (!user) return false;
    
    const resourceRules = RBAC_RULES[resource];
    if (!resourceRules) return false;
    
    const allowedRoles = resourceRules[action];
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      hasPermission,
      isLoading
    }}>
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

// HOC for protecting routes
export function withAuth<T extends object>(WrappedComponent: React.ComponentType<T>) {
  return function AuthenticatedComponent(props: T) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Acesso Restrito
            </h2>
            <p className="text-gray-600 text-center">
              Você precisa fazer login para acessar esta página.
            </p>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}