import { API_URL, TOKEN_KEY } from '@/src/constants/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useState } from 'react';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials): Promise<LoginResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      console.log("Login response:", response);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during login');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      
      // Remove token first to prevent any subsequent requests from using it
      await AsyncStorage.removeItem(TOKEN_KEY);
      
      if (token) {
        try {
          await axios.post(`${API_URL}/auth/logout`, {}, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } catch (err) {
          // Even if the logout API call fails, we've already removed the token
          console.error('Logout API error:', err);
        }
      }
    } catch (err: any) {
      console.error('Logout error:', err);
      setError(err.response?.data?.message || 'An error occurred during logout');
    } finally {
      setLoading(false);
    }
  };

  return { login, logout, loading, error };
}; 