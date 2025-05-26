// import { API_URL } from '@env';
import { API_URL } from '@/src/constants/env';
import { KegiatanType } from '@/src/types/types';
import { useEffect, useState } from 'react';

export const useFetchDetailKegiatan = (id: number) => {
  const [detailKegiatan, setDetailKegiatan] = useState<KegiatanType>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetailKegiatan = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/mobile/kegiatan/${id}/detail`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch detail kegiatan data');
      }

      const data = await response.json();
      setDetailKegiatan(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetailKegiatan(id);
  }, [id]);

  return {
    detailKegiatan,
    loading,
    error,
    refetch: fetchDetailKegiatan
  };
};
