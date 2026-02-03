import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

import api from '@/lib/api';

import { ApiError } from '@/types/api';
import {
  KhatamanDetailResponse,
  KhatamanListParams,
  KhatamanListResponse,
  KhatamanMutationResponse,
  KhatamanStatusUpdatePayload,
} from '@/types/entities/khataman';

const ADMIN_VOLUNTEER_BASE_URL = '/admin/volunteers';

// Query keys
export const khatamanAdminKeys = {
  all: ['admin-khataman'] as const,
  lists: () => [...khatamanAdminKeys.all, 'list'] as const,
  list: (params: KhatamanListParams) =>
    [...khatamanAdminKeys.lists(), params] as const,
  details: () => [...khatamanAdminKeys.all, 'detail'] as const,
  detail: (id: string) => [...khatamanAdminKeys.details(), id] as const,
};

/**
 * Hook to fetch Khataman participants list
 */
export const useGetKhatamanParticipants = (params: KhatamanListParams) => {
  return useQuery<KhatamanListResponse, AxiosError<ApiError>>({
    queryKey: khatamanAdminKeys.list(params),
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      queryParams.set('event_code', params.event_code);
      if (params.page) queryParams.set('page', String(params.page));
      if (params.per_page) queryParams.set('per_page', String(params.per_page));
      if (params.search) queryParams.set('search', params.search);

      if (params.registration_status && params.registration_status !== 'all') {
        queryParams.set('registration_status', params.registration_status);
      }

      if (params.participant_type && params.participant_type !== 'all') {
        queryParams.set('participant_type', params.participant_type);
      }

      const response = await api.get<KhatamanListResponse>(
        `${ADMIN_VOLUNTEER_BASE_URL}?${queryParams.toString()}`,
      );
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Hook to fetch single Khataman participant detail
 */
export const useGetKhatamanParticipantDetail = (id: string | null) => {
  return useQuery<KhatamanDetailResponse, AxiosError<ApiError>>({
    queryKey: khatamanAdminKeys.detail(id || ''),
    queryFn: async () => {
      const response = await api.get<KhatamanDetailResponse>(
        `${ADMIN_VOLUNTEER_BASE_URL}/${id}`,
      );
      return response.data;
    },
    enabled: !!id,
    staleTime: 60 * 1000,
  });
};

/**
 * Hook to update participant status
 */
export const useUpdateKhatamanStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    KhatamanMutationResponse,
    AxiosError<ApiError>,
    { id: string; payload: KhatamanStatusUpdatePayload }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await api.put<KhatamanMutationResponse>(
        `${ADMIN_VOLUNTEER_BASE_URL}/${id}/status`,
        payload,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate list and detail
      queryClient.invalidateQueries({ queryKey: khatamanAdminKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: khatamanAdminKeys.detail(variables.id),
      });
    },
  });
};

/**
 * Hook to export Khataman participants to CSV
 */

export const useExportKhatamanParticipants = () => {
  return useMutation<
    { data: Blob; headers: AxiosResponse['headers'] },
    AxiosError<ApiError>,
    Omit<KhatamanListParams, 'page' | 'per_page'>
  >({
    mutationFn: async (params) => {
      const queryParams = new URLSearchParams();

      queryParams.set('event_code', params.event_code);
      if (params.search) queryParams.set('search', params.search);

      if (params.registration_status && params.registration_status !== 'all') {
        queryParams.set('registration_status', params.registration_status);
      }

      if (params.participant_type && params.participant_type !== 'all') {
        queryParams.set('participant_type', params.participant_type);
      }

      const response = await api.get(
        `${ADMIN_VOLUNTEER_BASE_URL}/export/csv?${queryParams.toString()}`,
        {
          responseType: 'blob',
        },
      );
      return { data: response.data, headers: response.headers };
    },
    onSuccess: ({ data, headers }) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;

      // Try to get filename from content-disposition
      let filename = `khataman-participants-${new Date().toISOString().split('T')[0]}.csv`;
      const contentDisposition = headers['content-disposition'];
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch && fileNameMatch.length === 2) {
          filename = fileNameMatch[1];
        }
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
};
