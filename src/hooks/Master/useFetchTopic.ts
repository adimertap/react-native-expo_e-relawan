// import { API_URL } from '@env';
import { API_URL } from '@/src/constants/env';
import { TopicType } from '@/src/types/types';
import { useEffect, useState } from 'react';

export const useFetchTopic = () => {
  const [topic, setTopic] = useState<TopicType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTopic = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/master/topic`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch topic data');
      }

      const data = await response.json();
      const datas = data.data;
      setTopic(datas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopic();
  }, []);

  return {
    topic,
    loading,
    error,
    refetch: fetchTopic
  };
};
