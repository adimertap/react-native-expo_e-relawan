import { API_URL } from '@/src/constants/env';
import { useAuthContext } from '@/src/contexts/AuthContext';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';

interface KegiatanData {
  user_cv?: DocumentPicker.DocumentPickerResult;
  about_me?: string;
  kegiatan_id: number;
  status?: string;
}

export const useApplyKegiatan = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuthContext();

  const applyKegiatan = async (data: KegiatanData) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('user_id', authState?.user_id?.toString() || '');
      formData.append('status', data.status || '');
      formData.append('about_me', data.about_me || '');

      if (data.user_cv && !data.user_cv.canceled && data.user_cv.assets[0]) {
        const fileUri = data.user_cv.assets[0].uri;
        const fileType = data.user_cv.assets[0].mimeType || 'application/pdf';
        const fileName = data.user_cv.assets[0].name || 'user_cv.pdf';

        formData.append('user_cv', {
          uri: fileUri,
          type: fileType,
          name: fileName
        } as any);
      }

      const response = await axios.post(
        `${API_URL}/mobile/relawan/kegiatan/apply/${data.kegiatan_id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${authState?.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        return {
          success: true,
          message: 'Kegiatan berhasil diikuti'
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
    applyKegiatan,
    loading,
    error,
  };
};
