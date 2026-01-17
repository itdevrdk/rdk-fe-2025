import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import api from '@/lib/api';

import { ApiError } from '@/types/api';
import {
  RicRegistration,
  RicRegistrationDetailResponse,
  RicRegistrationFormData,
  RicRegistrationListParams,
  RicRegistrationListResponse,
  RicRegistrationMutationResponse,
} from '@/types/entities/ric-admin';

const RIC_ADMIN_BASE_URL = '/admin/ric/registrations';

// Query keys
export const ricAdminKeys = {
  all: ['admin-ric'] as const,
  lists: () => [...ricAdminKeys.all, 'list'] as const,
  list: (params: RicRegistrationListParams) =>
    [...ricAdminKeys.lists(), params] as const,
  details: () => [...ricAdminKeys.all, 'detail'] as const,
  detail: (id: string) => [...ricAdminKeys.details(), id] as const,
};

/**
 * Hook to fetch RIC registrations list with pagination, search, and filtering
 */
export const useGetRicRegistrations = (params: RicRegistrationListParams) => {
  return useQuery<RicRegistrationListResponse, AxiosError<ApiError>>({
    queryKey: ricAdminKeys.list(params),
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.set('page', String(params.page));
      if (params.limit) queryParams.set('limit', String(params.limit));
      if (params.search) queryParams.set('search', params.search);
      if (params.status && params.status !== 'all') {
        queryParams.set('status', params.status);
      }

      const response = await api.get<RicRegistrationListResponse>(
        `${RIC_ADMIN_BASE_URL}?${queryParams.toString()}`,
      );
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Hook to fetch single RIC registration detail
 */
export const useGetRicRegistrationDetail = (id: string | null) => {
  return useQuery<RicRegistrationDetailResponse, AxiosError<ApiError>>({
    queryKey: ricAdminKeys.detail(id || ''),
    queryFn: async () => {
      const response = await api.get<RicRegistrationDetailResponse>(
        `${RIC_ADMIN_BASE_URL}/${id}`,
      );
      return response.data;
    },
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Hook to create a new RIC registration
 */
export const useCreateRicRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RicRegistrationMutationResponse,
    AxiosError<ApiError>,
    RicRegistrationFormData
  >({
    mutationFn: async (data: RicRegistrationFormData) => {
      const response = await api.post<RicRegistrationMutationResponse>(
        RIC_ADMIN_BASE_URL,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the list cache to refetch
      queryClient.invalidateQueries({ queryKey: ricAdminKeys.lists() });
    },
  });
};

/**
 * Hook to update an existing RIC registration
 */
export const useUpdateRicRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RicRegistrationMutationResponse,
    AxiosError<ApiError>,
    { id: string; data: RicRegistrationFormData }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await api.put<RicRegistrationMutationResponse>(
        `${RIC_ADMIN_BASE_URL}/${id}`,
        data,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate both list and detail cache
      queryClient.invalidateQueries({ queryKey: ricAdminKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: ricAdminKeys.detail(variables.id),
      });
    },
  });
};

/**
 * Hook to delete a RIC registration
 */
export const useDeleteRicRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RicRegistrationMutationResponse,
    AxiosError<ApiError>,
    string
  >({
    mutationFn: async (id: string) => {
      const response = await api.delete<RicRegistrationMutationResponse>(
        `${RIC_ADMIN_BASE_URL}/${id}`,
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the list cache to refetch
      queryClient.invalidateQueries({ queryKey: ricAdminKeys.lists() });
    },
  });
};

/**
 * Hook to export RIC registrations as PDF
 */
export const useExportRicPdf = () => {
  return useMutation<void, AxiosError<ApiError>, RicRegistrationListParams>({
    mutationFn: async (params) => {
      const queryParams = new URLSearchParams();

      if (params.search) queryParams.set('search', params.search);
      if (params.status && params.status !== 'all') {
        queryParams.set('status', params.status);
      }

      const response = await api.get(
        `${RIC_ADMIN_BASE_URL}/export/pdf?${queryParams.toString()}`,
        {
          responseType: 'blob',
        },
      );

      // Create download link
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ric-registrations-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
};

/**
 * Hook to export RIC registrations as Excel
 */
export const useExportRicExcel = () => {
  return useMutation<void, AxiosError<ApiError>, RicRegistrationListParams>({
    mutationFn: async (params) => {
      const queryParams = new URLSearchParams();

      if (params.search) queryParams.set('search', params.search);
      if (params.status && params.status !== 'all') {
        queryParams.set('status', params.status);
      }

      const response = await api.get(
        `${RIC_ADMIN_BASE_URL}/export/excel?${queryParams.toString()}`,
        {
          responseType: 'blob',
        },
      );

      // Create download link
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ric-registrations-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
};

/**
 * Prefetch registration detail (useful for hover prefetching)
 */
export const usePrefetchRicRegistrationDetail = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: ricAdminKeys.detail(id),
      queryFn: async () => {
        const response = await api.get<RicRegistrationDetailResponse>(
          `${RIC_ADMIN_BASE_URL}/${id}`,
        );
        return response.data;
      },
      staleTime: 60 * 1000,
    });
  };
};

/**
 * Get cached registration detail if available
 */
export const useGetCachedRicRegistration = (
  id: string | null,
): RicRegistration | null => {
  const queryClient = useQueryClient();

  if (!id) return null;

  const cachedData = queryClient.getQueryData<RicRegistrationDetailResponse>(
    ricAdminKeys.detail(id),
  );

  return cachedData?.data || null;
};
