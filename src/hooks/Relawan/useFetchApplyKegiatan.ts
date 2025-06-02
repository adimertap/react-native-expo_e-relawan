// import { API_URL } from '@env';
import { API_URL } from '@/src/constants/env';
import { useAuthContext } from '@/src/contexts/AuthContext';
import { SubsKegiatanType } from '@/src/types/types';
import { useCallback, useEffect, useState } from 'react';

interface FetchKegiatanParams {
  topic_id?: number;
}

export const useFetchApplyKegiatan = (params?: FetchKegiatanParams) => {
  const [applyKegiatan, setApplyKegiatan] = useState<SubsKegiatanType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuthContext();

  const fetchApplyKegiatan = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (params?.topic_id) {
        queryParams.append('topic_id', params.topic_id.toString());
      }

      const response = await fetch(
        `${API_URL}/mobile/relawan/kegiatan/self?${queryParams.toString()}`,
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
      setApplyKegiatan(data.data.rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [authState?.token, params?.topic_id]);

  useEffect(() => {
    fetchApplyKegiatan();
  }, [fetchApplyKegiatan]);

  return {
    applyKegiatan,
    loading,
    error,
    refetch: fetchApplyKegiatan
  };
};

