import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import api from '@/lib/api';

import { ApiError } from '@/types/api';
import {
  GetSuggestionsResponse,
  SuggestionMutationResponse,
  SuggestionQuery,
  UpdateStatusRequest,
} from '@/types/entities/suggestion';

const ADMIN_SUGGESTION_BASE_URL = '/admin/suggestions';

// Query keys
export const suggestionKeys = {
  all: ['suggestions'] as const,
  lists: () => [...suggestionKeys.all, 'list'] as const,
  list: (params: SuggestionQuery) =>
    [...suggestionKeys.lists(), params] as const,
};

/**
 * Hook to fetch Suggestions list with pagination, search, and filtering
 */
export const useGetSuggestions = (params: SuggestionQuery) => {
  return useQuery<GetSuggestionsResponse, AxiosError<ApiError>>({
    queryKey: suggestionKeys.list(params),
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.set('page', String(params.page));
      if (params.limit) queryParams.set('limit', String(params.limit));
      if (params.search) queryParams.set('search', params.search);
      if (params.status) queryParams.set('status', params.status);

      const response = await api.get<GetSuggestionsResponse>(
        `${ADMIN_SUGGESTION_BASE_URL}?${queryParams.toString()}`,
      );
      return response.data;
    },
    staleTime: 30 * 1000,
  });
};

/**
 * Hook to update Suggestion Status (Admin)
 */
export const useUpdateSuggestionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SuggestionMutationResponse,
    AxiosError<ApiError>,
    { id: string; data: UpdateStatusRequest }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await api.patch<SuggestionMutationResponse>(
        `${ADMIN_SUGGESTION_BASE_URL}/${id}/status`,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the list cache to refetch
      queryClient.invalidateQueries({ queryKey: suggestionKeys.lists() });
    },
  });
};
