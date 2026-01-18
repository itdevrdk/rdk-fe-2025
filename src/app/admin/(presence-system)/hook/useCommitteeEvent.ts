import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { api } from '@/lib/api';

import { ApiError } from '@/types/api';
import {
  ApiResponse,
  CommitteeEvent,
  CommitteeEventListParams,
  CreateCommitteeEventForm,
  PaginatedResponse,
  UpdateCommitteeEventForm,
} from '@/types/entities/presence';

const EVENT_BASE_URL = '/admin/committee-events';

// Query keys
export const committeeEventKeys = {
  all: ['admin-committee-event'] as const,
  lists: () => [...committeeEventKeys.all, 'list'] as const,
  list: (params: CommitteeEventListParams) =>
    [...committeeEventKeys.lists(), params] as const,
  details: () => [...committeeEventKeys.all, 'detail'] as const,
  detail: (id: string) => [...committeeEventKeys.details(), id] as const,
  dropdown: () => [...committeeEventKeys.all, 'dropdown'] as const,
};

/**
 * Hook to fetch events list with pagination and search
 */
export const useGetCommitteeEvents = (params: CommitteeEventListParams) => {
  return useQuery<PaginatedResponse<CommitteeEvent>, AxiosError<ApiError>>({
    queryKey: committeeEventKeys.list(params),
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        page: String(params.page || 1),
        limit: String(params.limit || 10),
        ...(params.search && { search: params.search }),
      });

      const response = await api.get<PaginatedResponse<CommitteeEvent>>(
        `${EVENT_BASE_URL}?${queryParams.toString()}`,
      );
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Hook to fetch single event detail
 */
export const useGetCommitteeEventDetail = (id: string | null) => {
  return useQuery<ApiResponse<CommitteeEvent>, AxiosError<ApiError>>({
    queryKey: committeeEventKeys.detail(id || ''),
    queryFn: async () => {
      const response = await api.get<ApiResponse<CommitteeEvent>>(
        `${EVENT_BASE_URL}/${id}`,
      );
      return response.data;
    },
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Hook to fetch all events for dropdown (using /all endpoint)
 */
export const useGetCommitteeEventsDropdown = () => {
  return useQuery<CommitteeEvent[], AxiosError<ApiError>>({
    queryKey: committeeEventKeys.dropdown(),
    queryFn: async () => {
      const response = await api.get<ApiResponse<CommitteeEvent[]>>(
        `${EVENT_BASE_URL}/all`,
      );
      return response.data.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to create a new event
 */
export const useCreateCommitteeEvent = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<CommitteeEvent>,
    AxiosError<ApiError>,
    CreateCommitteeEventForm
  >({
    mutationFn: async (data: CreateCommitteeEventForm) => {
      const response = await api.post<ApiResponse<CommitteeEvent>>(
        EVENT_BASE_URL,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: committeeEventKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: committeeEventKeys.dropdown(),
      });
    },
  });
};

/**
 * Hook to update an existing event
 */
export const useUpdateCommitteeEvent = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<CommitteeEvent>,
    AxiosError<ApiError>,
    { id: string; data: UpdateCommitteeEventForm }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await api.put<ApiResponse<CommitteeEvent>>(
        `${EVENT_BASE_URL}/${id}`,
        data,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: committeeEventKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: committeeEventKeys.dropdown(),
      });
      queryClient.invalidateQueries({
        queryKey: committeeEventKeys.detail(variables.id),
      });
    },
  });
};

/**
 * Hook to delete an event
 */
export const useDeleteCommitteeEvent = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, AxiosError<ApiError>, string>({
    mutationFn: async (id: string) => {
      const response = await api.delete<ApiResponse>(`${EVENT_BASE_URL}/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: committeeEventKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: committeeEventKeys.dropdown(),
      });
    },
  });
};
