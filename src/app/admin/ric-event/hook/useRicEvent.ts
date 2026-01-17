import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import api from '@/lib/api';

import { ApiError } from '@/types/api';
import {
  CreateRicEventRequest,
  RicEventDetailResponse,
  RicEventListResponse,
  RicEventMutationResponse,
  RicEventQuery,
  UpdateRicEventRequest,
} from '@/types/entities/ric-event';

const RIC_EVENT_BASE_URL = '/admin/ric-event';

// Query keys
export const ricEventKeys = {
  all: ['admin-ric-event'] as const,
  lists: () => [...ricEventKeys.all, 'list'] as const,
  list: (params: RicEventQuery) => [...ricEventKeys.lists(), params] as const,
  details: () => [...ricEventKeys.all, 'detail'] as const,
  detail: (id: string) => [...ricEventKeys.details(), id] as const,
};

/**
 * Hook to fetch RIC events list with pagination, search, and filtering
 */
export const useGetRicEvents = (params: RicEventQuery) => {
  return useQuery<RicEventListResponse, AxiosError<ApiError>>({
    queryKey: ricEventKeys.list(params),
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.set('page', String(params.page));
      if (params.limit) queryParams.set('limit', String(params.limit));
      if (params.search) queryParams.set('search', params.search);
      if (params.event_type) queryParams.set('event_type', params.event_type);
      if (params.sort_by) queryParams.set('sort_by', params.sort_by);
      if (params.sort_order) queryParams.set('sort_order', params.sort_order);

      const response = await api.get<RicEventListResponse>(
        `${RIC_EVENT_BASE_URL}?${queryParams.toString()}`,
      );
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Hook to fetch single RIC event detail
 */
export const useGetRicEventDetail = (id: string | null) => {
  return useQuery<RicEventDetailResponse, AxiosError<ApiError>>({
    queryKey: ricEventKeys.detail(id || ''),
    queryFn: async () => {
      const response = await api.get<RicEventDetailResponse>(
        `${RIC_EVENT_BASE_URL}/${id}`,
      );
      return response.data;
    },
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Hook to create a new RIC event
 */
export const useCreateRicEvent = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RicEventMutationResponse,
    AxiosError<ApiError>,
    CreateRicEventRequest
  >({
    mutationFn: async (data: CreateRicEventRequest) => {
      const response = await api.post<RicEventMutationResponse>(
        RIC_EVENT_BASE_URL,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the list cache to refetch
      queryClient.invalidateQueries({ queryKey: ricEventKeys.lists() });
    },
  });
};

/**
 * Hook to update an existing RIC event
 */
export const useUpdateRicEvent = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RicEventMutationResponse,
    AxiosError<ApiError>,
    { id: string; data: UpdateRicEventRequest }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await api.put<RicEventMutationResponse>(
        `${RIC_EVENT_BASE_URL}/${id}`,
        data,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate the list cache and specific detail cache
      queryClient.invalidateQueries({ queryKey: ricEventKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: ricEventKeys.detail(variables.id),
      });
    },
  });
};

/**
 * Hook to delete an RIC event
 */
export const useDeleteRicEvent = () => {
  const queryClient = useQueryClient();

  return useMutation<RicEventMutationResponse, AxiosError<ApiError>, string>({
    mutationFn: async (id: string) => {
      const response = await api.delete<RicEventMutationResponse>(
        `${RIC_EVENT_BASE_URL}/${id}`,
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the list cache to refetch
      queryClient.invalidateQueries({ queryKey: ricEventKeys.lists() });
    },
  });
};

/**
 * Helper function to extract error message from API error
 */
export const getErrorMessage = (error: AxiosError<ApiError>): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.status === 409) {
    return 'Event type sudah ada. Silakan pilih jenis event lain.';
  }
  if (error.response?.status === 400) {
    return 'Data tidak valid. Silakan periksa kembali input Anda.';
  }
  return 'Terjadi kesalahan. Silakan coba lagi.';
};
