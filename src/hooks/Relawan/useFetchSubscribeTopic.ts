import { API_URL } from "@/src/constants/env";
import { useAuthContext } from "@/src/contexts/AuthContext";
import { useCallback, useState } from "react";

export const useFetchSubscribeTopic = () => {
  const [subscribeTopic, setSubscribeTopic] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authState, isAuthenticated } = useAuthContext();

  const fetchSubscribeTopic = useCallback(async () => {
    if (!isAuthenticated || !authState?.token) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_URL}/mobile/relawan/subscribe-topic`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile data relawan");
      }

      const data = await response.json();
      setSubscribeTopic(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [authState?.token, isAuthenticated]);

  return {
    fetchSubscribeTopic,
    loading,
    error,
    subscribeTopic
  };
};
