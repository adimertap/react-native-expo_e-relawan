import { API_URL } from '@/src/constants/env';
import { useAuthContext } from '@/src/contexts/AuthContext';
import axios from 'axios';
import { useState } from 'react';

export const useUpdateProfileRelawan = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuthContext();

  const updateProfileRelawan = async (
    nama: string,
    email: string,
    phone?: string,
    alamat?: string,
    kabupaten_id?: number,
    provinsi_id?: number,
    gol_darah?: string,
    tanggal_lahir?: string,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `${API_URL}/mobile/relawan/update-profile`,
        {
          nama: nama || "",
          email: email || "",
          phone: phone || "",
          alamat: alamat || "",
          kabupaten_id: kabupaten_id || "",
          provinsi_id: provinsi_id || "",
          gol_darah: gol_darah || "",
          tanggal_lahir: tanggal_lahir || "",
        },
        {
          headers: {
            Authorization: `Bearer ${authState?.token}`,
          },
        }
      );

      if (response.data.success) {
        return {
          success: true,
          message: 'Profile berhasil diubah',
        };
      } else {
        throw new Error(response.data.message || 'Terjadi kesalahan');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Terjadi kesalahan';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProfileRelawan,
    loading,
    error,
  };
}; 