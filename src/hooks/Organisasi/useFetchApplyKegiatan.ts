import { API_URL } from '@/src/constants/env';
import { useAuthContext } from '@/src/contexts/AuthContext';
import { KegiatanType } from '@/src/types/types';
import { useCallback, useEffect, useState } from 'react';

export const useFetchApplyKegiatan = () => {
  const [kegiatan, setKegiatan] = useState<KegiatanType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuthContext();

  const fetchApplyKegiatan = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_URL}/mobile/organisasi/list/apply`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authState?.token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch apply kegiatan data');
      }

      const data = await response.json();
      setKegiatan(data.data.rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [authState?.token]);

  useEffect(() => {
    fetchApplyKegiatan();
  }, [fetchApplyKegiatan]);

  return {
    kegiatan,
    loading,
    error,
    refetch: fetchApplyKegiatan
  };
};

