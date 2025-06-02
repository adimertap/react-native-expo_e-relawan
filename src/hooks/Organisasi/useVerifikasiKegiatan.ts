import { API_URL } from '@/src/constants/env';
import { useAuthContext } from '@/src/contexts/AuthContext';
import axios from 'axios';
import { useState } from 'react';

export const useVerifikasiKegiatan = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuthContext();

  const verifikasiKegiatan = async (kegiatan_id: number, user_id: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.put(`${API_URL}/mobile/kegiatan/${kegiatan_id}/verifikasi/${user_id}`, {
      }, {
        headers: {
          Authorization: `Bearer ${authState?.token}`,
        },
      });

      if (response.data.success) {
        return {
          success: true,
          message: 'Kegiatan berhasil diverifikasi'
        };
      } else {
        throw new Error(response.data.message || 'Terjadi kesalahan');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Terjadi kesalahan';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    verifikasiKegiatan,
    loading,
    error,
  };
};
