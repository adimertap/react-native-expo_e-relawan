import { API_URL } from '@/src/constants/env';
import { useAuthContext } from '@/src/contexts/AuthContext';
import { UserType } from '@/src/types/types';
import { useCallback, useEffect, useState } from 'react';

export const useFetchProfileRelawan = () => {
  const [profile, setProfile] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authState, isAuthenticated } = useAuthContext();   

  const fetchProfileRelawan = useCallback(async () => {
    if (!isAuthenticated || !authState?.token) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_URL}/mobile/relawan/profile`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authState.token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile data relawan');
      }

      const data = await response.json();
      setProfile(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [authState?.token, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && authState?.token) {
        fetchProfileRelawan();
    } else {
      setProfile(null);
      setError(null);
    }
  }, [fetchProfileRelawan, isAuthenticated, authState?.token]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfileRelawan
  };
};

