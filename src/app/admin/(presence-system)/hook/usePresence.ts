import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { api } from '@/lib/api';

import { ApiError } from '@/types/api';
import {
  ApiResponse,
  CheckPresenceRequest,
  CheckPresenceResponse,
  Committee,
  CommitteeEvent,
  CreatePresenceForm,
  PaginatedResponse,
  Presence,
  PresenceListParams,
  SetStatusRequest,
  UpdatePresenceForm,
} from '@/types/entities/presence';

const PRESENCE_BASE_URL = '/admin/presences';

// Query keys
export const presenceKeys = {
  all: ['admin-presence'] as const,
  lists: () => [...presenceKeys.all, 'list'] as const,
  list: (params: PresenceListParams) =>
    [...presenceKeys.lists(), params] as const,
  details: () => [...presenceKeys.all, 'detail'] as const,
  detail: (id: string) => [...presenceKeys.details(), id] as const,
  committeesDropdown: () =>
    [...presenceKeys.all, 'committees-dropdown'] as const,
  eventsDropdown: () => [...presenceKeys.all, 'events-dropdown'] as const,
};

/**
 * Hook to fetch presences list with pagination, search, and filters
 */
export const useGetPresences = (params: PresenceListParams) => {
  return useQuery<PaginatedResponse<Presence>, AxiosError<ApiError>>({
    queryKey: presenceKeys.list(params),
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        page: String(params.page || 1),
        limit: String(params.limit || 10),
        ...(params.search && { search: params.search }),
        ...(params.event_id && { event_id: params.event_id }),
        ...(params.status &&
          params.status !== 'all' && { status: params.status }),
      });

      const response = await api.get<PaginatedResponse<Presence>>(
        `${PRESENCE_BASE_URL}?${queryParams.toString()}`,
      );
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Hook to fetch single presence detail (includes joined data)
 */
export const useGetPresenceDetail = (id: string | null) => {
  return useQuery<ApiResponse<Presence>, AxiosError<ApiError>>({
    queryKey: presenceKeys.detail(id || ''),
    queryFn: async () => {
      const response = await api.get<ApiResponse<Presence>>(
        `${PRESENCE_BASE_URL}/${id}`,
      );
      return response.data;
    },
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Hook to check presence for a committee at a specific event
 * This is a mutation because it's a POST request (not idempotent)
 */
export const useCheckPresence = () => {
  return useMutation<
    CheckPresenceResponse,
    AxiosError<ApiError>,
    { identifier: string; event_id: string }
  >({
    mutationFn: async ({ identifier, event_id }) => {
      const requestData: CheckPresenceRequest = {
        identifier,
        event_id,
      };

      const response = await api.post<ApiResponse<CheckPresenceResponse>>(
        `${PRESENCE_BASE_URL}/check`,
        requestData,
      );

      if (!response.data.data) {
        throw new Error('Committee not found');
      }

      return response.data.data;
    },
  });
};

/**
 * Hook to set presence status (upsert: create or update)
 */
export const useSetPresenceStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Presence>,
    AxiosError<ApiError>,
    { committee_id: string; event_id: string; status: 'attend' | 'skip' }
  >({
    mutationFn: async ({ committee_id, event_id, status }) => {
      const requestData: SetStatusRequest = {
        committee_id,
        event_id,
        status,
      };

      const response = await api.put<ApiResponse<Presence>>(
        `${PRESENCE_BASE_URL}/set-status`,
        requestData,
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the list cache to refetch
      queryClient.invalidateQueries({ queryKey: presenceKeys.lists() });
    },
  });
};

/**
 * Hook to create presence (manual - rarely used, prefer useSetPresenceStatus)
 */
export const useCreatePresence = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Presence>,
    AxiosError<ApiError>,
    CreatePresenceForm
  >({
    mutationFn: async (data: CreatePresenceForm) => {
      const response = await api.post<ApiResponse<Presence>>(
        PRESENCE_BASE_URL,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: presenceKeys.lists() });
    },
  });
};

/**
 * Hook to update presence status by ID
 */
export const useUpdatePresence = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Presence>,
    AxiosError<ApiError>,
    { id: string; data: UpdatePresenceForm }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await api.put<ApiResponse<Presence>>(
        `${PRESENCE_BASE_URL}/${id}`,
        data,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: presenceKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: presenceKeys.detail(variables.id),
      });
    },
  });
};

/**
 * Hook to delete presence
 */
export const useDeletePresence = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, AxiosError<ApiError>, string>({
    mutationFn: async (id: string) => {
      const response = await api.delete<ApiResponse>(
        `${PRESENCE_BASE_URL}/${id}`,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: presenceKeys.lists() });
    },
  });
};

/**
 * Hook to fetch committees for dropdown
 */
export const useGetCommitteesForDropdown = () => {
  return useQuery<Committee[], AxiosError<ApiError>>({
    queryKey: presenceKeys.committeesDropdown(),
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Committee>>(
        '/admin/committees?limit=1000',
      );
      return response.data.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch events for dropdown
 */
export const useGetEventsForDropdown = () => {
  return useQuery<CommitteeEvent[], AxiosError<ApiError>>({
    queryKey: presenceKeys.eventsDropdown(),
    queryFn: async () => {
      const response = await api.get<ApiResponse<CommitteeEvent[]>>(
        '/admin/committee-events/all',
      );
      return response.data.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
