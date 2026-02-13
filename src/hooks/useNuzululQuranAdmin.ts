import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { api } from '@/lib/api';

import { ApiError } from '@/types/api';
import {
  NuzululQuranAdminListResponse,
  NuzululQuranDetailResponse,
  NuzululQuranQuery,
  NuzululQuranStatusUpdateResponse,
} from '@/types/nuzulul-quran';

const NUZULUL_QURAN_ADMIN_BASE_URL = '/admin/rsvp';

export const nuzululQuranAdminKeys = {
  all: ['admin-nuzulul-quran'] as const,
  lists: () => [...nuzululQuranAdminKeys.all, 'list'] as const,
  list: (params: NuzululQuranQuery) =>
    [...nuzululQuranAdminKeys.lists(), params] as const,
  details: () => [...nuzululQuranAdminKeys.all, 'detail'] as const,
  detail: (code: string) => [...nuzululQuranAdminKeys.details(), code] as const,
};

/**
 * Hook to fetch Nuzulul Quran registrations list
 */
export const useGetNuzululQuranRegistrations = (params: NuzululQuranQuery) => {
  return useQuery<NuzululQuranAdminListResponse, AxiosError<ApiError>>({
    queryKey: nuzululQuranAdminKeys.list(params),
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.set('page', String(params.page));
      if (params.limit) queryParams.set('limit', String(params.limit));
      if (params.search) queryParams.set('search', params.search);
      if (params.event_name) queryParams.set('event_name', params.event_name);
      if (params.status && params.status !== 'all') {
        queryParams.set('status', params.status);
      }

      const response = await api.get<NuzululQuranAdminListResponse>(
        `${NUZULUL_QURAN_ADMIN_BASE_URL}?${queryParams.toString()}`,
      );
      return response.data;
    },
    staleTime: 30 * 1000,
  });
};

/**
 * Hook to fetch single Nuzulul Quran registration detail
 */
export const useGetNuzululQuranDetail = (code: string | null) => {
  return useQuery<NuzululQuranDetailResponse, AxiosError<ApiError>>({
    queryKey: nuzululQuranAdminKeys.detail(code || ''),
    queryFn: async () => {
      const response = await api.get<NuzululQuranDetailResponse>(
        `${NUZULUL_QURAN_ADMIN_BASE_URL}/${code}/details`,
      );
      return response.data;
    },
    enabled: !!code,
    staleTime: 60 * 1000,
  });
};

/**
 * Hook to update status (Check-in)
 */
export const useUpdateNuzululQuranStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    NuzululQuranStatusUpdateResponse,
    AxiosError<ApiError>,
    { code: string; status: 'joined' }
  >({
    mutationFn: async ({ code, status }) => {
      const response = await api.patch<NuzululQuranStatusUpdateResponse>(
        `${NUZULUL_QURAN_ADMIN_BASE_URL}/${code}/status`,
        { status },
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: nuzululQuranAdminKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: nuzululQuranAdminKeys.detail(variables.code),
      });
    },
  });
};
