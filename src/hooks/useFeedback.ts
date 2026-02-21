import { useCallback, useState } from 'react';

import { api } from '@/lib/api';

import { ApiResponse } from '@/types/api';
import {
  FeedbackCreateRequest,
  FeedbackCreateResponse,
} from '@/types/feedback';

/**
 * Hook for feedback operations (public endpoints)
 *
 * Provides functionality for:
 * - Submitting feedback (POST /api/v1/feedback)
 *
 * @example
 * ```tsx
 * const { loading, submitFeedback } = useFeedback();
 *
 * const handleSubmit = async (data) => {
 *   try {
 *     const response = await submitFeedback(data);
 *     console.log('Feedback submitted:', response.data);
 *   } catch (error) {
 *     console.error('Submission failed:', error);
 *   }
 * };
 * ```
 */
export const useFeedback = () => {
  const [loading, setLoading] = useState(false);

  /**
   * Submit new feedback
   *
   * @param data - Feedback data including name, rating, and message
   * @returns API response with feedback data
   * @throws {AxiosError} 422 - Validation error (missing required fields)
   *
   * @example
   * ```tsx
   * const result = await submitFeedback({
   *   name: "Ahmad Fauzi",
   *   rating: "happy",
   *   message: "Website sangat membantu!"
   * });
   * console.log('Submitted with ID:', result.data.id);
   * ```
   */
  const submitFeedback = useCallback(
    async (
      data: FeedbackCreateRequest,
    ): Promise<ApiResponse<FeedbackCreateResponse>> => {
      setLoading(true);
      try {
        const response = await api.post<ApiResponse<FeedbackCreateResponse>>(
          '/feedback',
          data,
        );
        return response.data;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    submitFeedback,
  };
};
