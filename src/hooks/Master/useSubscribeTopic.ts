// import { API_URL } from '@env';
import { API_URL } from '@/src/constants/env';
import { useAuthContext } from '@/src/contexts/AuthContext';
import { TopicType } from '@/src/types/types';
import { useState } from 'react';

export const useSubscribeTopic = () => {
  const [subscribeTopic, setSubscribeTopic] = useState<TopicType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authState, updateAuthState } = useAuthContext();

  const submitSubscribeTopic = async (topicIds: number[]) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/mobile/subs-topic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState?.token}`,
        },
        body: JSON.stringify({ topic_id: topicIds }),
      });
      if (!response.ok) {
        throw new Error('Failed to subscribe topic data');
      }
      const data = await response.json();
      setSubscribeTopic(data.data || []);
      
      // Update auth state to reflect that user has chosen topics
      if (authState) {
        updateAuthState({
          ...authState,
          choose_topic: 'Y'
        });
      }
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    subscribeTopic,
    loading,
    error,
    submitSubscribeTopic,
  };
};
