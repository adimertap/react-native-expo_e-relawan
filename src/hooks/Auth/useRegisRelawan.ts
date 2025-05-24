import { API_URL, MOBILE_VERSION } from '@/src/constants/env';
import { UserType } from '@/src/types/types';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export const useRegisRelawan = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const registerRelawan = async (data: UserType) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_URL}/auth/register`, {
        ...data,
        role: 'relawan',
        apk_version: MOBILE_VERSION
      });

      if (response.data.success) {
        router.push('/login');
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('Email sudah terdaftar');
      } else {
        setError(`${err.response?.data.message}`);
      }
    } finally {
      setLoading(false);
    }
  };
  return { registerRelawan, loading, error };
};
