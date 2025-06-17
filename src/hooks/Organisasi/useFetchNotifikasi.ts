import { API_URL } from '@/src/constants/env';
import { useAuthContext } from '@/src/contexts/AuthContext';
import { NotifikasiType } from '@/src/types/types';
import { useCallback, useEffect, useState } from 'react';

export const useFetchNotifikasi = () => {
  const [notifikasi, setNotifikasi] = useState<NotifikasiType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuthContext();

  const fetchNotifikasi = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_URL}/mobile/organisasi/list/notifikasi`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authState?.token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifikasi data');
      }

      const data = await response.json();
      setNotifikasi(data.data.rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [authState?.token]);

  useEffect(() => {
    fetchNotifikasi();
  }, [fetchNotifikasi]);

  return {
    notifikasi,
    loading,
    error,
    refetch: fetchNotifikasi
  };
};

