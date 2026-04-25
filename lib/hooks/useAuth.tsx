// lib/hooks/useAuth.tsx
'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import {
  createAuthHeader,
  getAuthTokenFromCookie,
  setAuthTokenCookie,
  clearAuthTokenCookie
} from '@/lib/auth/auth-helpers-client';
import { getApiUrl } from '@/lib/utils';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// Create context
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Auth Provider component
 * Wrap your app with this to provide auth context
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Get token from cookie on mount
  useEffect(() => {
    const cookieToken = getAuthTokenFromCookie();

    if (cookieToken) {
      setToken(cookieToken);
      verifyToken(cookieToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Verify token and get user info
  const verifyToken = async (authToken: string) => {
    try {
      const response = await fetch(getApiUrl('/auth/verify'), {
        headers: createAuthHeader(authToken),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setToken(authToken);
      } else {
        // Token invalid, clear it
        clearAuthTokenCookie();
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    const response = await fetch(getApiUrl('/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Set cookie
    setAuthTokenCookie(data.token);

    setToken(data.token);
    setUser(data.user);

    // Redirect to admin dashboard
    router.push('/admin/dashboard');
  };

  // Logout function
  const logout = async () => {
    try {
      await fetch(getApiUrl('/auth/logout'), {
        method: 'POST',
        headers: token ? createAuthHeader(token) : {},
      });
    } catch (error) {
      console.error('Logout error:', error);
    }

    // Clear cookie
    clearAuthTokenCookie();

    setToken(null);
    setUser(null);

    // Redirect to home
    router.push('/');
  };

  const value: AuthContextValue = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

/**
 * Create auth headers for API requests
 */
export function useAuthHeaders() {
  const { token } = useAuth();

  return useCallback(() => {
    return token ? createAuthHeader(token) : {};
  }, [token]);
}