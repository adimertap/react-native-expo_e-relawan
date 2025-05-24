import { API_URL } from '@/src/constants/env';
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

  const logout = () => {
    localStorage.removeItem('token');
  };

  return { login, logout, loading, error };
}; 