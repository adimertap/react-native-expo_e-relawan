import { API_URL, MOBILE_VERSION } from '@/src/constants/env';
import { OrganisasiRegistrationType } from '@/src/types/types';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export const useRegisOrganisasi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const registerOrganisasi = async (data: OrganisasiRegistrationType) => {
    try {
      setLoading(true);
      setError(null);
      console.log(data)
      
      const response = await axios.post(`${API_URL}/auth/register`, {
        ...data,
        role: 'organisasi',
        apk_version: MOBILE_VERSION
      });
      console.log(response)

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
  return { registerOrganisasi, loading, error };
};
