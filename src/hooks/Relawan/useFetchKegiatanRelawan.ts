// import { API_URL } from '@env';
import { API_URL } from '@/src/constants/env';
import { useAuthContext } from '@/src/contexts/AuthContext';
import { KegiatanType } from '@/src/types/types';
import { useCallback, useEffect, useState } from 'react';

interface FetchKegiatanParams {
  search?: string;
  topic_id?: number;
}

export const useFetchKegiatanRelawan = (params?: FetchKegiatanParams) => {
  const [kegiatan, setKegiatan] = useState<KegiatanType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuthContext();

  const fetchKegiatanRelawan = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params?.search) {
        queryParams.append('search', params.search);
      }
      if (params?.topic_id) {
        queryParams.append('topic_id', params.topic_id.toString());
      }

      const response = await fetch(
        `${API_URL}/mobile/relawan/kegiatan?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authState?.token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch kegiatan relawan data');
      }

      const data = await response.json();
      setKegiatan(data.data.rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [authState?.token, params?.search, params?.topic_id]);

  useEffect(() => {
    fetchKegiatanRelawan();
  }, [fetchKegiatanRelawan]);

  return {
    kegiatan,
    loading,
    error,
    refetch: fetchKegiatanRelawan
  };
};

