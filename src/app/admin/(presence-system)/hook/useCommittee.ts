import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { api } from '@/lib/api';

import { ApiError } from '@/types/api';
import {
  ApiResponse,
  Committee,
  CommitteeListParams,
  CreateCommitteeForm,
  PaginatedResponse,
  UpdateCommitteeForm,
} from '@/types/entities/presence';

const COMMITTEE_BASE_URL = '/admin/committees';

// Query keys
export const committeeKeys = {
  all: ['admin-committee'] as const,
  lists: () => [...committeeKeys.all, 'list'] as const,
  list: (params: CommitteeListParams) =>
    [...committeeKeys.lists(), params] as const,
  details: () => [...committeeKeys.all, 'detail'] as const,
  detail: (id: string) => [...committeeKeys.details(), id] as const,
  dropdown: () => [...committeeKeys.all, 'dropdown'] as const,
};

/**
 * Hook to fetch committees list with pagination and search
 */
export const useGetCommittees = (params: CommitteeListParams) => {
  return useQuery<PaginatedResponse<Committee>, AxiosError<ApiError>>({
    queryKey: committeeKeys.list(params),
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        page: String(params.page || 1),
        limit: String(params.limit || 10),
        ...(params.search && { search: params.search }),
      });

      const response = await api.get<PaginatedResponse<Committee>>(
        `${COMMITTEE_BASE_URL}?${queryParams.toString()}`,
      );
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Hook to fetch single committee detail
 */
export const useGetCommitteeDetail = (id: string | null) => {
  return useQuery<ApiResponse<Committee>, AxiosError<ApiError>>({
    queryKey: committeeKeys.detail(id || ''),
    queryFn: async () => {
      const response = await api.get<ApiResponse<Committee>>(
        `${COMMITTEE_BASE_URL}/${id}`,
      );
      return response.data;
    },
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Hook to fetch all committees for dropdown (no pagination)
 */
export const useGetCommitteesDropdown = () => {
  return useQuery<Committee[], AxiosError<ApiError>>({
    queryKey: committeeKeys.dropdown(),
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Committee>>(
        `${COMMITTEE_BASE_URL}?limit=1000`,
      );
      return response.data.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - longer since dropdown data changes less
  });
};

/**
 * Hook to create a new committee
 */
export const useCreateCommittee = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Committee>,
    AxiosError<ApiError>,
    CreateCommitteeForm
  >({
    mutationFn: async (data: CreateCommitteeForm) => {
      const response = await api.post<ApiResponse<Committee>>(
        COMMITTEE_BASE_URL,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the list cache to refetch
      queryClient.invalidateQueries({ queryKey: committeeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: committeeKeys.dropdown() });
    },
  });
};

/**
 * Hook to update an existing committee
 */
export const useUpdateCommittee = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Committee>,
    AxiosError<ApiError>,
    { id: string; data: UpdateCommitteeForm }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await api.put<ApiResponse<Committee>>(
        `${COMMITTEE_BASE_URL}/${id}`,
        data,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate both list and detail cache
      queryClient.invalidateQueries({ queryKey: committeeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: committeeKeys.dropdown() });
      queryClient.invalidateQueries({
        queryKey: committeeKeys.detail(variables.id),
      });
    },
  });
};

/**
 * Hook to delete a committee
 */
export const useDeleteCommittee = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, AxiosError<ApiError>, string>({
    mutationFn: async (id: string) => {
      const response = await api.delete<ApiResponse>(
        `${COMMITTEE_BASE_URL}/${id}`,
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the list cache to refetch
      queryClient.invalidateQueries({ queryKey: committeeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: committeeKeys.dropdown() });
    },
  });
};
