// import { API_URL } from '@env';
import { API_URL } from '@/src/constants/env';
import { JenisKegiatanType } from '@/src/types/types';
import { useEffect, useState } from 'react';

export const useFetchJenisKegiatan = () => {
  const [jenisKegiatan, setJenisKegiatan] = useState<JenisKegiatanType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJenisKegiatan = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/master/jenis-kegiatan`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch jenis kegiatan data');
      }

      const data = await response.json();
      const datas = data.data;
      setJenisKegiatan(datas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJenisKegiatan();
  }, []);

  return {
    jenisKegiatan,
    loading,
    error,
    refetch: fetchJenisKegiatan
  };
};
