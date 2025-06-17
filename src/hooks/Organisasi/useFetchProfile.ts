import { API_URL } from '@/src/constants/env';
import { useAuthContext } from '@/src/contexts/AuthContext';
import { OrganisasiType } from '@/src/types/types';
import { useCallback, useEffect, useState } from 'react';

export const useFetchProfile = () => {
  const [profile, setProfile] = useState<OrganisasiType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authState, isAuthenticated } = useAuthContext();   

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated || !authState?.token) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_URL}/mobile/organisasi/profile`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authState.token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
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
      fetchProfile();
    } else {
      setProfile(null);
      setError(null);
    }
  }, [fetchProfile, isAuthenticated, authState?.token]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile
  };
};

