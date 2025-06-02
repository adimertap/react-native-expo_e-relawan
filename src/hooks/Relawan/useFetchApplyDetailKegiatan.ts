import { API_URL } from '@/src/constants/env';
import { useAuthContext } from '@/src/contexts/AuthContext';
import { SubsKegiatanType } from '@/src/types/types';
import { useEffect, useState } from 'react';


export const useFetchApplyDetailKegiatan = (id: number) => {
  const [applyDetailKegiatan, setApplyDetailKegiatan] = useState<SubsKegiatanType>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuthContext();
  
  const fetchApplyDetailKegiatan = async (id: number) => {
    try {
        
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/mobile/relawan/kegiatan/${id}/detail`, {
        headers: {
          Authorization: `Bearer ${authState?.token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch apply detail kegiatan data');
      }
      const data = await response.json();
      setApplyDetailKegiatan(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplyDetailKegiatan(id);
  }, [id]);

  return {
    applyDetailKegiatan,
    loading,
    error,
    refetch: fetchApplyDetailKegiatan
  };
};
