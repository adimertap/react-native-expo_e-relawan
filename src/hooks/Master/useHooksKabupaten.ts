// import { API_URL } from '@env';
import { API_URL } from '@/src/constants/env';
import { KabupatenType } from '@/src/types/types';
import { useEffect, useState } from 'react';

export const useHooksKabupaten = (provinsi_id: number) => {
  const [kabupaten, setKabupaten] = useState<KabupatenType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchKabupaten = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/master/kabupaten/provinsi/${provinsi_id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch province data');
      }

      const data = await response.json();
      const datas = data.data;
      setKabupaten(datas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKabupaten();
  }, [provinsi_id]);

  return {
    kabupaten,
    loading,
    error,
    refetch: fetchKabupaten
  };
};
