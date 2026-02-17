import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { api } from '@/lib/api';

import { ApiError } from '@/types/api';
import {
  RsvpAdminCreateRequest,
  RsvpAdminCreateResponse,
  RsvpAdminListItem,
  RsvpAdminMeta,
  RsvpAdminQuery,
  RsvpByCodeData,
  RsvpDetailsData,
  RsvpStatusUpdateRequest,
  RsvpStatusUpdateResponse,
  RsvpSummary,
  RsvpSummaryResponse,
} from '@/types/rsvp';

const RSVP_ADMIN_BASE_URL = '/admin/rsvp';

export const rsvpAdminKeys = {
  all: ['admin-rsvp'] as const,
  lists: () => [...rsvpAdminKeys.all, 'list'] as const,
  list: (params: RsvpAdminQuery) => [...rsvpAdminKeys.lists(), params] as const,
  details: () => [...rsvpAdminKeys.all, 'detail'] as const,
  detail: (code: string) => [...rsvpAdminKeys.details(), code] as const,
  summaries: () => [...rsvpAdminKeys.all, 'summary'] as const,
  summary: (eventName?: string) =>
    [...rsvpAdminKeys.summaries(), eventName || 'all'] as const,
};

interface RsvpAdminListResponse {
  code: number;
  status: boolean;
  message: string;
  data: RsvpAdminListItem[];
  meta: RsvpAdminMeta;
}

/**
 * Hook to fetch RSVP list
 */
export const useGetRsvps = (params: RsvpAdminQuery) => {
  return useQuery<RsvpAdminListResponse, AxiosError<ApiError>>({
    queryKey: rsvpAdminKeys.list(params),
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.set('page', String(params.page));
      if (params.limit) queryParams.set('limit', String(params.limit));
      if (params.search) queryParams.set('search', params.search);
      // Always send event_name parameter, even if empty
      queryParams.set('event_name', params.event_name ?? '');
      if (params.status) queryParams.set('status', params.status);

      const response = await api.get<RsvpAdminListResponse>(
        `${RSVP_ADMIN_BASE_URL}?${queryParams.toString()}`,
      );
      return response.data;
    },
    staleTime: 30 * 1000,
  });
};

/**
 * Hook to fetch single RSVP detail
 */
export const useGetRsvpDetail = (code: string | null) => {
  return useQuery<
    { data: RsvpDetailsData; code: number; status: boolean; message: string },
    AxiosError<ApiError>
  >({
    queryKey: rsvpAdminKeys.detail(code || ''),
    queryFn: async () => {
      const response = await api.get<{
        data: RsvpDetailsData;
        code: number;
        status: boolean;
        message: string;
      }>(`${RSVP_ADMIN_BASE_URL}/${code}/details`);
      return response.data;
    },
    enabled: !!code,
    staleTime: 60 * 1000,
  });
};

/**
 * Hook to fetch RSVP by code (for check-in verification)
 * Using the endpoint /admin/rsvp/:code
 */
export const useGetRsvpByCode = (code: string | null) => {
  return useQuery<
    { data: RsvpByCodeData; code: number; status: boolean; message: string },
    AxiosError<ApiError>
  >({
    queryKey: rsvpAdminKeys.detail(code || ''), // Reusing detail key or create a new one if strictly necessary
    queryFn: async () => {
      const response = await api.get<{
        data: RsvpByCodeData;
        code: number;
        status: boolean;
        message: string;
      }>(`${RSVP_ADMIN_BASE_URL}/${code}`);
      return response.data;
    },
    enabled: !!code,
    retry: false, // Don't retry if not found
  });
};

/**
 * Hook to fetch RSVP summary statistics
 * Efficient endpoint for getting counts without pagination
 */
export const useGetRsvpSummary = (eventName?: string) => {
  return useQuery<RsvpSummary, AxiosError<ApiError>>({
    queryKey: rsvpAdminKeys.summary(eventName),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (eventName) {
        params.set('event_name', eventName);
      }

      const response = await api.get<RsvpSummaryResponse>(
        `${RSVP_ADMIN_BASE_URL}/summary${params.toString() ? `?${params.toString()}` : ''}`,
      );
      return response.data.data;
    },
    staleTime: 30 * 1000, // Cache 30 seconds
    refetchOnWindowFocus: true,
  });
};

/**
 * Hook to update status (Check-in)
 */
export const useUpdateRsvpStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    {
      data: RsvpStatusUpdateResponse;
      code: number;
      status: boolean;
      message: string;
    },
    AxiosError<ApiError>,
    { code: string } & RsvpStatusUpdateRequest
  >({
    mutationFn: async ({ code, status }) => {
      const response = await api.patch<{
        data: RsvpStatusUpdateResponse;
        code: number;
        status: boolean;
        message: string;
      }>(`${RSVP_ADMIN_BASE_URL}/${code}/status`, { status });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: rsvpAdminKeys.summaries(),
      });
      queryClient.invalidateQueries({
        queryKey: rsvpAdminKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: rsvpAdminKeys.detail(variables.code),
      });
    },
  });
};

/**
 * Hook to create RSVP manually by admin
 */
export const useCreateRsvpManual = () => {
  const queryClient = useQueryClient();

  return useMutation<
    {
      data: RsvpAdminCreateResponse;
      code: number;
      status: boolean;
      message: string;
    },
    AxiosError<ApiError>,
    RsvpAdminCreateRequest
  >({
    mutationFn: async (payload) => {
      const response = await api.post<{
        data: RsvpAdminCreateResponse;
        code: number;
        status: boolean;
        message: string;
      }>(`${RSVP_ADMIN_BASE_URL}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: rsvpAdminKeys.summaries(),
      });
      queryClient.invalidateQueries({
        queryKey: rsvpAdminKeys.lists(),
      });
    },
  });
};
