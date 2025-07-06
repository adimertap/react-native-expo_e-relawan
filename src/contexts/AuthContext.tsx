import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import React, { useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { TOKEN_KEY } from '../constants/env';
import { useAuth } from '../hooks/Auth/useAuth';
import { useFCMToken } from '../hooks/Auth/useFCMToken';

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
    nama?: string | null;
    email?: string | null;
    role?: string | null;
    choose_topic?: string | null;
  };
  isAuthenticated: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; userData?: any }>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  updateAuthState: (newState: AuthProps['authState']) => void;
  refreshFCMToken: () => Promise<void>;
}

const AuthContext = React.createContext<AuthProps>({
  isAuthenticated: false,
  initialized: false,
  login: function (email: string, password: string): Promise<{ success: boolean; userData?: any }> {
    throw new Error('Function not implemented.');
  },
  logout: function (): void {
    throw new Error('Function not implemented.');
  },
  loading: false,
  error: null,
  updateAuthState: function (newState: AuthProps['authState']): void {
    throw new Error('Function not implemented.');
  },
  refreshFCMToken: function (): Promise<void> {
    throw new Error('Function not implemented.');
  }
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
    initialized: boolean;
    user_id?: number;
    nama?: string | null;
    email?: string | null;
    role?: string | null;
    choose_topic?: string | null;
  }>({
    token: null,
    authenticated: null,
    initialized: false,
    nama: null,
    user_id: 0,
    email: null,
    role: null,
    choose_topic: null,
  });
  const { login: loginApi, logout: logoutApi, loading, error } = useAuth();
  const { registerFCMToken, forceRefreshFCMToken } = useFCMToken();

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
            nama: (decoded as any)?.nama,
            email: (decoded as any)?.email,
            role: (decoded as any)?.role,
            choose_topic: (decoded as any)?.choose_topic,
          });
          
          // Register FCM token if user is already logged in (only once)
          if ((decoded as any)?.user_id) {
            try {
              await registerFCMToken((decoded as any).user_id, storedToken);
            } catch (fcmError) {
              console.error('Error registering FCM token on app start:', fcmError);
            }
          }
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
  }, []); // Empty dependency array to run only once on mount

  const refreshFCMToken = async () => {
    try {
      if (!authState?.user_id || !authState.token) {
        console.log('Cannot refresh FCM token: user not authenticated');
        return;
      }
      
      console.log('Refreshing FCM token for user:', authState.user_id);
      const success = await forceRefreshFCMToken(authState.user_id, authState.token);
      if (success) {
        console.log('FCM token refreshed successfully');
      } else {
        console.log('FCM token refresh failed');
      }
    } catch (error) {
      console.error('Error refreshing FCM token:', error);
    }
  };
  

  const login = async (email: string, password: string) => {
    const response = await loginApi({ email, password });
    if (response?.token) {
      const decoded = jwtDecode(response.token);
      
      // Store token first
      try {
        await Storage.setItem(TOKEN_KEY, response.token);
      } catch (error) {
        console.error('Error saving token to storage:', error);
      }
      
      // Update auth state
      setAuthState({
        token: response.token,
        authenticated: true,
        initialized: true,
        user_id: (decoded as any)?.user_id,
        nama: (decoded as any)?.nama,
        email: (decoded as any)?.email,
        role: (decoded as any)?.role,
        choose_topic: (decoded as any)?.choose_topic,
      });
      
      // Register FCM token after successful login (only if user_id exists)
      if ((decoded as any)?.user_id) {
        console.log('Login successful, registering FCM token for user:', (decoded as any).user_id);
        try {
          const fcmSuccess = await registerFCMToken((decoded as any).user_id, response.token);
          if (fcmSuccess) {
            console.log('FCM token registered successfully after login');
          } else {
            console.log('FCM token registration failed or skipped');
          }
        } catch (fcmError) {
          console.error('Error registering FCM token after login:', fcmError);
          // Don't fail login if FCM registration fails
        }
      } else {
        console.log('No user_id found in token, skipping FCM registration');
      }
      
      return { 
        success: true, 
        userData: {
          user_id: (decoded as any)?.user_id,
          token: response.token,
          nama: (decoded as any)?.nama,
          email: (decoded as any)?.email,
          role: (decoded as any)?.role,
          choose_topic: (decoded as any)?.choose_topic,
        }
      };
    }
    return { success: false };
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
      nama: null,
      email: null,
      role: null,
      choose_topic: null,
    });
    logoutApi();
  };

  const updateAuthState = (newState: AuthProps['authState']) => {
    if (newState) {
      console.log("Updating auth state:", {
        previous: authState,
        new: newState
      });
      setAuthState(prev => ({
        ...prev,
        ...newState,
        authenticated: true,
        initialized: true,
      }));
    }
  };

  const value = {
    authState,
    isAuthenticated: authState.authenticated || false,
    initialized: authState.initialized || false,
    login: login,
    logout: logout,
    loading: loading,
    error: error,
    updateAuthState,
    refreshFCMToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
