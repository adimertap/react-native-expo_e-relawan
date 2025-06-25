import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { jwtDecode } from 'jwt-decode';
import React, { useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { API_URL, TOKEN_KEY } from '../constants/env';
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
    nama?: string | null;
    email?: string | null;
    role?: string | null;
    choose_topic?: string | null;
  };
  isAuthenticated: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  updateAuthState: (newState: AuthProps['authState']) => void;
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
  error: null,
  updateAuthState: function (newState: AuthProps['authState']): void {
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
        nama: (decoded as any)?.nama,
        email: (decoded as any)?.email,
        role: (decoded as any)?.role,
        choose_topic: (decoded as any)?.choose_topic,
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

  const getFCMToken = async () => {
    try {
      // Request permission for notifications
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permission not granted');
        return;
      }

      // Get the FCM token
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });

      // Store token locally
      await AsyncStorage.setItem('fcmToken', token.data);
      
      // If user is logged in, send token to backend
      if (authState?.user_id) {
        try {
          await axios.post(`${API_URL}/api/user/update-fcm-token`, {
            user_id: authState.user_id,
            fcm_token: token.data
          });
          console.log('FCM token updated successfully');
        } catch (error) {
          // console.error('Error updating FCM token:', error);
        }
      }

      return token.data;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
