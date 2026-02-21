import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import api from '@/lib/api';

import { ApiError } from '@/types/api';
import {
  FeedbackCreateApiResponse,
  FeedbackCreateRequest,
} from '@/types/feedback';

const PUBLIC_FEEDBACK_BASE_URL = '/feedback';

/**
 * Hook to create a new feedback (Public)
 */
export const useCreateFeedback = () => {
  return useMutation<
    FeedbackCreateApiResponse,
    AxiosError<ApiError>,
    FeedbackCreateRequest
  >({
    mutationFn: async (data: FeedbackCreateRequest) => {
      const response = await api.post<FeedbackCreateApiResponse>(
        PUBLIC_FEEDBACK_BASE_URL,
        data,
      );
      return response.data;
    },
  });
};
