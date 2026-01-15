import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import api from '@/lib/api';

import useAuthStore from '@/stores/useAuthStore';

import { ApiError, ApiResponse } from '@/types/api';

export interface MeResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  is_verified: boolean;
}

export const useGetMe = () => {
  const router = useRouter();
  const logout = useAuthStore.useLogout();

  const query = useQuery<ApiResponse<MeResponse>, AxiosError<ApiError>>({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<MeResponse>>('/user/me');
      return response.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (query.error) {
      const statusCode = query.error.response?.status;
      if (statusCode === 401) {
        // Token invalid, logout and redirect to login
        logout();
        router.push('/login');
      }
    }
  }, [query.error, logout, router]);

  return {
    ...query,
    user: query.data?.data ?? null,
  };
};
