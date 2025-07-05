import { API_URL } from '@/src/constants/env';
import { useAuthContext } from '@/src/contexts/AuthContext';
import { useCallback, useState } from 'react';

export const useCheckVerified = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuthContext();

  const fetchCheckVerified = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/mobile/organisasi/is_verified`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authState?.token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch check verified data');
      }

      const data = await response.json();
      console.log("API Response:", data);
      setIsVerified(data.data.is_verified);
      return data.data.is_verified; // Return the verification status
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err; // Re-throw to handle in the calling function
    } finally {
      setLoading(false);
    }
  }, [authState?.token]);

  return {
    isVerified,
    loading,
    error,
    refetch: fetchCheckVerified
  };
};

