import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

import api from '@/lib/api';

import { DANGER_TOAST, showToast, SUCCESS_TOAST } from '@/components/Toast';

import useAuthStore from '@/stores/useAuthStore';

import { ApiError } from '@/types/api';
import { LoginRequest, LoginResponse } from '@/types/login';

export const useLoginMutation = () => {
  const router = useRouter();

  const { login } = useAuthStore();

  const {
    mutate: handleLogin,
    isSuccess,
    isPending,
  } = useMutation<LoginResponse, AxiosError<ApiError>, LoginRequest>({
    mutationFn: async (data) => {
      const res = await api.post<LoginResponse>('/v1/auth/login', data);

      const { access_token, refresh_token, role } = res.data.data;

      login({
        access_token,
        refresh_token,
        role,
      });

      return res.data;
    },
    onSuccess: (_res) => {
      showToast('Login berhasil', SUCCESS_TOAST);
      router.push('/admin');
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data.error ||
        error.response?.data.message ||
        'Email atau password salah';
      showToast(message, DANGER_TOAST);
    },
  });

  return { handleLogin, isPending, isSuccess };
};
