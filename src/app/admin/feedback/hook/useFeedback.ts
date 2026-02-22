import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { api } from '@/lib/api';

import { ApiError } from '@/types/api';
import {
  FeedbackAdminListResponse,
  FeedbackAdminQuery,
  FeedbackBulkDeleteResponse,
  FeedbackDeleteResponse,
  FeedbackDetailResponse,
  FeedbackSummaryResponse,
} from '@/types/feedback';

const ADMIN_FEEDBACK_BASE_URL = '/admin/feedback';

function buildFeedbackQueryParams(params: FeedbackAdminQuery) {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.set('page', String(params.page));
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.search) queryParams.set('search', params.search);
  if (params.rating) queryParams.set('rating', params.rating);
  if (params.event) queryParams.set('event', params.event);
  if (params.sort) queryParams.set('sort', params.sort);

  return queryParams.toString();
}

async function getFeedbackList(params: FeedbackAdminQuery) {
  const queryString = buildFeedbackQueryParams(params);
  const { data } = await api.get<FeedbackAdminListResponse>(
    queryString
      ? `${ADMIN_FEEDBACK_BASE_URL}?${queryString}`
      : ADMIN_FEEDBACK_BASE_URL,
  );
  return data;
}

export function useGetFeedbackList(params: FeedbackAdminQuery) {
  return useQuery<FeedbackAdminListResponse, AxiosError<ApiError>>({
    queryKey: ['admin', 'feedback', 'list', params],
    queryFn: () => getFeedbackList(params),
    staleTime: 30 * 1000,
  });
}

async function getFeedbackSummary(eventName?: string) {
  const params = new URLSearchParams();
  if (eventName) params.set('event', eventName);

  const { data } = await api.get<FeedbackSummaryResponse>(
    `${ADMIN_FEEDBACK_BASE_URL}/summary${params.toString() ? `?${params.toString()}` : ''}`,
  );
  return data;
}

export function useGetFeedbackSummary(eventName?: string) {
  return useQuery<FeedbackSummaryResponse, AxiosError<ApiError>>({
    queryKey: ['admin', 'feedback', 'summary', eventName],
    queryFn: () => getFeedbackSummary(eventName),
    staleTime: 30 * 1000,
  });
}

async function getFeedbackDetail(id: string) {
  const { data } = await api.get<FeedbackDetailResponse>(
    `${ADMIN_FEEDBACK_BASE_URL}/${id}`,
  );
  return data;
}

export function useGetFeedbackDetail(
  id: string,
  options?: Partial<
    UseQueryOptions<FeedbackDetailResponse, AxiosError<ApiError>>
  >,
) {
  return useQuery<FeedbackDetailResponse, AxiosError<ApiError>>({
    queryKey: ['admin', 'feedback', 'detail', id],
    queryFn: () => getFeedbackDetail(id),
    staleTime: 30 * 1000,
    ...options,
  });
}

async function deleteFeedback(id: string) {
  const { data } = await api.delete<FeedbackDeleteResponse>(
    `${ADMIN_FEEDBACK_BASE_URL}/${id}`,
  );
  return data;
}

export function useDeleteFeedback() {
  const queryClient = useQueryClient();

  return useMutation<FeedbackDeleteResponse, AxiosError<ApiError>, string>({
    mutationFn: deleteFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'feedback'] });
    },
  });
}

async function bulkDeleteFeedback(ids: string[]) {
  const { data } = await api.post<FeedbackBulkDeleteResponse>(
    `${ADMIN_FEEDBACK_BASE_URL}/bulk-delete`,
    { ids },
  );
  return data;
}

export function useBulkDeleteFeedback() {
  const queryClient = useQueryClient();

  return useMutation<
    FeedbackBulkDeleteResponse,
    AxiosError<ApiError>,
    string[]
  >({
    mutationFn: bulkDeleteFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'feedback'] });
    },
  });
}
