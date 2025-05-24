import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import React, { useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { TOKEN_KEY } from '../constants/env';
import { useAuth } from '../hooks/Auth/useAuth';

// Platform-specific storage implementation
const Storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      } else {
        return await AsyncStorage.getItem(key);
      }
    } catch (error) {
      console.warn('Storage getItem error:', error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn('Storage setItem error:', error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.warn('Storage removeItem error:', error);
    }
  }
};

interface AuthProps {
  authState?: {
    token: string | null;
    user_id?: number;
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
  isAuthenticated: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = React.createContext<AuthProps>({
  isAuthenticated: false,
  initialized: false,
  login: function (email: string, password: string): Promise<boolean> {
    throw new Error('Function not implemented.');
  },
  logout: function (): void {
    throw new Error('Function not implemented.');
  },
  loading: false,
  error: null
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
    initialized: boolean;
    user_id?: number;
    name?: string | null;
    email?: string | null;
    role?: string | null;
  }>({
    token: null,
    authenticated: null,
    initialized: false,
    name: null,
    user_id: 0,
    email: null,
    role: null,
  });
  const { login: loginApi, logout: logoutApi, loading, error } = useAuth();

  useEffect(() => {
    // Check for token in storage on mount
    const checkToken = async () => {
      try {
        const storedToken = await Storage.getItem(TOKEN_KEY);
        if (storedToken) {
          const decoded = jwtDecode(storedToken);
          setAuthState({
            token: storedToken,
            authenticated: true,
            initialized: true,
            user_id: (decoded as any)?.user_id,
            name: (decoded as any)?.name,
            email: (decoded as any)?.email,
            role: (decoded as any)?.role,
          });
        } else {
          setAuthState(prev => ({
            ...prev,
            authenticated: false,
            initialized: true,
          }));
        }
      } catch (error) {
        console.error('Error reading token from storage:', error);
        setAuthState(prev => ({
          ...prev,
          authenticated: false,
          initialized: true,
        }));
      }
    };
    
    checkToken();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginApi({ email, password });
    if (response?.token) {
      const decoded = jwtDecode(response.token);
      setAuthState({
        token: response.token,
        authenticated: true,
        initialized: true,
        user_id: (decoded as any)?.user_id,
        name: (decoded as any)?.name,
        email: (decoded as any)?.email,
        role: (decoded as any)?.role,
      });
      try {
        await Storage.setItem(TOKEN_KEY, response.token);
      } catch (error) {
        console.error('Error saving token to storage:', error);
      }
      return true;
    }
    return false;
  };

  const logout = async () => {
    try {
      await Storage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token from storage:', error);
    }
    setAuthState({
      token: null,
      authenticated: false,
      initialized: true,
      user_id: 0,
      name: null,
      email: null,
      role: null,
    });
    logoutApi();
  };

  const value = {
    authState,
    isAuthenticated: authState.authenticated || false,
    initialized: authState.initialized || false,
    login: login,
    logout: logout,
    loading: loading,
    error: error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
