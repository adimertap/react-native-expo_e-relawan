import { API_URL } from '@/src/constants/env';
import { useAuthContext } from '@/src/contexts/AuthContext';
import axios from 'axios';
import { useState } from 'react';

export const useDeleteKegiatan = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuthContext();

  const deleteKegiatan = async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.delete(`${API_URL}/master/kegiatan/${id}`, {
        headers: {
          Authorization: `Bearer ${authState?.token}`,
        },
      });

      if (response.data.success) {
        return {
          success: true,
          message: 'Kegiatan berhasil dihapus'
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
    deleteKegiatan,
    loading,
    error,
  };
};
