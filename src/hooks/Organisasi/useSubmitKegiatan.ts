import { API_URL } from '@/src/constants/env';
import { useAuthContext } from '@/src/contexts/AuthContext';
import axios from 'axios';
import { useState } from 'react';

interface KegiatanData {
  nama_kegiatan: string;
  topic_id: number;
  jenis_kegiatan_id: number;
  start_date: string;
  end_date: string;
  location: string;
  relawan_dibutuhkan: string;
  total_jam_kerja: string;
  tugas_relawan: string;
  kriteria_relawan: string;
  deskripsi_kegiatan: string;
  photo?: string;
  dokumen_pendukung?: string;
  perlu_pertanyaan?: boolean;
  deadline?: string;
}

export const useSubmitKegiatan = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuthContext();

  const submitKegiatan = async (data: KegiatanData) => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!data.nama_kegiatan || !data.topic_id || !data.jenis_kegiatan_id || 
          !data.start_date || !data.end_date || !data.location || !data.dokumen_pendukung) {
        throw new Error('Semua field wajib diisi');
      }

      const response = await axios.post(`${API_URL}/mobile/create/kegiatan`, {
        ...data,
        user_id: authState?.user_id,
      }, {
        headers: {
          Authorization: `Bearer ${authState?.token}`,
        },
      });

      if (response.data.success) {
        return {
          success: true,
          message: 'Kegiatan berhasil ditambahkan'
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
    submitKegiatan,
    loading,
    error,
  };
};
