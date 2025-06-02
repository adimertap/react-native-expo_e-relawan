// import { API_URL } from '@env';
import { API_URL } from '@/src/constants/env';
import { ProvinsiType } from '@/src/types/types';
import { useEffect, useState } from 'react';

export const useHooksProvinsi = () => {
  const [provinsi, setProvinsi] = useState<ProvinsiType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProvinsi = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/master/provinsi`);
      console.log(response);
      if (!response.ok) throw new Error('Failed to fetch province data');
      const data = await response.json();
      const datas = data.data;
      setProvinsi(datas);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProvinsi();
  }, []);

  return {
    provinsi,
    loading,
    error,
    refetch: fetchProvinsi
  };
};
