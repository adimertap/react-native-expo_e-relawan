import { API_URL } from "@/src/constants/env";
import { useAuthContext } from "@/src/contexts/AuthContext";
import axios from "axios";
import { useState } from "react";

export const useRatingKegiatan = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuthContext();

  const ratingKegiatan = async (subs_kegiatan_id: number, rating: number, review: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.put(
        `${API_URL}/mobile/relawan/kegiatan/${subs_kegiatan_id}/update-rating`,
        {
          rating: rating || 0,
          review: review || ""
        },
        {
          headers: {
            Authorization: `Bearer ${authState?.token}`
          }
        }
      );

      if (response.data.success) {
        return {
          success: true,
          message: "Rating kegiatan berhasil dikirim"
        };
      } else {
        throw new Error(response.data.message || "Terjadi kesalahan");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Terjadi kesalahan";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    ratingKegiatan,
    loading,
    error
  };
};
