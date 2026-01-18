import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import api from '@/lib/api';

import { ApiError } from '@/types/api';
import {
  CreateSuggestionRequest,
  SuggestionMutationResponse,
} from '@/types/entities/suggestion';

const PUBLIC_SUGGESTION_BASE_URL = '/suggestions';

/**
 * Hook to create a new Suggestion (Public)
 */
export const useCreateSuggestion = () => {
  return useMutation<
    SuggestionMutationResponse,
    AxiosError<ApiError>,
    CreateSuggestionRequest
  >({
    mutationFn: async (data: CreateSuggestionRequest) => {
      const response = await api.post<SuggestionMutationResponse>(
        PUBLIC_SUGGESTION_BASE_URL,
        data,
      );
      return response.data;
    },
  });
};
