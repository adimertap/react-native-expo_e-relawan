import { API_URL } from '@/src/constants/env';
import { useAuthContext } from '@/src/contexts/AuthContext';
import axios from 'axios';
import { useState } from 'react';
export const useUpdateKegiatanSelesai = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuthContext();

  const updateKegiatanSelesai = async (kegiatan_id: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.put(`${API_URL}/mobile/kegiatan/${kegiatan_id}/status-selesai`, {}, {
        headers: {
          Authorization: `Bearer ${authState?.token}`,
        },
      });

      if (response.data.success) {
        return {
          success: true,
          message: 'Status Kegiatan selesai berhasil diubah'
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
    updateKegiatanSelesai,
    loading,
    error,
  };
};
