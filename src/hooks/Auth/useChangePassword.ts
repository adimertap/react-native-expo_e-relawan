import { API_URL } from "@/src/constants/env";
import { useAuthContext } from "@/src/contexts/AuthContext";
import axios from "axios";
import { useState } from "react";

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuthContext();

  const changePassword = async (new_password: string, confirm_password:string) => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (confirm_password !== new_password) {
        throw new Error("Confirm Password tidak sesuai atau tidak match");
      }

      const response = await axios.post(
        `${API_URL}/auth/change/password`,
        {
            new_password: new_password,
            confirm_password: confirm_password
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
          message: "Password berhasil di ubah"
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
    changePassword,
    loading,
    error
  };
};
